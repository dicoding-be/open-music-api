const InvariantError = require('../../exceptions/InvariantError');
const { PostPlaylistSongSchema } = require('./schema');

const PlaylistSongValidator = {
  validatePostPlaylistSong: (payload) => {
    const validateResult = PostPlaylistSongSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
  validateDeletePlaylistSong: (payload) => {
    const validateResult = PostPlaylistSongSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = PlaylistSongValidator;
