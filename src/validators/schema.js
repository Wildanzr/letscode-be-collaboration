const Joi = require('joi')

const createRoomSchema = Joi.object({
  userId: Joi.string().required(),
  competeProblemId: Joi.string().required()
})

const joinRoomSchema = Joi.object({
  userId: Joi.string().required(),
  roomId: Joi.string().required(),
  competeProblemId: Joi.string().required()
})

const updateCodeSchema = Joi.object({
  roomId: Joi.string().required(),
  selectedLanguage: Joi.number().allow(null).required(),
  code: Joi.string().allow('').required()
})

const leaveRoomSchema = Joi.object({
  userId: Joi.string().required(),
  roomId: Joi.string().required()
})

module.exports = {
  createRoomSchema,
  joinRoomSchema,
  updateCodeSchema,
  leaveRoomSchema
}
