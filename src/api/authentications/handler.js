const autoBind = require('auto-bind');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    // memverifikasi apakah payload request sudah sesuai
    this._validator.validatePostAuthentication(request.payload);
    const { username, password } = request.payload;
    // verifikasi username dan password
    const id = await this._usersService.verifyUserCredential(
      username,
      password,
    );
    // membuat access token dan refresh token
    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });
    // menyimpan refreshToken
    await this._authenticationsService.addRefreshToken(refreshToken);
    return h.response({
      status: 'success',
      message: 'Authentication successfully',
      data: {
        accessToken,
        refreshToken,
      },
    }).code(201);
  }

  async putAuthenticationHandler(request) {
    // memastikan payload request mengandung properti refreshToken yang bernilai string
    this._validator.validatePutAuthentication(request.payload);
    // mendapatkan nilai refreshToken pada request.payload
    const { refreshToken } = request.payload;
    // verifikasi refreshToken apakah ada di database
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    // verifikasi refreshToken dari sisi signature
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
    // setelah refreshToken lolos dari verifikasi database dan signature, sekarang kita bisa secara aman membuat accessToken baru dan melampirkannya sebagai data di body respons
    const accessToken = this._tokenManager.generateAccessToken({ id });
    return {
      status: 'success',
      message: 'Access token refreshed successfully',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request) {
    // validasi request.payload berisi refreshToken
    this._validator.validateDeleteAuthentication(request.payload);
    // memastikan refreshToken tersebut ada di database
    const { refreshToken } = request.payload;
    // verifikasi refreshToken apakah ada di database
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    // menghapus refreshToken dari database
    await this._authenticationsService.deleteRefreshToken(refreshToken);
    return {
      status: 'success',
      message: 'Refresh token successfully deleted',
    };
  }
}

module.exports = AuthenticationsHandler;
