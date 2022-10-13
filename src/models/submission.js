const mongoose = require('mongoose')
const { Schema } = mongoose
const nanoid = require('nanoid')

const { userSchema, problemSchema } = require('./index')

const submissionSchema = new Schema({
  _id: {
    type: String,
    default: `sbm-${nanoid(15)}`
  },
  problemId: problemSchema,
  userId: userSchema,
  code: { type: String, required: true },
  language: { type: Number, required: true },
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
