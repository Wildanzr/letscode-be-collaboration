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

const submitCodeSchema = Joi.object({
  userId: Joi.string().required(),
  competeProblemId: Joi.string().required(),
  languageCode: Joi.number().required(),
  code: Joi.string().required(),
  config: Joi.array().items(Joi.object({}).unknown(true)).single().required(),
  mode: Joi.string().valid('single', 'batch').required(),
  type: Joi.string().valid('run', 'submission').required()
})

const runCodeSchema = Joi.object({
  config: Joi.array().items(Joi.object({}).unknown(true)).single().required(),
  mode: Joi.string().valid('single', 'batch').required(),
  type: Joi.string().valid('run', 'submission').required()
})

module.exports = {
  createRoomSchema,
  joinRoomSchema,
  updateCodeSchema,
  leaveRoomSchema,
  submitCodeSchema,
  runCodeSchema
}
