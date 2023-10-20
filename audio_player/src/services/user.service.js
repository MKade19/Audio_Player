import axios from "../axios/axios";

class UserService {
  createUser = async (fieldValues) => {
    const payload = {};
    for (let key in fieldValues) {
      payload[key] = fieldValues[key].value;
    }

    const graphQlQuery = {
      query: `
        mutation CreateUser($payload: UserInputData!) {
          createUser(userInput: $payload) {
            _id
            email
            userName
            role
          }
        }
      `,
      variables: {payload: payload}
    }

    return axios.post('', graphQlQuery);
  }

  updateUser = async (userId, fieldValues) => {
    const payload = {};
    for (let key in fieldValues) {
      payload[key] = fieldValues[key].value;
    }

    const graphQlQuery = {
      query: `
        mutation UpdateTrack($id: ID!, $payload: UserInputData!) {
          updateUser(id: $id, userInput: $payload) {
            _id
            email
            userName
          }
        }
      `,
      variables: {
        id: userId,
        payload: payload,
      }
    }

    return axios.post('', graphQlQuery);
  }

  fetchOneUserForForm = async userId => {
    const graphQlQuery = {
      query: `
        query fetchUser($id: ID!) {
          user(id: $id) {
            email
            userName
            role
          }
        }
      `,
      variables: { id: userId }
    }

    const response = await axios.post('', graphQlQuery);
    return response.data.data.user;
  }
}

export default new UserService();