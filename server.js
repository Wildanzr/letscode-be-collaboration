// Create Server
require('dotenv').config()
const server = require('http').createServer()

// Mongo DB
const mongoose = require('mongoose')

// Cache
const Cache = require('./src/cache')

// Connect to mongodb
mongoose.connect(process.env.DATABASE_URL, {
  useNewURLParser: true,
  useUnifiedTopology: true
}).then(console.log('connected to db')).catch((err) => console.log(err))

// Create a new cache service
const cache = new Cache()

const test = async () => {
  // Set a key
  await cache.set('test', 'kcuing')

  // Get a key
  let result = await cache.get('test')
  console.log(result)
  try {
    result = await cache.get('mong')
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

io.on('connection', async (socket) => {
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
