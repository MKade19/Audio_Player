import * as actionTypes from './actionTypes'
import axios from "../../axios/axios";

export const fetchTracksSuccess = (tracks) => {
  return {
    type: actionTypes.FETCH_TRACKS_SUCCESS,
    tracks: tracks
  }
};

export const fetchTracksFail = (error) => {
  return {
    type: actionTypes.FETCH_TRACKS_FAIL,
    error: error
  }
};

export const fetchTracks = () => {
  return async dispatch => {
    try {
      const graphqlQuery = {
        query: `{
          tracksData {
            tracks {
              _id
              title
              author
              category
              audioUrl
              description
              listensQuantity
              likesQuantity
              createdAt
              usersWhoLiked
            }
          }
        }`
      }

      const tracks = await axios.post('', graphqlQuery);
      // console.log(tracks)
      dispatch(fetchTracksSuccess(tracks.data.data.tracksData.tracks));
    } catch (e) {
      console.log(e)
      dispatch(fetchTracksFail(e));
    }
  }
}

export const trackHasBeenListened = () => {
  return {
    type: actionTypes.TRACK_HAS_BEEN_LISTENED,
  }
}

export const refreshListenedTracks = () => {
  return {
    type: actionTypes.REFRESH_LISTENED_TRACKS
  }
}