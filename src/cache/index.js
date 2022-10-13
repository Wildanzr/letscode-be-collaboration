const redis = require('redis')

class CacheService {
  constructor () {
    // Create a new redis client
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost'
      }
    })

    // Callback if an error occurs
    this._client.on('error', (error) => console.error(error))

    // Connect to redis
    this._client.connect(() => {
      console.log('Redis connected')
    })
  }

  async set (key, value, expirationInSeconds = 3600) {
    await this._client.set(key, value, { EX: expirationInSeconds })
  }

  async get (key) {
    const result = await this._client.get(key)

    if (result === null) throw new Error('Key not found')

    return result
  }

  async del (key) {
    return this._client.del(key)
  }
}

module.exports = CacheService
