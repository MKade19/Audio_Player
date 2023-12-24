import axios from "../axios/axios";
import {createPlaylist} from "../store/actions/index";
import store from "../store/store";

class PlaylistService {
  createRawPlaylist = async ({playlistName, userId}) => {
    const graphQlQuery = {
      query: `mutation 
        CreateRawPlaylist($playlistName: String!, $userId: ID!) {
          createRawPlaylist(
            playlistName: $playlistName,
            userId: $userId
          ) {
            _id
            title
            tracks {
              _id
            }
          }
        }
      `,
      variables: {
        playlistName: playlistName,
        userId: userId
      }
    }

    let response = {};

    try {
      response = await axios.post('', graphQlQuery);
    } catch (error) {
      alert(error.response.data.errors.map(e => e.message).join('\n'));
      return;
    }

    //console.log(response);
    store.dispatch(createPlaylist(response.data.data.createRawPlaylist));

    return response.data.data.createRawPlaylist;
  }

  createPlaylist = async (payload) => {
    const playlistInput = {
      title: payload.title.value,
      userName: payload.userName.value,
      tracks: payload.trackList.value
    }

    const graphQlQuery = {
      query: `mutation 
        CreatePlaylist($playlistInput: PlaylistInputData!) {
          createPlaylist(playlistInput: $playlistInput) {
            _id
          }
        }
      `,
      variables: { playlistInput }
    }

    let response = {};

    try {
      response = await axios.post('', graphQlQuery);
    } catch (error) {
      alert(error.response.data.errors.map(e => e.message).join('\n'));
      return;
    }
    // console.log(response);
    return response.data.data.createPlaylist;
  }

  updatePlaylist = async ({payload}) => {
    const playlistInput = {
      title: payload.title.value,
      userName: payload.userName.value,
      tracks: payload.trackList.value
    }

    const graphQlQuery = {
      query: `mutation 
        UpdatePlaylist($playlistId: ID!, $playlistInput: PlaylistInputData!) {
          updatePlaylist(playlistId: $playlistId, playlistInput: $playlistInput) {
            _id
          }
        }
      `,
      variables: {
        playlistId: payload.playlistId,
        playlistInput
      }
    }

    let response = {};

    try {
      response = await axios.post('', graphQlQuery);
    } catch (error) {
      alert(error.response.data.errors.map(e => e.message).join('\n'));
      return;
    }
    // console.log(response);
    return response.data.data.updatePlaylist;
  }

  fetchPlaylistForForm = async (playlistId) => {
    // console.log(playlistId)
    const graphQlQuery = {
      query: `{
        playlistForForm(id: "${playlistId}") {
          title
          user {
            userName
          }
          tracks {
            title
          }
        }
      }`
    };

    let response = {};

    try {
      response = await axios.post('', graphQlQuery);
    } catch (error) {
      alert(error.response.data.errors.map(e => e.message).join('\n'));
      return;
    }
    // console.log(response);
    let playlist = response.data.data.playlistForForm;
    playlist.trackList = playlist.tracks.map(el => el.title).join(', ');
    playlist.userName = playlist.user.userName;
    delete playlist.user;
    delete playlist.tracks;

    return playlist;
  }
}

export default new PlaylistService();