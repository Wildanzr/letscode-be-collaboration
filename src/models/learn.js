const mongoose = require('mongoose')
const { Schema } = mongoose
const nanoid = require('nanoid')

const { problemSchema } = require('./index')

const learnSchema = new Schema({
  _id: {
    type: String,
    default: `lrn-${nanoid(15)}`
  },
  problemId: problemSchema,
  stage: { type: String, required: true }
})

// Create model
const Learn = mongoose.model('learns', learnSchema)

module.exports = {
  Learn,
  learnSchema
}
