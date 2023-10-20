import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility'

const initialState = {
  data: [],
  error: null
};

const getDataAfterDelete = (playlistId, data) => {
  return data.filter(p => p._id !== playlistId);
};

const getDataAfterAdd = (newPlaylist, data) => {
  let newData = [...data];
  newData.push(newPlaylist);

  return newData;
};

const getDataAfterAddTrack = (state, action) => {
  return [...state.data].map(p => {
    let newPlaylist = {...p};
    let newTrackList = [...newPlaylist.tracks];

    if (action.playlists.includes(newPlaylist.title))
      newTrackList.push(action.track);

    newPlaylist.tracks = newTrackList;
    return newPlaylist;
  });
}

const getDataAfterRemoveTrack = (state, action) => {
  return [...state.data].map(p => {
    let newPlaylist = {...p};
    let newTrackList = [...newPlaylist.tracks];

    if (p.title === action.playlistName)
      newTrackList = newTrackList.filter(t => t._id !== action.trackId);

    newPlaylist.tracks = newTrackList;
    return newPlaylist;
  });
}

const createPlaylistSuccess = (state, action) => {
  return updateObject(state, {
    data: getDataAfterAdd(action.playlist, state.data),
    error: null
  });
};

const createPlaylistFail = (state, action) => {
  return updateObject(state, {playlists: state.data, error: action.error})
};

const fetchPlaylistsSuccess = (state, action) => {
  return updateObject(state, {data: action.data, error: null})
};

const fetchPlaylistsFail = (state, action) => {
  return updateObject(state, {playlists: [], error: action.error})
};

const deletePlaylistSuccess = (state, action) => {
  return updateObject(state, {
    data: getDataAfterDelete(action.playlistId, state.data),
    error: null
  })
};

const deletePlaylistFail = (state, action) => {
  return updateObject(state, {data: state.data, error: action.error})
};

export const addTrackToPlaylistSuccess = (state, action) => {
  return updateObject(state, {
    data: getDataAfterAddTrack(state, action),
    error: null
  });
};

export const addTrackToPlaylistFail = (state, action) => {
  return updateObject(state, {data: state.data, error: action.error});
};

const removeTrackFromPlaylistSuccess = (state, action) => {
  return updateObject(state, {
    data: getDataAfterRemoveTrack(state, action),
    error: null
  })
};

const removeTrackFromPlaylistFail = (state, action) => {
  return updateObject(state, {data: state.data, error: action.error})
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PLAYLISTS_SUCCESS: return fetchPlaylistsSuccess(state, action);
    case actionTypes.FETCH_PLAYLISTS_FAIL: return fetchPlaylistsFail(state, action);
    case actionTypes.DELETE_PLAYLISTS_SUCCESS: return deletePlaylistSuccess(state, action);
    case actionTypes.DELETE_PLAYLISTS_FAIL: return deletePlaylistFail(state, action);
    case actionTypes.CREATE_PLAYLIST_SUCCESS: return createPlaylistSuccess(state, action);
    case actionTypes.CREATE_PLAYLIST_FAIL: return createPlaylistFail(state, action);
    case actionTypes.ADD_TRACK_TO_PLAYLIST_SUCCESS: return addTrackToPlaylistSuccess(state, action);
    case actionTypes.ADD_TRACK_TO_PLAYLIST_FAIL: return addTrackToPlaylistFail(state, action);
    case actionTypes.REMOVE_TRACK_FROM_PLAYLIST_SUCCESS: return removeTrackFromPlaylistSuccess(state, action);
    case actionTypes.REMOVE_TRACK_FROM_PLAYLIST_FAIL: return removeTrackFromPlaylistFail(state, action);
    default: return state;
  }
}

export default reducer;