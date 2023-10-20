import {combineReducers} from "redux";

import tracksReducer from "./tracks";
import authReducer from "./auth";
import queue from "./trackQueue";
import playlistsReducer from "./playlists";

export default combineReducers({
  tracks: tracksReducer,
  auth: authReducer,
  trackQueue: queue,
  playlists: playlistsReducer
});