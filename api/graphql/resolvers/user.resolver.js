const ApiError = require("../../errors/api.error");
const bcrypt = require("bcrypt");
const {checkAuth} = require('../../util/util');
const UserService = require("../../services/user.service");

module.exports = {
  query: {
    usersData: async function (root, {limit, pageNumber}, {req}) {
      const userService = new UserService((pageNumber - 1) * limit, limit);
      const usersData = await userService.allUsers();
      return {users: usersData.users, total: usersData.total};
    },
    user: async (root, {id}, {req}) => {
      return new UserService().singleUserById(id);
    }
  },
  mutation: {
    createUser: async function (root, {userInput}, {req}) {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      if (payload.role !== 'ADMIN') {
        throw ApiError.Forbidden();
      }

      const userService = new UserService();
      const potentialUser = await userService.singleUserByEmail(userInput.email);

      if (potentialUser) {
        throw ApiError.UnprocessableEntity('User with this email already exists!');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userInput.password, salt);

      let role = 'USER'
      if (userInput.role) {
        role = userInput.role
      }

      const user = userService.createUser({
        email: userInput.email,
        password: hashedPassword,
        userName: userInput.userName,
        role
      });

      return user;
    },

    updateUser: async (root, {id, userInput}, {req}) => {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      if (payload.role !== 'ADMIN') {
        throw ApiError.Forbidden();
      }

      const userService = new UserService();
      const user = await userService.singleUserById(id);
      if (!user) {
        throw ApiError.NotFound('There is no such a user!');
      }

      await userService.updateUserById({
        userId: id,
        changedValues: userInput
      });

      return userService.singleUserById(id);
    },

    deleteUser: async (root, {id}, {req}) => {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      if (payload.role !== 'ADMIN') {
        throw ApiError.Forbidden();
      }

      const userService = new UserService();
      const user = await userService.singleUserById(id);
      if (!user) {
        throw ApiError.NotFound('There is no such a user!');
      }

      await userService.deleteUserById(id);

      return userService.singleUserById(id);
    },
  }
}