class Response {
  constructor () {
    this.name = 'response'
  }

  success (statusCode, message, data) {
    if (data) {
      return {
        status: true,
        message,
        statusCode,
        data
      }
    } else {
      return {
        status: true,
        message,
        statusCode
      }
    }
  }

  fail (statusCode, message) {
    return {
      status: false,
      message,
      statusCode
    }
  }

  error (error) {
    const { statusCode, message } = error
    const msg = message.replace(/['"]+/g, '')

    return this.fail(statusCode, msg)
  }
}

module.exports = {
  Response
}
