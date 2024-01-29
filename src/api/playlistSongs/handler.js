const autoBind = require('auto-bind');

class PlaylistSongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePostPlaylistSong(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    await this._service.addSongToPlaylist({
      playlistId,
      songId,
    });
    return h
      .response({
        status: 'success',
        message: 'Song successfully added to playlist.',
      })
      .code(201);
  }

  async getPlaylistSongsHandler(request) {
    const { id: playlistId } = request.params;
    const playlist = await this._service.getPlaylistSongs(playlistId);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    this._validator.validateDeletePlaylistSong(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    await this._service.deleteSongFromPlaylist(playlistId, songId);
    return {
      status: 'success',
      message: 'Song successfully deleted from playlist.',
    };
  }
}

module.exports = PlaylistSongHandler;
