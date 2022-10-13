require('dotenv').config()
const server = require('http').createServer()

// Mongo DB
const mongoose = require('mongoose')

// Connect to mongodb
mongoose.connect(process.env.DATABASE_URL, {
  useNewURLParser: true,
  useUnifiedTopology: true
}).then(console.log('connected to db')).catch((err) => console.log(err))

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log(`Client connected [id=${socket.id}]`)

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`Client gone [id=${socket.id}]`)
  })
})

// Start server
server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})
