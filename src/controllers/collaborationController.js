// const { ClientError } = require('../error')

class CollaborationController {
  constructor (collaborationService, cacheService, validator, tokenize, response) {
    this.name = 'collaboration'
    this._collaborationService = collaborationService
    this._cacheService = cacheService
    this._validator = validator
    this._tokenize = tokenize
    this._response = response

    this.createCollaboration = this.createCollaboration.bind(this)
    this.hello = this.hello.bind(this)

    this.mvpJoin = this.mvpJoin.bind(this)
    this.mvpCode = this.mvpCode.bind(this)
  }

  async createCollaboration (payload, socket) {
    try {
      const result = 'createCollaboration'
      return result
    } catch (error) {
      console.log(error)
    }
  }

  async hello (payload, socket) {
    const { name } = payload

    const result = {
      greeting: `Hello ${name} from server`
    }

    // Send response back to client
    socket.emit('res_hello', result)
  }

  async mvpJoin (payload, socket) {
    // Set payload to enter room
    const { room } = payload

    socket.join(room)

    const response = {
      status: true,
      data: {
        room
      }
    }

    // Server emits this to see if mvp_room already exists
    socket.emit('res_mvp_join', response)
  }

  async mvpCode (payload, socket) {
    const { code, room } = payload

    try {
      // Set code to cache
      await this._cacheService.setCode('mvp_code', code)

      // Broadcast code to room
      socket.broadcast.to(room).emit('res_mvp_code', payload)
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = {
  CollaborationController
}
