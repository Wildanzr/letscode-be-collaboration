const { ClientError } = require('../error')
const { createRoomSchema, joinRoomSchema, updateCodeSchema, leaveRoomSchema } = require('./schema')

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

  async validateUpdateCode (payload) {
    const { error } = updateCodeSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  async validateLeaveRoom (payload) {
    const { error } = leaveRoomSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }
}

module.exports = {
  Validator
}
