// Create Server
require('dotenv').config()
const server = require('http').createServer()

// Cache
const Cache = require('./src/cache')

// Create a new cache service
const cache = new Cache()

const test = async () => {
  // Set a key
  await cache.set('test', 'toood')

  // Get a key
  const result = await cache.get('test')
  console.log(result)
}

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

test()
