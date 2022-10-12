require('dotenv').config()
const server = require('http').createServer()
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
