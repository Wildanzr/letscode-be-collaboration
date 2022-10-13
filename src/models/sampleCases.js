const mongoose = require('mongoose')
const { Schema } = mongoose
const nanoid = require('nanoid')

const sampleCasesSchema = new Schema({
  _id: {
    type: String,
    default: `sc-${nanoid(15)}`
  },
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String, default: '' }
})

// Create model
const SampleCases = mongoose.model('sampleCases', sampleCasesSchema)

module.exports = {
  SampleCases,
  sampleCasesSchema
}
