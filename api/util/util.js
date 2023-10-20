const fs = require("fs");
const ApiError = require("../errors/api.error");
const tokenService = require("../services/token.service");
const {ACCESS_SECRET_KEY} = require("../config/auth.config");

module.exports = {
  deleteFile: fileName => {
    fs.unlink(process.cwd() + '\\resources\\audio\\' + fileName, (err) => {
      if (err) {
        throw ApiError.NotFound('There is no such a file!');
      }
    });
  },

  checkAuth: authHeader => {
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      throw ApiError.Unauthorized();
    }

    return tokenService.validateToken(accessToken, ACCESS_SECRET_KEY);
  },

  checkAdmin: role => {
    return role === 'ADMIN';
  }
}