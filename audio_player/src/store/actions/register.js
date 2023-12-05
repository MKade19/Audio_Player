import * as actionTypes from './actionTypes'
import defaultAxios from 'axios';
import {authSuccess} from './auth';

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
          mutation Register($userData: UserInputData!) {
            register(userInput: $userData) {
              accessToken
              refreshToken
              credentials {
                role
                userId
                userName
              }
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

      const response = await defaultAxios.post('http://localhost:5000/graphql', graphqlQuery);
      // console.log(response);
      dispatch(registerSuccess());
      dispatch(authSuccess(response.data.data.register));
    } catch (e) {
      dispatch(registerFail(e.response.data.errors[0]));
    }
  }
};