import {connect} from "react-redux";
import {useEffect, useState} from "react";
import {Button, ListGroup} from "react-bootstrap";
import forms from "../../../util/forms";
import FormModal from "../../UI/Modals/FormModal/FormModal";
import StandardModal from "../../UI/Modals/StandardModal/StandardModal";
import {useNavigate} from "react-router-dom";
import * as actions from "../../../store/actions";
import PlaylistService from "../../../services/playlist.service";

const PlaylistsPage = props => {
  const navigate = useNavigate();
  
  const [formModal, setFormModal] = useState({
    title: '',
    show: false
  });
  const [infoModal, setInfoModal] = useState({
    title: '',
    content: null,
    show: false
  });
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    if (props.playlistsError) {
      setInfoModal({
        title: 'Error ' + props.playlistsError.response.status,
        content: props.playlistsError.response.data.errors[0].message,
        show: true
      });
    }
  }, [props.playlistsError]);

  const addPlaylist = () => {
    setFormModal({
      title: 'Add playlist',
      show: true
    })
  };

  const closeFormModal = () => {
    setFormModal({
      title: '',
      show: false
    })
  }

  const submitHandler = async payload => {
    await PlaylistService.createRawPlaylist({
      playlistName: payload.playlistName.value,
      userId: props.userId
    });
    closeFormModal();
  }

  const closeInfoModal = () => {
    setInfoModal({
      title: '',
      content: null,
      show: false
    });
  }

  const showInfo = (playlistName, trackList) => {
    const trackListInfo = trackList.map(track => {
      return <ListGroup.Item as="li" key={track._id}>
        {track.title}
        <Button variant="success" onClick={() => navigateToTrack(track._id)} className="ms-3">View</Button>
        <Button variant="danger" onClick={() => removeTrack(playlistName, track._id)} className="ms-3">Remove</Button>
      </ListGroup.Item>
    });

    setInfoModal({
      title: 'Playlist tracks',
      content: trackListInfo.length === 0 ? <h4>This playlist is empty!</h4> :
        <ListGroup as="ol" className="text-capitalize" numbered>
          {trackListInfo}
        </ListGroup>,
      show: true
    });
  }

  const navigateToTrack = trackId => {
    navigate('/track?id=' + trackId);
  }

  const removeTrack = (playlistName, trackId) => {
    props.onRemoveTrack(playlistName, trackId);
    closeInfoModal();
  }
  const addPlaylistToQueue = playlist => {
    props.onAddPlaylistToQueue(playlist);
  }

  const deletePlaylist = async playlistId => {
    props.onDeletePlaylist(playlistId);
  }

  const getContentForList = () => {
    return props.playlists.map(p => {
      return <ListGroup.Item key={p._id}>
        <div className="d-flex justify-content-between mx-3">
          {p.title}
          <span>
            <Button className="ms-3" onClick={() => showInfo(p.title, p.tracks)} variant="info">View tracks</Button>
            <Button className="ms-3" onClick={() => addPlaylistToQueue(p.tracks)} variant="secondary">Add to queue</Button>
            <Button className="ms-3" onClick={() => deletePlaylist(p._id)} variant="danger"><b>X</b></Button>
          </span>
        </div>
      </ListGroup.Item>
    });
  }

  const playlistsView = (
    <div style={{width: '40rem', display: 'inline-block'}}>
      <ListGroup className="mt-3 fs-3">
        {getContentForList()}
      </ListGroup>
    </div>
  );

  const playlistControls = <div className="mt-3">
    <Button className="btn-success" onClick={addPlaylist}>Add playlist</Button>
  </div>

  const changeValidity = formIsValid => {
    setFormIsValid(formIsValid);
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center px-5">
      {props.playlists.length !== 0 ?
        <div className="mt-3">
          <h1>Your playlists</h1>
          {playlistsView}
        </div> :
        <h1>You have no playlists!</h1>
      }
      {playlistControls}
      <FormModal
        title={formModal.title}
        controls={forms.addPlaylistForm}
        showModal={formModal.show}
        submitHandler={submitHandler}
        closeModal={closeFormModal}
        formIsValid={formIsValid}
        changeValidity={changeValidity}
      />
      <StandardModal
        title={infoModal.title}
        content={infoModal.content}
        showModal={infoModal.show}
        closeModal={closeInfoModal}
      />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    userId: state.auth.userId,
    playlists: state.playlists.data,
    playlistsError: state.playlists.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDeletePlaylist: playlistId => { dispatch(actions.deletePlaylist(playlistId)) },
    onCreatePlaylist: (playlistName, userId) => { dispatch(actions.createPlaylist(playlistName, userId)) },
    onRemoveTrack: (playlistName, trackId) => { dispatch(actions.removeTrackFromPlaylist(playlistName, trackId))},
    onAddPlaylistToQueue: playlist => { dispatch(actions.playlistAdded(playlist)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistsPage);