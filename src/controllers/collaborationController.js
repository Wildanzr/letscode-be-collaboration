const { logger } = require('../utils/loggger')

class CollaborationController {
  constructor (collaborationService, validator, tokenize, response) {
    this.name = 'collaboration'
    this._collaborationService = collaborationService
    this._validator = validator
    this._tokenize = tokenize
    this._response = response

    // New
    this.createRoom = this.createRoom.bind(this)
    this.joinRoom = this.joinRoom.bind(this)
    this.changeLanguage = this.changeLanguage.bind(this)
    this.leaveRoom = this.leaveRoom.bind(this)
    this.forceLeaveRoom = this.forceLeaveRoom.bind(this)
  }

  // New Code
  async createRoom (payload, socket) {
    try {
      // Validate payload
      this._validator.validateCreateRoom(payload)

      // Create collaboration
      const collaboration = await this._collaborationService.createCollaboration(payload, socket.id)
      const { codeId } = collaboration

      // Join socket room
      socket.join(codeId)

      // Emit response
      socket.emit('res_create_room', this._response.success(201, 'Ruang kolaborasi berhasil dibuat', collaboration))
    } catch (error) {
      logger.error(error)
      socket.emit('res_create_room', this._response.error(error))
    }
  }

  async joinRoom (payload, socket) {
    try {
      // Validate payload
      this._validator.validateJoinRoom(payload)

      // Check if room exists
      const { roomId, competeProblemId, userId } = payload
      await this._collaborationService.checkCollaborationIsExistByCodeIdAndCPID(roomId, competeProblemId)

      // Delete old collaboration
      await this._collaborationService.deleteOldCollaboration(userId)

      // Update participants
      await this._collaborationService.addNewParticipant(roomId, userId, socket.id)

      // Join socket room
      socket.join(roomId)

      // Get collaboration details
      const collaboration = await this._collaborationService.getCollaborationByCodeId(roomId)

      // Broadcast to existing participants
      socket.broadcast.to(roomId).emit('res_update_participants', this._response.success(200, 'Ada partisipan baru bergabung', collaboration))

      // Create response
      const response = {
        collaboration
      }

      // Emit response
      socket.emit('res_join_room', this._response.success(200, 'Berhasil bergabung ruang kolaborasi', response))
    } catch (error) {
      logger.error(error)
      socket.emit('res_join_room', this._response.error(error))
    }
  }

  async leaveRoom (payload, socket) {
    try {
      // Validate payload
      this._validator.validateLeaveRoom(payload)

      // Check if roomId is null or not
      let { roomId, userId } = payload
      if (roomId === null) {
        const { codeId } = await this._collaborationService.getRoomIdByUserId(userId)
        roomId = codeId
      }

      await this._collaborationService.checkCollaborationIsExistByCodeId(roomId)

      // Update participants
      const result = await this._collaborationService.removeParticipant(roomId, userId)

      // Leave socket room
      socket.leave(roomId)

      if (result) {
        // Get collaboration details
        const collaboration = await this._collaborationService.getCollaborationByCodeId(roomId)

        // Broadcast to existing participants
        socket.broadcast.to(roomId).emit('res_participants_left', this._response.success(200, 'Ada partisipan keluar', collaboration))

        // Emit response
        socket.emit('res_leave_room', this._response.success(200, 'Berhasil keluar dari ruang kolaborasi', collaboration))
      }
    } catch (error) {
      logger.error(error)
      socket.emit('res_leave_room', this._response.error(error))
    }
  }

  async changeLanguage (payload, socket) {
    try {
      // Validate payload
      this._validator.validateUpdateLanguage(payload)

      // Update language
      const collaboration = await this._collaborationService.updateLanguage(payload)

      // Emit response
      const { roomId } = payload
      socket.broadcast.to(roomId).emit('res_update_lang', this._response.success(200, 'Berhasil memperbarui bahasa', collaboration))
    } catch (error) {
      logger.error(error)
      socket.emit('res_update_lang', this._response.error(error))
    }
  }

  async forceLeaveRoom (socket) {
    try {
      // Get user id
      const { userId } = await this._collaborationService.getActiveUserBySocketId(socket.id)

      // Leave at another room
      const otherRooms = await this._collaborationService.getCollaborationByUserId(userId)
      for (const otherRoom of otherRooms) {
        // Update participants
        const { codeId } = otherRoom
        const result = await this._collaborationService.removeParticipant(codeId, userId)

        // Leave socket room
        socket.leave(codeId)

        // Get collaboration details
        if (result) {
          const collaboration = await this._collaborationService.getCollaborationByCodeId(codeId)

          // Broadcast to existing participants
          socket.broadcast.to(codeId).emit('res_participants_left', this._response.success(200, 'Ada partisipan keluar', collaboration))
        }
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

module.exports = {
  CollaborationController
}
