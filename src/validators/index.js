const { ClientError } = require('../error')
const { createRoomSchema, joinRoomSchema } = require('./schema')

class Validator {
  constructor () {
    this.name = 'validator'
  }

  async validateCreateRoom (payload) {
    const { error } = createRoomSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  async validateJoinRoom (payload) {
    const { error } = joinRoomSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }
}

module.exports = {
  Validator
}
