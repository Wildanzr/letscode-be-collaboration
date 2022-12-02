const { Collaboration, User } = require('../models')
const { ClientError } = require('../error')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 5)

class CollaborationService {
  constructor () {
    this.name = 'collaborationService'
  }

  // Collaborations
  async createCollaboration (payload) {
    // Destructure payload
    const { userId, competeProblemId } = payload

    // Determine userId is guest or not
    const isGuest = userId.includes('Guest')

    // Generate random room name
    const codeId = nanoid(5)

    // Create collaboration document
    const collaboration = {
      competeProblemId,
      codeId,
      participants: [userId]
    }

    // Create collaboration
    let collab = await Collaboration.create(collaboration)
    if (!collab) throw new ClientError('Failed to create collaboration', 500)

    // If userId is guest, then return it
    if (isGuest) {
      console.log('Guest')
      const participants = [{
        _id: userId,
        username: userId
      }]

      return { ...collab._doc, participants }
    } else {
      console.log('here')
      // Populate participants, select username and _id
      collab = await collab.populate('participants', 'username')

      return collab
    }
  }

  async checkCollaborationIsExistByCodeId (codeId) {
    // Find collaboration
    const collaboration = await Collaboration.findOne({ codeId })

    if (!collaboration) throw new ClientError('Collaboration not found', 404)

    return true
  }

  async addNewParticipant (codeId, userId) {
    // Find collaboration
    const collaboration = await this.getCollaborationDetailByCodeId(codeId)

    // Update participants
    collaboration.participants.push(userId)

    // Save collaboration
    await collaboration.save()
  }

  async removeParticipant (codeId, userId) {
    // Find collaboration
    const collaboration = await this.getCollaborationDetailByCodeId(codeId)

    // Remove participant
    collaboration.participants = collaboration.participants.filter(participant => participant !== userId)

    // Save collaboration
    await collaboration.save()
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

    if (!collaboration) throw new ClientError('Collaboration not found', 404)

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

  // Users
  async getUserNameById (userId) {
    // Find user
    const user = await User.findById(userId)
      .select('_id username')
      .exec()

    if (!user) return { _id: userId, username: userId }

    return user
  }
}

module.exports = {
  CollaborationService
}
