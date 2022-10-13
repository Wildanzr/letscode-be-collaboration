const mongoose = require('mongoose')
const { Schema } = mongoose
const nanoid = require('nanoid')

const { problemSchema } = require('./index')

const challengeSchema = new Schema({
  _id: {
    type: String,
    default: `ch-${nanoid(15)}`
  },
  problemId: problemSchema,
  level: { type: Number, required: true }
})

// Create model
const Challenge = mongoose.model('challenges', challengeSchema)

module.exports = {
  Challenge,
  challengeSchema
}
