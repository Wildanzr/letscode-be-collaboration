const mongoose = require('mongoose')
const { Schema } = mongoose
const nanoid = require('nanoid')

const {
  userSchema,
  durationSchema,
  testCasesSchema,
  sampleCasesSchema,
  participantSchema
} = require('./index')

const problemSchema = new Schema({
  _id: {
    type: String,
    default: `pbl-${nanoid(15)}`
  },
  title: { type: String, required: true, unique: true, minlength: 3 },
  challenger: userSchema,
  description: { type: String, required: true },
  constraint: { type: String, required: true },
  point: { type: Number, required: true },
  inputFormat: { type: String, required: true },
  outputFormat: { type: String, required: true },
  sampleCases: [sampleCasesSchema],
  testCases: [testCasesSchema],
  duration: durationSchema,
  languageAllowed: { type: Array, required: true },
  participants: [participantSchema]
})

// Create model
const Problem = mongoose.model('problems', problemSchema)

module.exports = {
  Problem,
  problemSchema
}
