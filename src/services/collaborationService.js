const { Collaboration } = require('../models')
const { ClientError } = require('../error')
const { nanoid } = require('nanoid')

class CollaborationService {
  constructor () {
    this.name = 'collaborationService'
  }

  async createCollaboration (payload) {
    // Destructure payload
    const { userId, competeProblemId } = payload

    // Generate random room name
    const codeId = nanoid(5)

    // Create collaboration document
    const collaboration = {
      competeProblemId,
      codeId,
      participants: [userId]
    }

    // Create collaboration
    return await Collaboration.create(collaboration)
  }

  async checkCollaborationIsExistByCodeId (codeId) {
    // Find collaboration
    const collaboration = await Collaboration.findOne({ codeId })

    if (!collaboration) throw new ClientError('Collaboration not found', 404)

    return true
  }

  async addNewParticipant (codeId, userId) {
    // Find collaboration
    const collaboration = await this.getCollaborationByCodeId(codeId)

    // Update participants
    collaboration.participants.push(userId)

    // Save collaboration
    await collaboration.save()
  }

  async getCollaborationByCodeId (codeId) {
    // Find collaboration
    const collaboration = await Collaboration.findOne({ codeId })

    if (!collaboration) throw new ClientError('Collaboration not found', 404)

    return collaboration
  }
}

module.exports = {
  CollaborationService
}
