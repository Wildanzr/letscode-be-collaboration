// Create Server
require('dotenv').config()
const server = require('http').createServer()

// Mongo DB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
  useNewURLParser: true,
  useUnifiedTopology: true
}).then(console.log('connected to db')).catch((err) => console.log(err))

// Validator
const { Validator } = require('./src/validators')
const validator = new Validator()

// Utils
const { Response, Tokenize } = require('./src/utils')
const response = new Response()
const tokenize = new Tokenize()

// Services
const { CollaborationService, SubmissionService, Producer } = require('./src/services')
const collaborationService = new CollaborationService()
const submissionService = new SubmissionService()
const producer = new Producer()

// Controllers
const { CollaborationController, SubmissionController } = require('./src/controllers')
const collaborationController = new CollaborationController(collaborationService, validator, tokenize, response)
const submissionController = new SubmissionController(submissionService, producer, validator, response)

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

io.on('connection', async (socket) => {
  console.log(`Client connected [id=${socket.id}]`)

  socket.on('req_create_room', async (payload) => {
    await collaborationController.createRoom(payload, socket)
  })

  socket.on('req_join_room', async (payload) => {
    await collaborationController.joinRoom(payload, socket)
  })

  socket.on('req_update_lang', async (payload) => {
    await collaborationController.changeLanguage(payload, socket)
  })

  socket.on('req_leave_room', async (payload) => {
    await collaborationController.leaveRoom(payload, socket)
  })

  socket.on('req_run_code', async (payload) => {
    await submissionController.runCode(payload, socket)
  })

  socket.on('req_submit_code', async (payload) => {
    await submissionController.submitCode(payload, socket)
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
