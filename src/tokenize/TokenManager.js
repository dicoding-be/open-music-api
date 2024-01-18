const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  // payload berisi id user
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      // untuk men-decoded token, gunakan fungsi Jwt.token.decode dan fungsi tersebut akan mengembalikan artifacts
      const artifacts = Jwt.token.decode(refreshToken);
      // verifySignature ini akan mengecek apakah refresh token memiliki signature yang sesuai atau tidak
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      // artifacts.decoded ini berisi data user (id) dan digunakan dalam membuat akses token baru
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('invalid refresh token');
    }
  },
};

module.exports = TokenManager;
