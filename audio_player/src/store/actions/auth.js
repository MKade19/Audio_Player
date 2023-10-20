import * as actionTypes from '../actions/actionTypes';
import axios from "../../axios/axios";
import store from "../store";
import {refreshQueue} from "./trackQueue";
import {fetchPlaylists} from "./playlists";
import {refreshListenedTracks} from "./tracks";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
}

export const authSuccess = (authData) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    authData: authData
  };
}

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
}

export const logoutSuccess = (data) => {
  return {
    type: actionTypes.LOGOUT_SUCCESS,
    data: data
  }
}

export const logoutFail = (error) => {
  return {
    type: actionTypes.LOGOUT_FAIL,
    error: error
  }
}

export const refreshSuccess = () => {
  return {
    type: actionTypes.REFRESH_SUCCESS
  }
}

export const refreshTokens = (data) => {
  return {
    type: actionTypes.REFRESH_TOKENS,
    data: data
  }
}

export const auth = (email, password) => {
  return async dispatch => {
    dispatch(authStart());

    try {
      const graphQlQuery = {
        query: `
          mutation ($email: String!, $password: String!){
            login(email: $email, password: $password) {
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
          email: email,
          password: password
        }
      };

      const response = await axios.post('', graphQlQuery);
      const userId = response.data.data.login.credentials.userId;
      dispatch(refreshQueue());
      dispatch(authSuccess(response.data.data.login));
      dispatch(fetchPlaylists(userId));
      dispatch(refreshListenedTracks());
    } catch (e) {
      dispatch(authFail(e.response.data.errors[0]));
    }
  };
}

export const logout = () => {
  return async dispatch => {
    try {
      const graphQlQuery = {
        query: `
          mutation Logout($token: String!) {
            logout(refreshToken: $token)
          }
        `,
        variables: {
          token: store.getState().auth.refreshToken
        }
      }

      const logoutData = await axios.post('', graphQlQuery);
      dispatch(logoutSuccess());
    } catch (e) {
      dispatch(logoutFail(e.response.data.errors[0]));
    }
  }
}