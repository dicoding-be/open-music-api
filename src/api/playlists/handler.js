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
    const owner = 'USER4388029924111144';
    // const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._service.addPlaylist({ name, owner });
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

  async getPlaylistsHandler() {
    const playlists = await this._service.getPlaylists('USER4388029924111144');
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(request) {
    const { id } = request.params;
    await this._service.deletePlaylist(id);
    return {
      status: 'success',
      message: 'Playlist deleted',
    };
  }
}

module.exports = PlaylistHandler;
