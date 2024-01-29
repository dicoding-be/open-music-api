const { Pool } = require('pg');
const { customAlphabet } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist(name, owner) {
    const id = `PLAYLIST${customAlphabet('1234567890', 16)()}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('failed to add the playlist');
    }
    return result.rows[0].id;
  }

  async getPlaylists(ownerId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username 
      FROM playlists JOIN users
      ON playlists.owner = users.id 
      WHERE owner = $1
      ORDER BY name`,
      values: [ownerId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylist(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('failed to delete the playlist');
    }
  }

  async verifyPlaylistOwner(playlistId, ownerId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('playlist not found');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== ownerId) {
      throw new AuthorizationError('unauthorized: you do not have permission to access this resource');
    }
  }
}

module.exports = PlaylistsService;
