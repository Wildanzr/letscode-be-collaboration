const { ClientError } = require('../error')
const {
  createRoomSchema,
  joinRoomSchema,
  updateCodeSchema,
  leaveRoomSchema,
  submitCodeSchema,
  runCodeSchema
} = require('./schema')

class Validator {
  constructor () {
    this.name = 'validator'
  }

  validateCreateRoom (payload) {
    const { error } = createRoomSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateJoinRoom (payload) {
    const { error } = joinRoomSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateUpdateCode (payload) {
    const { error } = updateCodeSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateLeaveRoom (payload) {
    const { error } = leaveRoomSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateSubmitCode (payload) {
    const { error } = submitCodeSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateRunCode (payload) {
    const { error } = runCodeSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }
}

module.exports = {
  Validator
}
