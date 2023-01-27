const { Collaboration, User, ActiveUser } = require('../models')
const { ClientError } = require('../error')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 5)

class CollaborationService {
  constructor () {
    this.name = 'collaborationService'
  }

  // Collaborations
  async createCollaboration (payload, socketId) {
    // Destructure payload
    const { userId, competeProblemId } = payload

    // Determine userId is guest or not
    const isGuest = !userId.includes('Guest')

    // Generate random room name
    const codeId = nanoid(5)

    // Create collaboration document
    const collaboration = {
      competeProblemId,
      language: null,
      codeId,
      participants: [userId]
    }

    // Create collaboration and active user
    await ActiveUser.create({ isGuest, userId, socketId })
    let collab = await Collaboration.create(collaboration)
    if (!collab) throw new ClientError('Gagal membuat ruang kolaborasi', 500)

    // If userId is guest, then return it
    if (!isGuest) {
      const participants = [{
        _id: userId,
        username: userId
      }]

      return { ...collab._doc, participants }
    } else {
      // Populate participants, select username and _id
      collab = await collab.populate('participants', 'username')

      return collab
    }
  }

  async checkCollaborationIsExistByCodeId (codeId) {
    // Find collaboration
    const collaboration = await Collaboration.findOne({ codeId })

    if (!collaboration) throw new ClientError('Ruang kolaborasi tidak ditemukan', 404)

    return true
  }

  async checkCollaborationIsExistByCodeIdAndCPID (codeId, competeProblemId) {
    // Find collaboration
    const collaboration = await Collaboration.findOne({ codeId })

    if (!collaboration) throw new ClientError('Kolaborasi tidak ditemukan', 404)

    if (collaboration.competeProblemId !== competeProblemId) {
      throw new ClientError('Tidak dapat bergabung karena permasalahan yang sedang dikerjakan tidak sama', 400)
    }

    return true
  }

  async updateLanguage (payload) {
    const { roomId, language } = payload

    // Find collaboration
    const collaboration = await Collaboration.findOne({ codeId: roomId })
    if (!collaboration) throw new ClientError('Ruang kolaborasi tidak ditemukan', 404)

    // Update language
    collaboration.language = language
    return await collaboration.save()
  }

  async addNewParticipant (codeId, userId, socketId) {
    // Determine userId is guest or not
    const isGuest = !userId.includes('Guest')

    // Find collaboration
    const collaboration = await this.getCollaborationDetailByCodeId(codeId)

    // Update participants
    collaboration.participants.push(userId)

    // Save collaboration
    await collaboration.save()
    await ActiveUser.create({ isGuest, userId, socketId })
  }

  async removeParticipant (codeId, userId) {
    // Find collaboration
    const collaboration = await this.getCollaborationDetailByCodeId(codeId)

    // Remove participant
    collaboration.participants = collaboration.participants.filter(participant => participant !== userId)

    let result = true
    // Check if participants is empty
    if (collaboration.participants.length === 0) {
      // Delete collaboration
      result = false
      await collaboration.deleteOne()
    } else {
      await collaboration.save()
    }

    // Remove active user
    await ActiveUser.deleteOne({ userId })

    return result
  }

  async getCollaborationDetailByCodeId (codeId) {
    // Find collaboration
    const collaboration = await Collaboration.findOne({ codeId })

    if (!collaboration) throw new ClientError('Collaboration not found', 404)

    return collaboration
  }

  async getCollaborationByCodeId (codeId) {
    // Find collaboration
    const collaboration = await Collaboration.findOne({ codeId })

    if (!collaboration) throw new ClientError('Ruang kolaborasi tidak ditemukan', 404)

    // Iterate participants, if participant is guest, modify it
    const newParticipants = []
    for (const participant of collaboration.participants) {
      if (participant.includes('Guest')) {
        newParticipants.push({
          _id: participant,
          username: participant
        })
      } else {
        const user = await this.getUserNameById(participant)
        newParticipants.push(user)
      }
    }

    return { ...collaboration._doc, participants: newParticipants }
  }

  async getCollaborationByUserId (userId) {
    return await Collaboration.find({ participants: { $in: [userId] } }).select('codeId').exec()
  }

  async getRoomIdByUserId (userId) {
    return await Collaboration.findOne({ participants: { $in: [userId] } }).select('codeId').exec()
  }

  async deleteOldCollaboration (userId) {
    return await Collaboration.findOneAndDelete({ participants: { $in: [userId] } }).exec()
  }

  // Users
  async getUserNameById (userId) {
    // Find user
    const user = await User.findById(userId)
      .select('_id username')
      .exec()

    if (!user) return { _id: userId, username: userId }

    return user
  }

  async getActiveUserBySocketId (socketId) {
    return await ActiveUser.findOne({ socketId }).exec()
  }
}

module.exports = {
  CollaborationService
}
