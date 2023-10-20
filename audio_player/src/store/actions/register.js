import * as actionTypes from './actionTypes'
import axios from "../../axios/axios";

export const registerStart = () => {
  return {
    type: actionTypes.REGISTER_START
  }
};

export const registerSuccess = () => {
  return {
    type: actionTypes.REGISTER_SUCCESS
  }
};

export const registerFail = (error) => {
  return {
    type: actionTypes.REGISTER_FAIL,
    error: error
  }
};

export const register = (email, password, userName) => {
  return async dispatch => {
    dispatch(registerStart());
    try {
      const graphqlQuery = {
        query: `
          mutation CreateUser($userData: UserInputData!) {
            createUser(userInput: $userData) {
              _id
              email
              userName
            }
          }
        `,
        variables: {
          userData: {
            email: email,
            password: password,
            userName: userName
          }
        }
      };

      const result = await axios.post('/graphql', graphqlQuery);
      dispatch(registerSuccess());
    } catch (e) {
      dispatch(registerFail(e.response.data.errors[0]));
    }
  }
};