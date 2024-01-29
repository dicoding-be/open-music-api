const autoBind = require('auto-bind');

class PlaylistSongHandler {
  constructor(playlistSongService, playlistService, songService, validator) {
    this._playlistSongService = playlistSongService;
    this._playlistService = playlistService;
    this._songService = songService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePostPlaylistSong(request.payload);
    const { songId } = request.payload;
    const _song = await this._songService.getSongById(songId);
    const { id: playlistId } = request.params;
    const { id: ownerId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistOwner(playlistId, ownerId);
    await this._playlistSongService.addSongToPlaylist({ playlistId, songId });
    await this._playlistSongService.addPlaylistSongActivity(playlistId, songId, ownerId, 'add');
    return h
      .response({
        status: 'success',
        message: 'Song successfully added to playlist.',
      })
      .code(201);
  }

  async getPlaylistSongsHandler(request) {
    const { id: playlistId } = request.params;
    const { id: ownerId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistOwner(playlistId, ownerId);
    const playlist = await this._playlistSongService.getPlaylistSongs(playlistId);
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
    const { id: ownerId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistOwner(playlistId, ownerId);
    await this._playlistSongService.deleteSongFromPlaylist(playlistId, songId);
    await this._playlistSongService.addPlaylistSongActivity(playlistId, songId, ownerId, 'delete');
    return {
      status: 'success',
      message: 'Song successfully deleted from playlist.',
    };
  }

  async getPlaylistSongActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const { id: ownerId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistOwner(playlistId, ownerId);
    const activities = await this._playlistSongService.getPlaylistSongActivities(playlistId);
    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistSongHandler;
