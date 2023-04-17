const { logger } = require('../utils/loggger')

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
      socket.emit('res_run_code', this._response.success(200, 'Berhasil menjalankan kode, menunggu hasil penilaian', { tokens, type, mode }))
    } catch (error) {
      logger.error(error)
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
      socket.emit('res_submit_code', this._response.success(200, 'Berhasil mengumpulkan kode, menunggu hasil penilaian', { tokens, type, mode }))
    } catch (error) {
      logger.error(error)
      socket.emit('res_submit_code', this._response.error(error))
    }
  }
}

module.exports = {
  SubmissionController
}
