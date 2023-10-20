const jwt = require('jsonwebtoken')
const ApiError = require("../errors/api.error");
const tokenService = require('../services/token.service');
const {ACCESS_SECRET_KEY} = require('../config/auth.config');

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }

  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return next(ApiError.Unauthorized());
  }

  const accessToken = authorizationHeader.split(' ')[1];

  if (!accessToken) {
    return next(ApiError.Unauthorized());
  }

  const userData = await tokenService.validateToken(accessToken, ACCESS_SECRET_KEY);

  if (!userData) {
    return next(ApiError.Unauthorized());
  }

  next();
}