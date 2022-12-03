// Create Server
require('dotenv').config()
const server = require('http').createServer()

// Mongo DB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
  useNewURLParser: true,
  useUnifiedTopology: true
}).then(console.log('connected to db')).catch((err) => console.log(err))

// Cache
const { Cache } = require('./src/cache')
const cache = new Cache()

// Validator
const { Validator } = require('./src/validators')
const validator = new Validator()

// Utils
const { Response, Tokenize } = require('./src/utils')
const response = new Response()
const tokenize = new Tokenize()

// Services
const { CollaborationService, CacheService } = require('./src/services')
const collaborationService = new CollaborationService()
const cacheService = new CacheService(cache)

// Controllers
const { CollaborationController } = require('./src/controllers')
const collaborationController = new CollaborationController(collaborationService, cacheService, validator, tokenize, response)

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

io.on('connection', async (socket) => {
  console.log(`Client connected [id=${socket.id}]`)

  // Old Code
  // MVP Room
  socket.on('req_mvp_join', async (payload) => {
    console.log('Someone requested to join MVP room')
    await collaborationController.mvpJoin(payload, socket)
  })

  // MVP Code Collaboration
  socket.on('req_mvp_code', async (payload) => {
    // console.log('Someone requested to send code')
    await collaborationController.mvpCode(payload, socket)

    // Broadcast the comment to everyone in the same room
    socket.to(payload.room).emit('res_mvp_code', payload)
  })

  // New Code
  socket.on('req_create_room', async (payload) => {
    await collaborationController.createRoom(payload, socket)
  })

  socket.on('req_join_room', async (payload) => {
    await collaborationController.joinRoom(payload, socket)
  })

  socket.on('req_update_code', async (payload) => {
    await collaborationController.updateCode(payload, socket)
  })

  socket.on('req_save_code', async (payload) => {
    console.log('Someone requested to save code')
    // await collaborationController.saveCode(payload, socket)
  })

  socket.on('req_leave_room', async (payload) => {
    await collaborationController.leaveRoom(payload, socket)
  })

  // Disconnect
  socket.on('disconnect', async () => {
    console.log(`Client disconnected [id=${socket.id}]`)
    await collaborationController.forceLeaveRoom(socket)
  })
})

// Start server
server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})
