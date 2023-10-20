const { GraphQLError } = require('graphql');

module.exports = {
  Unauthorized: () => new GraphQLError(
    'User is not authorized!',
    {
      extensions: {
        http: {
          status: 401
        }
      }
    }
  ),

  BadRequest: message => new GraphQLError(
    message,
    {
      extensions: {
        http: {
          status: 400
        }
      }
    }
  ),

  NotFound: message => new GraphQLError(
    message,
    {
      extensions: {
        http: {
          status: 404
        }
      }
    }
  ),

  UnprocessableEntity: message => new GraphQLError(
    message,
    {
      extensions: {
        http: {
          status: 422
        }
      }
    }
  ),

  Forbidden: () => new GraphQLError(
    `You don't have access to perform this operation!`,
    {
      extensions: {
        http: {
          status: 403
        }
      }
    }
  ),

  //ServerError: () => new GraphQLError()
}