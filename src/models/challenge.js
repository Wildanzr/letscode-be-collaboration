const mongoose = require('mongoose')
const { Schema } = mongoose
const { nanoid } = require('nanoid')

const challengeSchema = new Schema({
  _id: {
    type: String,
    default: `ch-${nanoid(15)}`
  },
  problemId: { type: Schema.Types.String, ref: 'problems' },
  level: { type: Number, required: true }
})

// Create model
const Challenge = mongoose.model('challenges', challengeSchema)

module.exports = {
  Challenge,
  challengeSchema
}
