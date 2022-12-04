const { ClientError } = require('../error')

const axios = require('axios')

class SubmissionService {
  constructor () {
    this.name = 'SubmissionService'
    this.url = process.env.JUDGE_API_URL
  }

  async submitCode (payload) {
    // Destructure payload
    const { config, mode } = payload
    // Define API URL
    const url = mode === 'single'
      ? this.url
      : `${this.url}/batch`

    // Define API Payload
    const options = {
      method: 'POST',
      url,
      params: { base64_encoded: 'true', fields: '*' },
      data: config
    }

    // Collet token results
    let tokens = []
    try {
      const res = await axios.request(options)
      if (mode === 'single') {
        tokens.push(res.data.token)
      } else {
        tokens = res.data.map((data) => data.token)
      }

      return tokens
    } catch (error) {
      console.error(error)
      throw new ClientError('Error submitting code', 500)
    }
  }
}

module.exports = {
  SubmissionService
}
