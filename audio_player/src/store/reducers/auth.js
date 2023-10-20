import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility'

const initialState = {
  accessToken: null,
  refreshToken: null,
  userName: null,
  userId: null,
  error: null,
  role: 'GUEST',
  success: false
}

const authStart = (state, action) => {
  return updateObject(state, {error: null, success: false});
}

const authSuccess = (state, action) => {
  return updateObject(state, {
    accessToken: action.authData.accessToken,
    refreshToken: action.authData.refreshToken,
    userId: action.authData.credentials.userId,
    userName: action.authData.credentials.userName,
    error: null,
    role: action.authData.credentials.role,
    success: true
  });
}

const logoutSuccess = (state, action) => {
  return updateObject(state, {
    accessToken: null,
    refreshToken: null,
    userId: null,
    userName: null,
    error: null,
    role: 'GUEST',
    success: true
  });
}

const logoutFail = (state, action) => {
  return updateObject(state, {
    error: action.error
  });
}

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error
  });
}

const registerStart = (state, action) => {
  return updateObject(state, {error: null, success: false});
}

const registerSuccess = (state, action) => {
  return updateObject(state, {error: null, success: true});
}

const registerFail = (state, action) => {
  return updateObject(state, {error: action.error});
}

const refreshSuccess = (state, action) => {
  return updateObject(state, {success: false});
}

const refreshTokens = (state, action) => {
  return updateObject(state, {
    accessToken: action.data.accessToken,
    refreshToken: action.data.refreshToken
  });
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START: return authStart(state, action);
    case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
    case actionTypes.AUTH_FAIL: return authFail(state, action);
    case actionTypes.LOGOUT_SUCCESS: return logoutSuccess(state, action);
    case actionTypes.LOGOUT_FAIL: return logoutFail(state, action);
    case actionTypes.REGISTER_START: return registerStart(state, action);
    case actionTypes.REGISTER_SUCCESS: return registerSuccess(state, action);
    case actionTypes.REGISTER_FAIL: return registerFail(state, action);
    case actionTypes.REFRESH_SUCCESS: return refreshSuccess(state, action);
    case actionTypes.REFRESH_TOKENS: return refreshTokens(state, action);
    default: return state;
  }
}

export default reducer;