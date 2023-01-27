const { model, Schema } = require('mongoose')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 15)

const collaborationSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `clb-${nanoid(15)}` }
  },
  competeProblemId: { type: Schema.Types.String, ref: 'competeProblems' },
  language: { type: Number, default: null },
  codeId: { type: String, required: true }, // Also used as room name
  participants: [{ type: Schema.Types.String, ref: 'users' }],
  createdAt: { type: Date, default: () => { return new Date() } }
})

// Index model auto delete in 5 hours
collaborationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 18000 })

// Add index to codeId for faster query
collaborationSchema.index({ codeId: 1 })

// Create model
const Collaboration = model('collaborations', collaborationSchema)

module.exports = {
  Collaboration,
  collaborationSchema
}
