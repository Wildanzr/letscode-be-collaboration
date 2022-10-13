const mongoose = require('mongoose')
const { Schema } = mongoose
const { nanoid } = require('nanoid')

const learnSchema = new Schema({
  _id: {
    type: String,
    default: `lrn-${nanoid(15)}`
  },
  problemId: { type: Schema.Types.String, ref: 'problems' },
  stage: { type: String, required: true }
})

// Create model
const Learn = mongoose.model('learns', learnSchema)

module.exports = {
  Learn,
  learnSchema
}
