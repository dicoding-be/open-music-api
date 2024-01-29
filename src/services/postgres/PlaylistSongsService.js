const { Pool } = require('pg');
const { customAlphabet } = require('nanoid');
const { playlistMapToDBModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist({ playlistId, songId }) {
    const id = `PLSONG${customAlphabet('1234567890', 16)()}`;
    const query = {
      text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('failed to add the song to the playlist');
    }
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: `SELECT 
        p.id AS playlist_id,
        p.name AS playlist_name,
        u.username AS owner_username,
        s.id AS song_id,
        s.title AS song_title,
        s.performer AS song_performer
      FROM
        playlists AS p
        JOIN users AS u ON p.owner = u.id
        JOIN playlist_songs AS ps ON p.id = ps.playlist_id
        JOIN songs AS s ON ps.song_id = s.id
      WHERE 
        p.id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    const playlist = result.rows[0];
    const songs = result.rows
      .map((songData) => {
        if (songData.song_id !== null) {
          return {
            id: songData.song_id,
            title: songData.song_title,
            performer: songData.song_performer,
          };
        }
        return null;
      })
      .filter((song) => song !== null);
    return playlistMapToDBModel(playlist, songs);
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('failed to delete the song from the playlist');
    }
  }

  async addPlaylistSongActivity(playlistId, songId, userId, action) {
    const id = `ACTSNG${customAlphabet('1234567890', 16)()}`;
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, songId, userId, action],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('failed to add the playlist song activity');
    }
  }

  async getPlaylistSongActivities(playlistId) {
    const query = {
      text: `
        SELECT u.username, s.title, a.action, a.time
        FROM playlist_song_activities AS a
        JOIN users AS u ON a.user_id = u.id
        JOIN songs AS s ON a.song_id = s.id
        WHERE a.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistSongService;
