const Joi = require('joi')

const createCollaborationSchema = Joi.object({
  competeId: Joi.string().required(),
  problemId: Joi.string().required(),
  codeId: Joi.string().required(),
  driver: Joi.string().required(),
  navigator: Joi.string().required(),
  participants: Joi.array().items(Joi.string()).required()
})

module.exports = {
  createCollaborationSchema
}
