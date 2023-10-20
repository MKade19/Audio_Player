const jwt = require('jsonwebtoken')
const {REFRESH_SECRET_KEY, ACCESS_SECRET_KEY} = require("../config/auth.config");
const jwt_decode = require('jwt-decode');

const Token = require('../models/token')

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {expiresIn: '15m'});
    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {expiresIn: '30d'});

    return {
      accessToken,
      refreshToken
    }
  }

  validateToken(token, secretKey) {
    try {
      return jwt.verify(token, secretKey);
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    let token = await Token.findOne({userId: userId});

    if (!token) {
      token = new Token({
        refreshToken: refreshToken,
        userId: userId
      })

      return token.save();
    }

    return Token.findOneAndUpdate({userId: userId}, {$set: {refreshToken: refreshToken}});
  }

  async removeToken(refreshToken) {
    return Token.findOneAndDelete({refreshToken: refreshToken});
  }

  async findToken(refreshToken) {
    return Token.findOne({refreshToken: refreshToken});
  }

  getCredentials(token) {
    return jwt_decode(token);
  }
}

module.exports = new TokenService()