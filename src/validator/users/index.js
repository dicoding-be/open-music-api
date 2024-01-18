const InvariantError = require('../../exceptions/InvariantError');
const { UserSchema } = require('./schema');

const UserValidator = {
  validateUser: (payload) => {
    const validateResult = UserSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = UserValidator;
