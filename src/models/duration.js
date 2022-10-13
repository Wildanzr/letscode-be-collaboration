const mongoose = require('mongoose')
const { Schema } = mongoose
const nanoid = require('nanoid')

const durationSchema = new Schema({
  _id: {
    type: String,
    default: `dtn-${nanoid(15)}`
  },
  start: { type: String, required: true },
  end: { type: String, required: true }
})

const Duration = mongoose.model('durations', durationSchema)

module.exports = {
  Duration,
  durationSchema
}
