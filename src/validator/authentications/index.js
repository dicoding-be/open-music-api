const {
  PostAuthenticationSchema,
  PutAuthenticationSchema,
  DeleteAuthenticationSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationValidator = {
  validatePostAuthentication: (payload) => {
    const validationResult = PostAuthenticationSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutAuthentication: (payload) => {
    const validationResult = PutAuthenticationSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteAuthentication: (payload) => {
    const validationResult = DeleteAuthenticationSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationValidator;
