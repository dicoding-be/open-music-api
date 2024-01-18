const autoBind = require('auto-bind');

class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    await this._validator.validateUser(request.payload);
    const { username, password, fullname } = request.payload;
    const userId = await this._service.addUser({
      username,
      password,
      fullname,
    });
    return h
      .response({
        status: 'success',
        message: 'User successfully created',
        data: {
          userId,
        },
      })
      .code(201);
  }

  async getUserByIdHandler(request, h) {
    const { id } = request.params;
    const user = await this._service.getUserById(id);
    return h
      .response({
        status: 'success',
        data: {
          user,
        },
      })
      .code(200);
  }
}

module.exports = UserHandler;
