import PlayerMenu from "../../../UI/PlayerMenu/PlayerMenu";
import {useEffect, useState} from "react";
import ReactAudioPlayer from "react-audio-player";
import axios from "../../../../axios/axios";
import {useSearchParams} from "react-router-dom";
import {connect} from "react-redux";
import StandardModal from "../../../UI/Modals/StandardModal/StandardModal";
import forms from "../../../../util/forms";
import FormModal from "../../../UI/Modals/FormModal/FormModal";
import * as actions from "../../../../store/actions";

const AudioPlayer = props => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [ state, setState ] = useState({
    currentTrack: {},
    errorModal: {
      title: '',
      content: '',
      show: false,
    },
    isLiked: false,
    playlistsModal: {
      title: '',
      show: false
    },
    listenedOffset: 0.0,
    formIsValid: true,
    hasListened: false
  });

  const onLoadedAudio = event => {
    setState({ ...state, listenedOffset: event.target.duration * 1000 / 5 });
  };

  const addListen = async currentTime => {
    if (state.hasListened) {
      return;
    }

    const graphQlQuery = {
      query: `
        mutation AddListen($id: ID!) {
          addListen(id: $id) {
            listensQuantity
          }
        }
      `,
      variables: { id: searchParams.get('trackId') }
    }

    const newQuantity = (await axios.post('/graphql', graphQlQuery)).data.data.addListen.listensQuantity;
    // console.log(newQuantity)

    setState({
      ...state,
      currentTrack: {...state.currentTrack, listensQuantity: newQuantity},
      hasListened: true
    });

    if (!props.userId)
      props.onAddListen();
  }

  const addLike = async () => {
    if (!props.userId) {
      showErrorModal('Error 401', 'You are not authorized', '');
      return;
    }

    const graphQlQuery = {
      query: `
        mutation AddLike($id: ID!, $userId: ID!) {
          addLike(id: $id, userId: $userId)
        }
      `,
      variables: {
        id: searchParams.get('trackId'),
        userId: props.userId
      }
    }

    const response = await axios.post('/graphql', graphQlQuery);
    // console.log(response)

    setState({
      ...state,
      currentTrack: {
        ...state.currentTrack,
        likesQuantity: response.data.data.addLike
      }
    });
  }

  const addToPlaylist = async (data) => {
    if (!props.userId) {
      showErrorModal('Error 401', 'You are not authorized', '');
      return;
    }

    const payload = [];
    for (let key in data) {
      if (!data[key].active) continue;

      payload.push(data[key].value);
    }

    props.onAddTrack(payload, state.currentTrack._id);
    closePlaylistModal();
  }

  useEffect(() => {
    if (props.currentTrack) {
      setState({
        ...state,
        currentTrack: props.currentTrack,
        isLiked: props.currentTrack.usersWhoLiked.includes(props.userId),
        hasListened: false
      });
    }
  }, [props.currentTrack]);

  const closeErrorModal = () => {
    setState({...state,
      errorModal: {
        title: '',
        content: '',
        redirectTo: '',
        show: false,
      }})
  }

  const showErrorModal = (title, content, redirectTo) => {
    setState({
      ...state,
      errorModal: {
        title: title,
        content: content,
        redirectTo: redirectTo,
        show: true,
      }
    });
  }

  const closePlaylistModal = () => {
    setState({
      ...state,
      playlistsModal: {
        title: '',
        show: false
      }
    });
  }

  const showPlaylistModal = () => {
    setState({
      ...state,
      playlistsModal: {
        title: 'Choose the playlist',
        show: true
      }
    })
  }

  const trackEnded = () => {
    blockListening();
    props.nextTrack();
  }

  const blockListening = () => {
    if (props.listenedTracks > 9) {
      showErrorModal(
        'You can\'t listen more than 10 tracks!',
        `Please, authorize to listen more (your queue will be refreshed in 10 seconds)`,
        ''
      );
      setTimeout(() => {props.onRefreshQueue();}, 10000);
    }
  }

  return (
    <div className="w-50">
      <h1>{state.currentTrack.title}</h1>
      <ReactAudioPlayer
        className="mt-5"
        controls
        src={'http://localhost:5000/resources/audio/' + state.currentTrack.audioUrl}
        onEnded={trackEnded}
        onLoadedMetadata={onLoadedAudio}
        listenInterval={state.listenedOffset}
        onListen={addListen}
        autoPlay
        onPlay={blockListening}
      />
      <PlayerMenu
        currentTrackListens={state.currentTrack.listensQuantity}
        currentTrackLikes={state.currentTrack.usersWhoLiked ? state.currentTrack.usersWhoLiked.length : 0}
        addLike={addLike}
        addToPlaylist={showPlaylistModal}
        removeTrack={props.removeTrack}
        isLiked={state.isLiked}
      />
      <StandardModal
        showModal={state.errorModal.show}
        title={state.errorModal.title}
        content={state.errorModal.content}
        closeModal={closeErrorModal}
      />
      <FormModal
        title={state.playlistsModal.title}
        controls={forms.choosePlaylistListForm(props.playlists)}
        showModal={state.playlistsModal.show}
        submitHandler={addToPlaylist}
        closeModal={closePlaylistModal}
        formIsValid={state.formIsValid}
        changeValidity={() => {}}
      />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    userId: state.auth.userId,
    playlists: state.playlists.data,
    listenedTracks: state.tracks.listenedTracks
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAddTrack: (payload, trackId) => {dispatch(actions.addTrackToPlaylist(payload, trackId))},
    onAddListen: () => {dispatch(actions.trackHasBeenListened())},
    onRefreshQueue: () => {dispatch(actions.refreshQueue())}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);