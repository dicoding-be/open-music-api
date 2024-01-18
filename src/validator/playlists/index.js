const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistSchema } = require('./schema');

const PlaylistValidator = {
  validatePlaylist: (payload) => {
    const validateResult = PlaylistSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
