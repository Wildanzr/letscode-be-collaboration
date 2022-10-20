const { ClientError } = require('../error')
const { createCollaborationSchema } = require('./schema')

class Validator {
  constructor () {
    this.name = 'validator'
  }

  validateCreateCollaboration (payload) {
    const { error } = createCollaborationSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }
}

module.exports = {
  Validator
}
