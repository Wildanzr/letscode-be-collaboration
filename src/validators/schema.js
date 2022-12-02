const Joi = require('joi')

const createRoomSchema = Joi.object({
  userId: Joi.string().required(),
  competeProblemId: Joi.string().required()
})

const joinRoomSchema = Joi.object({
  userId: Joi.string().required(),
  roomId: Joi.string().required()
})

module.exports = {
  createRoomSchema,
  joinRoomSchema
}
