const ApiError = require("../../errors/api.error");
const bcrypt = require("bcrypt");
const tokenService = require("../../services/token.service");
const UserService = require("../../services/user.service");
const {REFRESH_SECRET_KEY, ACCESS_SECRET_KEY} = require("../../config/auth.config");

module.exports = {
  query: {
    getCredentials: async (root, args, {req}) => {
      if (!req.headers.authorization) {
        throw ApiError.Unauthorized();
      }

      const accessToken = req.headers.authorization.split(' ')[1];
      if (!accessToken) {
        throw ApiError.Unauthorized();
      }

      const credentials = await tokenService.validateToken(accessToken, ACCESS_SECRET_KEY);

      if (!credentials) {
        throw ApiError.Unauthorized();
      }

      return {userId: credentials.userId, role: credentials.role};
    }
  },
  mutation: {
    login: async function (root, { email, password }, {req, res}) {
      const user = await new UserService().singleUserByEmail(email);

      if (!user) {
        throw ApiError.NotFound('There is no such a user with this email!');
      }

      const isPassEquals = await bcrypt.compare(password, user.password);

      if (!isPassEquals)
        throw ApiError.BadRequest('Incorrect password or login!');

      const payload = {
        userId: user._id,
        role: user.role
      };

      const tokens = tokenService.generateTokens(payload);
      await tokenService.saveToken(user._id, tokens.refreshToken);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        credentials: { userId: user._id, role: user.role, userName: user.userName }
      };
    },

    logout: async (root, { refreshToken }, {req, res}) => {
      const accessToken = req.headers.authorization.split(' ')[1];
      if (!refreshToken || !accessToken) {
        throw ApiError.Unauthorized();
      }

      const token = await tokenService.removeToken(refreshToken);
      return token.refreshToken;
    },

    refresh: async (root, { refreshToken }, {req, res}) => {
      if (!refreshToken) {
        throw ApiError.Unauthorized();
      }

      const userData = await tokenService.validateToken(refreshToken, REFRESH_SECRET_KEY);
      const tokenFromDb = await tokenService.findToken(refreshToken);

      if (!userData || !tokenFromDb) {
        throw ApiError.Unauthorized();
      }

      const user = await new UserService().singleUserById(userData.userId);

      const payload = {
        userId: user._id,
        role: user.role
      };

      const tokens = tokenService.generateTokens(payload);
      await tokenService.saveToken(payload.userId, tokens.refreshToken);

      return {...tokens, credentials: {userId: payload.userId, role: payload.role}};
    },
  }
}