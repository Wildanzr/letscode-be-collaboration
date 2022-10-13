const mongoose = require('mongoose')
const { Schema } = mongoose
const { nanoid } = require('nanoid')

const submissionSchema = new Schema({
  _id: {
    type: String,
    default: `sbm-${nanoid(15)}`
  },
  problemId: { type: Schema.Types.String, ref: 'problems' },
  userId: { type: Schema.Types.String, ref: 'users' },
  code: { type: String, required: true },
  languageCode: { type: Number, required: true },
  status: { type: Number, required: true, default: 0 },
  points: { type: Number, required: true, default: 0 },
  submitedAt: { type: String, required: true }
})

// Create model
const Submission = mongoose.model('submissions', submissionSchema)

module.exports = {
  Submission,
  submissionSchema
}
