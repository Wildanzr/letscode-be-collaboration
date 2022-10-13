const mongoose = require('mongoose')
const { Schema } = mongoose
const { nanoid } = require('nanoid')

const testCasesSchema = new Schema({
  _id: {
    type: String,
    default: `sc-${nanoid(15)}`
  },
  input: { type: String, required: true },
  output: { type: String, required: true }
})

// Create model
const TestCases = mongoose.model('testcases', testCasesSchema)

module.exports = {
  TestCases,
  testCasesSchema
}
