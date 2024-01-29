const autoBind = require('auto-bind');

class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylist(request.payload);
    const { name } = request.payload;
    const { id: owner } = request.auth.credentials;
    const playlistId = await this._service.addPlaylist(name, owner);
    return h
      .response({
        status: 'success',
        message: 'Playlist successfully created',
        data: {
          playlistId,
        },
      })
      .code(201);
  }

  async getPlaylistsHandler(request) {
    const { id: ownerId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(ownerId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const { id: ownerId } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(playlistId, ownerId);
    await this._service.deletePlaylist(playlistId);
    return {
      status: 'success',
      message: 'Playlist deleted',
    };
  }
}

module.exports = PlaylistHandler;
