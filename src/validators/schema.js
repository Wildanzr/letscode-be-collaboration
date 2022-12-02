const Joi = require('joi')

const createRoomSchema = Joi.object({
  userId: Joi.string().required(),
  competeProblemId: Joi.string().required()
})

module.exports = {
  createRoomSchema
}
