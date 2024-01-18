const { Pool } = require('pg');
const { customAlphabet } = require('nanoid');
const bycrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername({ username });
    const id = `USER${customAlphabet('1234567890', 16)()}`;
    const hashedPassword = await bycrypt.hash(password, 16);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    }
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('failed to add user');
    }
    return result.rows[0].id;
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId],
    }
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('user not found');
    }
    return result.rows[0];
  }

  // fungsi untuk verifikasi username baru biar tidak duplikat
  async verifyNewUsername({ username }) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new InvariantError('username already taken');
    }
  }
}

module.exports = UsersService;
