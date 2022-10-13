const mongoose = require('mongoose')
const { Schema } = mongoose
const { nanoid } = require('nanoid')

const participantSchema = new Schema({
  _id: {
    type: String,
    default: `pnt-${nanoid(15)}`
  },
  userId: { type: Schema.Types.String, ref: 'users' },
  currentPoint: { type: Number, required: true, default: 0 },
  listOfSubmission: { type: Array(Schema.Types.String), ref: 'submissions' }
})

// Create model
const Participant = mongoose.model('participants', participantSchema)

module.exports = {
  Participant,
  participantSchema
}
