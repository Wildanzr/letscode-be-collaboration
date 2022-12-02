const { Collaboration } = require('../models')
const { nanoid } = require('nanoid')

class CollaborationService {
  constructor () {
    this.name = 'collaborationService'
  }

  async createCollaboration (payload) {
    // Generate random room name
    const codeId = nanoid(5)

    // Insert codeId to payload
    payload.codeId = codeId

    // Create collaboration
    return await Collaboration.create(payload)
  }
}

module.exports = {
  CollaborationService
}
