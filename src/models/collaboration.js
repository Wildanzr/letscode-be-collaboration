const mongoose = require('mongoose')
const { Schema } = mongoose
const { nanoid } = require('nanoid')

const collaborationSchema = new Schema({
  _id: {
    type: String,
    default: `clb-${nanoid(15)}`
  },
  problemId: { type: Schema.Types.String, ref: 'problems' },
  codeId: { type: String, required: true },
  driver: { type: Schema.Types.String, ref: 'users' },
  navigator: { type: Schema.Types.String, ref: 'users' }
})

// Create model
const Collaboration = mongoose.model('collaborations', collaborationSchema)

module.exports = {
  Collaboration,
  collaborationSchema
}
