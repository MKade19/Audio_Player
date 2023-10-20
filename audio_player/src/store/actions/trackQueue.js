import * as actionTypes from '../actions/actionTypes';

export const refreshQueue = () => {
  return {
    type: actionTypes.REFRESH_QUEUE
  };
}

export const trackAdded = (track) => {
  return {
    type: actionTypes.TRACK_ADDED_TO_QUEUE,
    track: track
  };
}

export const trackRemoved = (trackId) => {
  return {
    type: actionTypes.TRACK_REMOVED_FROM_QUEUE,
    trackId: trackId
  };
}

export const playlistAdded = (playlist) => {
  return {
    type: actionTypes.PLAYLIST_ADDED_TO_QUEUE,
    playlist: playlist
  };
}