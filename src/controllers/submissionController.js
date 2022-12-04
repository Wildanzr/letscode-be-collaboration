class SubmissionController {
  constructor (submissionService, producer, validator, response) {
    this.name = 'SubmissionController'

    this._submissionService = submissionService
    this._producer = producer
    this._validator = validator
    this._response = response

    // Bind methods
    this.runCode = this.runCode.bind(this)
    this.submitCode = this.submitCode.bind(this)
  }

  async runCode (payload, socket) {
    try {
      // Validate payload
      this._validator.validateRunCode(payload)

      // Send payload to judge service
      const tokens = await this._submissionService.submitCode(payload)

      // Return response
      const { type, mode } = payload
      socket.emit('res_run_code', this._response.success(200, 'Run code success, wait for judging', { tokens, type, mode }))
    } catch (error) {
      console.log(error)
      socket.emit('res_run_code', this._response.error(error))
    }
  }

  async submitCode (payload, socket) {
    try {
      // Validate payload
      this._validator.validateSubmitCode(payload)

      // Send payload to judge service
      const tokens = await this._submissionService.submitCode(payload)

      // Make object for producer
      const { userId, competeProblemId, languageCode, code } = payload
      const submission = {
        userId,
        competeProblemId,
        languageCode,
        code,
        tokens
      }

      // Send tokens to producer
      await this._producer.sendMessage('submission', submission)

      // Return response
      const { type, mode } = payload
      socket.emit('res_submit_code', this._response.success(200, 'Submit code success, wait for judging', { tokens, type, mode }))
    } catch (error) {
      console.log(error)
      socket.emit('res_submit_code', this._response.error(error))
    }
  }
}

module.exports = {
  SubmissionController
}
