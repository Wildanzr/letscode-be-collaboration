const { Collaboration } = require('../models')

class CollaborationService {
  constructor () {
    this.name = 'collaborationService'
  }

  async createCollaboration (payload) {
    return await Collaboration.create(payload)
  }
}

module.exports = {
  CollaborationService
}
