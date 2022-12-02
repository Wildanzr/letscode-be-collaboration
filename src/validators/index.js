const { ClientError } = require('../error')
const { createRoomSchema } = require('./schema')

class Validator {
  constructor () {
    this.name = 'validator'
  }

  async validateCreateRoom (payload) {
    const { error } = createRoomSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }
}

module.exports = {
  Validator
}
