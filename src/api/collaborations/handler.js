const autoBind = require('auto-bind');

class CollaborationHandler {
  constructor(collaborationService, playlistService, userService, validator) {
    this._collaborationService = collaborationService;
    this._playlistService = playlistService;
    this._userService = userService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaboration(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;
    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    const _user = await this._userService.getUserById(userId);
    const collaborationId = await this._collaborationService.addCollaboration(
      playlistId,
      userId,
    );
    return h.response({
      status: 'success',
      message: 'collaboration successfully added',
      data: {
        collaborationId,
      },
    })
      .code(201);
  }

  async deleteCollaborationHandler(request) {
    this._validator.validateCollaboration(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;
    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationService.deleteCollaboration(playlistId, userId);
    return {
      status: 'success',
      message: 'collaboration successfully deleted',
    };
  }
}

module.exports = CollaborationHandler;
