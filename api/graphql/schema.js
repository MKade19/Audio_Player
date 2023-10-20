const { createSchema } = require('graphql-yoga');
const resolvers = require("./resolvers/resolvers");
const {useCookies} = require("@whatwg-node/server-plugin-cookies");
const fs = require('fs');
const path = require('path');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const types = loadFilesSync(path.join(__dirname, '.'), { extensions: ['graphql'] });
const typeDefs = mergeTypeDefs(types);

module.exports = createSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
  plugins: [useCookies()]
});