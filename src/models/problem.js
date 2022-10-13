const mongoose = require('mongoose')
const { Schema } = mongoose
const { nanoid } = require('nanoid')

const problemSchema = new Schema({
  _id: {
    type: String,
    default: `pbl-${nanoid(15)}`
  },
  title: { type: String, required: true, unique: true, minlength: 3 },
  challenger: { type: Schema.Types.String, ref: 'users' },
  description: { type: String, required: true },
  constraint: { type: String, required: true },
  point: { type: Number, required: true },
  inputFormat: { type: String, required: true },
  outputFormat: { type: String, required: true },
  sampleCases: { type: Schema.Types.String, ref: 'sampleCases' },
  testCases: { type: Schema.Types.String, ref: 'testCases' },
  duration: { type: Schema.Types.String, ref: 'durations' },
  languageAllowed: { type: Array, required: true },
  participants: { type: Schema.Types.String, ref: 'participants' }
})

// Create model
const Problem = mongoose.model('problems', problemSchema)

module.exports = {
  Problem,
  problemSchema
}
