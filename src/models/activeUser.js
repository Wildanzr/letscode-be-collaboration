const { model, Schema } = require('mongoose')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 15)

const activeUserSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `act-${nanoid(15)}` }
  },
  isRealUser: { type: Boolean, default: true },
  userId: { type: Schema.Types.String, ref: 'users' },
  socketId: { type: String, required: true },
  createdAt: { type: Date, default: () => { return new Date() } }
})

// Index model auto delete in 5 hours
activeUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 18000 })

// Add index to userId and socketId for faster query
activeUserSchema.index({ socketId: 1 })
activeUserSchema.index({ userId: 1 })

// Create model
const ActiveUser = model('activeUsers', activeUserSchema)

module.exports = {
  ActiveUser,
  activeUserSchema
}
