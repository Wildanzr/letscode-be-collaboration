const { ClientError } = require('../error')

class CacheService {
  constructor (cache) {
    this.name = 'cacheService'
    this._cache = cache
  }

  // Old
  async setCode (room, code) {
    try {
      await this._cache.set(room, code)
    } catch (error) {
      console.log(error)
      throw new ClientError(error.message, 400)
    }
  }

  async getCode (key) {
    try {
      const code = await this._cache.get(key)
      return code
    } catch (error) {
      console.log(error)
      throw new ClientError(error.message, 400)
    }
  }

  // Product start from here
  async setCodeInRoom (room, code) {
    console.log(room)
    console.log(code)
    try {
      await this._cache.set(room, code)
    } catch (error) {
      console.log(error)
      throw new ClientError(error.message, 400)
    }
  }

  async getCodeInRoom (room) {
    try {
      const code = await this._cache.get(room)
      return code
    } catch (error) {
      console.log(error)
      throw new ClientError(error.message, 400)
    }
  }
}

module.exports = {
  CacheService
}