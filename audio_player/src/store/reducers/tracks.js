import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility'

const initialState = {
  tracks: [],
  listenedTracks: 0,
  error: null
}

const fetchTrackSuccess = (state, action) => {
  return updateObject(state, {tracks: action.tracks, error: null})
}

const fetchTrackFail = (state, action) => {
  return updateObject(state, {tracks: [], error: action.error})
}

const trackHasBeenListened = (state, action) => {
  return updateObject(state, {listenedTracks: state.listenedTracks + 1});
}

const refreshListenedTracks = (state, action) => {
  return updateObject(state, {listenedTracks: 0});
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TRACKS_SUCCESS: return fetchTrackSuccess(state, action);
    case actionTypes.FETCH_TRACKS_FAIL: return fetchTrackFail(state, action);
    case actionTypes.TRACK_HAS_BEEN_LISTENED: return trackHasBeenListened(state, action);
    case actionTypes.REFRESH_LISTENED_TRACKS: return refreshListenedTracks(state, action);
    default: return state;
  }
}

export default reducer;