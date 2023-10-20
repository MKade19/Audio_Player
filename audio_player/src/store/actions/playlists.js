import * as actionTypes from '../actions/actionTypes';
import axios from "../../axios/axios";

export const createPlaylistSuccess = (playlist) => {
  return {
    type: actionTypes.CREATE_PLAYLIST_SUCCESS,
    playlist: playlist
  }
};

export const createPlaylistFail = (error) => {
  return {
    type: actionTypes.CREATE_PLAYLIST_FAIL,
    error: error
  }
};

export const createPlaylist = (playlist) => {
  return async dispatch => {
    try {
      dispatch(createPlaylistSuccess(playlist));
    } catch (e) {
      console.log(e);
      dispatch(createPlaylistFail(e));
    }
  }
}

export const deletePlaylistsSuccess = (playlistId) => {
  return {
    type: actionTypes.DELETE_PLAYLISTS_SUCCESS,
    playlistId: playlistId
  }
};

export const deletePlaylistsFail = (error) => {
  return {
    type: actionTypes.DELETE_PLAYLISTS_FAIL,
    error: error
  }
};

export const deletePlaylist = playlistId => {
  return async dispatch => {
    try {
      const graphQlQuery = {
        query: `mutation DeletePlaylist($playlistId: ID!) {
          deletePlaylist(playlistId: $playlistId) {
            _id
            title
          }
        }`,
        variables: {
          playlistId: playlistId,
        }
      }

      const playlists = await axios.post('', graphQlQuery);
      //console.log(playlists)
      dispatch(deletePlaylistsSuccess(playlistId));
    } catch (e) {
      dispatch(deletePlaylistsFail(e));
    }
  }
}

export const fetchPlaylistsSuccess = (data) => {
  return {
    type: actionTypes.FETCH_PLAYLISTS_SUCCESS,
    data: data
  }
};

export const fetchPlaylistsFail = (error) => {
  return {
    type: actionTypes.FETCH_PLAYLISTS_FAIL,
    error: error
  }
};

export const fetchPlaylists = userId => {
  return async dispatch => {
    try {
      const graphqlQuery = {
        query: `{
          getPlaylistsByUser(userId: "${userId}") {
            _id
            title
            tracks {
              _id
              title
              author
              category
              audioUrl
              description
              listensQuantity
              usersWhoLiked
              createdAt
            }
          }
        }`
      }

      const playlists = await axios.post('', graphqlQuery);
      //console.log(playlists)
      dispatch(fetchPlaylistsSuccess(playlists.data.data.getPlaylistsByUser));
    } catch (e) {
      dispatch(fetchPlaylistsFail(e));
    }
  }
}

export const addTrackToPlaylistSuccess = (playlists, track) => {
  return {
    type: actionTypes.ADD_TRACK_TO_PLAYLIST_SUCCESS,
    track: track,
    playlists: playlists
  }
}

export const addTrackToPlaylistFail = (error) => {
  return {
    type: actionTypes.ADD_TRACK_TO_PLAYLIST_FAIL,
    error: error
  }
};

export const addTrackToPlaylist = (payload, trackId) => {
  return async dispatch => {
    try {
      const graphQlQuery = {
        query: ` 
        mutation AddTrackToPlaylists($playlistNames: [String!]!, $trackId: ID!) {
          addTrackToPlaylists(playlistNames: $playlistNames, trackId: $trackId) {
            _id
            title
            author
            category
            audioUrl
            description
            listensQuantity
            likesQuantity
            usersWhoLiked
            createdAt
          }
        }
      `,
        variables: {
          playlistNames: payload,
          trackId: trackId
        }
      }

      const response = await axios.post('', graphQlQuery);
      // console.log(response)
      dispatch(addTrackToPlaylistSuccess(payload, response.data.data.addTrackToPlaylists));
    } catch (e) {
      dispatch(addTrackToPlaylistFail(e));
    }
  }
};

export const removeTrackFromPlaylistSuccess = (playlistName, trackId) => {
  return {
    type: actionTypes.REMOVE_TRACK_FROM_PLAYLIST_SUCCESS,
    trackId: trackId,
    playlistName: playlistName
  }
}

export const removeTrackFromPlaylistFail = (error) => {
  return {
    type: actionTypes.REMOVE_TRACK_FROM_PLAYLIST_FAIL,
    error: error
  }
};

export const removeTrackFromPlaylist = (playlistName, trackId) => {
  return async dispatch => {
    try {
      const graphQlQuery = {
        query: ` 
          mutation RemoveTrackFromPlaylist($playlistName: String!, $trackId: ID!) {
            removeTrackFromPlaylist(playlistName: $playlistName, trackId: $trackId) {
              _id
              title
            }
          }
        `,
        variables: {
          playlistName: playlistName,
          trackId: trackId
        }
      }

      const response = await axios.post('', graphQlQuery);
      // console.log(response)
      dispatch(removeTrackFromPlaylistSuccess(playlistName, trackId));
    } catch (e) {
      console.log(e)
      dispatch(removeTrackFromPlaylistFail(e));
    }
  }
};