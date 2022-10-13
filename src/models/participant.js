const mongoose = require('mongoose')
const { Schema } = mongoose
const nanoid = require('nanoid')

const { userSchema, submissionSchema } = require('./index')

const participantSchema = new Schema({
  _id: {
    type: String,
    default: `pnt-${nanoid(15)}`
  },
  userId: userSchema,
  currentPoint: { type: Number, required: true, default: 0 },
  listOfSubmission: [submissionSchema]
})

// Create model
const Participant = mongoose.model('participants', participantSchema)

module.exports = {
  Participant,
  participantSchema
}
