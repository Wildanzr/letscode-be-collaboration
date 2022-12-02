// const { ClientError } = require('../error')

class CollaborationController {
  constructor (collaborationService, cacheService, validator, tokenize, response) {
    this.name = 'collaboration'
    this._collaborationService = collaborationService
    this._cacheService = cacheService
    this._validator = validator
    this._tokenize = tokenize
    this._response = response

    // Old
    this.mvpJoin = this.mvpJoin.bind(this)
    this.mvpCode = this.mvpCode.bind(this)

    // New
    this.createRoom = this.createRoom.bind(this)
  }

  // This will be deleted
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

  // New Code
  async createRoom (payload, socket) {
    try {
      // Validate payload
      this._validator.validateCreateRoom(payload)

      // Create collaboration
      const collaboration = await this._collaborationService.createCollaboration(payload)

      // Destructure collaboration
      const { codeId } = collaboration

      // Create starter code in cache
      const codeData = {
        selectedLanguage: null,
        code: null
      }

      // Create room in cache
      await this._cacheService.setCodeInRoom(codeId, JSON.stringify(codeData))

      // Join socket room
      socket.join(codeId)

      // Emit response
      socket.emit('res_create_room', this._response.success(201, 'Room created', collaboration))
    } catch (error) {
      console.log(error)
      socket.emit('res_create_room', this._response.error(error))
    }
  }
}

module.exports = {
  CollaborationController
}
