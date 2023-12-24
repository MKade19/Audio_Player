import axios from "axios";
import store from "../store/store";
import {refreshTokens} from  '../store/actions/index';

const instance = axios.create({
  baseURL: 'http://localhost:5000/graphql',
  withCredentials: true
});

instance.interceptors.request.use(request => {
  request.headers.setAuthorization(`Bearer ${store.getState().auth.accessToken}`);
  return request;
}, error => {
  console.log(error);
  return Promise.reject(error);
});

instance.interceptors.response.use(response => {
  // console.log(response);
  return response;
}, async error => {
  const originalRequest = error.config;
  // console.log(error);
  if (error.response.status === 401) {
    try {
      const graphQlQuery = {
        query: `
          mutation Refresh ($refreshToken: String!) {
            refresh(refreshToken: $refreshToken) {
              accessToken
              refreshToken
              credentials {
                userId
                role
              }
            }
          }
        `,
        variables: {refreshToken: store.getState().auth.refreshToken}
      }

      const response = await axios.post('http://localhost:5000/graphql', graphQlQuery);
      console.log(response)
      store.dispatch(refreshTokens({
        accessToken: response.data.data.refresh.accessToken,
        refreshToken: response.data.data.refresh.refreshToken
      }));
      return instance.request(originalRequest);
    } catch (e) {
      console.log('You are not authorized!')
    }
  }

  return Promise.reject(error);
});

export default instance;