const User = require("../models/user");
const Track = require("../models/track");

class UserService {
  constructor(startPos, limit) {
    this.startPos = startPos;
    this.limit = limit;
  }

  allUsers = async () => {
    return {
      users: await User.aggregate([
        { $skip: this.startPos },
        { $limit: this.limit }
      ]),
      total: await User.find({}).count()
    };
  }

  singleUserById = async userId => {
    return User.findById(userId);
  }

  singleUserByEmail = async email => {
    return User.findOne({email: email});
  }

  singleUserByUserName = async userName => {
    return User.findOne({userName: userName});
  }

  createUser = async ({email, password, userName, role}) => {
    return User.create({
      email,
      password,
      userName,
      role,
      uploadedTracks: [],
      playlists: []
    });
  }

  updateUserById = async ({userId, changedValues}) => {
    return User.updateOne(
      {_id: userId},
      {$set: changedValues}
    );
  }

  deleteUserById = async userId => {
    return User.deleteOne({_id: userId});
  }
}

module.exports = UserService;