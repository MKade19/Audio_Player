import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility'

const initialState = {
  queue: {
    tracks: []
  }
}

const addTrack = (tracks, track) => {
  if (tracks.find(t => t._id === track._id)) {
    return tracks;
  }

  const updatedTracks = [...tracks];
  updatedTracks.push(track);
  return updatedTracks;
}

const refreshQueue = (state, action) => {
  return updateObject(state, {queue: {tracks: []}})
}

const trackAdded = (state, action) => {
  return updateObject(state, {
    queue: {tracks: addTrack(state.queue.tracks, action.track)}
  });
}

const trackRemoved = (state, action) => {
  return updateObject(state, {
    queue: {tracks: state.queue.tracks.filter(t => t._id !== action.trackId)}
  });
}

const playlistAdded = (state, action) => {
  return updateObject(state, {
    queue: {tracks: action.playlist}
  });
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.REFRESH_QUEUE: return refreshQueue(state, action);
    case actionTypes.TRACK_ADDED_TO_QUEUE: return trackAdded(state, action);
    case actionTypes.TRACK_REMOVED_FROM_QUEUE: return trackRemoved(state, action);
    case actionTypes.PLAYLIST_ADDED_TO_QUEUE: return playlistAdded(state, action);
    default: return state;
  }
}

export default reducer;