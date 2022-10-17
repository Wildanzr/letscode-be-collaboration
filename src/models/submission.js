const { model, Schema } = require('mongoose')
const { nanoid } = require('nanoid')

const submissionSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `sbm-${nanoid(15)}` }
  },
  code: { type: String, required: true },
  languageCode: { type: Number, required: true },
  status: { type: Number, required: true, default: 0 },
  point: { type: Number, required: true, default: 0 },
  submitAt: { type: Date, default: () => { return new Date() } }
})

// Create model
const Submission = model('submissions', submissionSchema)

module.exports = {
  Submission,
  submissionSchema
}
