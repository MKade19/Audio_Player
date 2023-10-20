const mongoose = require("mongoose");
const trackResolver = require('./track.resolver');
const userResolver = require('./user.resolver');
const authResolver = require('./auth.resolver');
const playlistResolver = require('./playlist.resolver');
const commentResolver = require('./comment.resolver');

module.exports = {
  RootQuery: {
    ...trackResolver.query,
    ...userResolver.query,
    ...authResolver.query,
    ...playlistResolver.query,
    ...commentResolver.query,

    collections: async (root, args, req) => {
      const collections = mongoose.connections[0].collections;

      return Object.keys(collections);
    },
  },

  RootMutation: {
    ...trackResolver.mutation,
    ...userResolver.mutation,
    ...authResolver.mutation,
    ...playlistResolver.mutation,
    ...commentResolver.mutation
  },
}