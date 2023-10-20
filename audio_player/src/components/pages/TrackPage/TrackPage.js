import {Button, ListGroup} from "react-bootstrap";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {connect} from "react-redux";
import * as actions from "../../../store/actions";
import forms from "../../../util/forms";
import FormModal from "../../UI/Modals/FormModal/FormModal";
import StandardModal from "../../UI/Modals/StandardModal/StandardModal";
import CommentsList from "./CommentsList/CommentsList";
import InfoList from "../../UI/Lists/InfoList/InfoList";
import TrackService from '../../../services/track.service';
import CommentService from "../../../services/comment.service";

const TrackPage = props => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [track, setTrack] = useState({});
  const [state, setState] = useState({
    formIsValid: false,
    showComments: false
  });
  const [formModal, setFormModal] = useState({
    title: '',
    controls: null,
    show: false,
    submitHandler: null,
  },);
  const [notAuthModal, setNotAuthModal] = useState( {
    title: '',
    content: '',
    show: false,
  });
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchTrack = async () => {
      if (searchParams.get('id'))
        setTrack(await TrackService.fetchOneTrack(searchParams.get('id')));
    }

    fetchTrack();
  }, []);


  useEffect(() => {
    const fetchComments = async () => {
      setComments(await CommentService.fetchCommentsByTrack(track._id));
    }

    if (track._id) {
      fetchComments();
    }
  }, [track]);

  const addTrackToQueue = () => {
    props.onAdd(track);
  }

  const closeModal = () => {
    setNotAuthModal({
        title: '',
        content: '',
        redirectTo: '',
        show: false,
    })
  }

  const showModal = () => {
    setNotAuthModal({
        title: 'Not authorized',
        content: 'You need to be authorized to perform this action!',
        redirectTo: '',
        show: true,
    });
  }

  const addToPlaylist = async (data) => {
    if (!props.userId) {
      showModal();
      return;
    }

    const payload = [];
    for (let key in data) {
      if (!data[key].active) continue;

      payload.push(data[key].value);
    }

    props.onAddTrack(payload, track._id);
    closeFormModal();
  }

  const closeFormModal = () => {
    setFormModal({
      title: '',
      controls: null,
      show: false,
      submitHandler: null
    });
  }

  const showFormModal = ({title, controls, submitHandler, formIsValid}, event) => {
    setFormModal({
        title: title,
        controls: controls,
        show: true,
        submitHandler: submitHandler
    });
    setState({...state, formIsValid: formIsValid});
  }

  const showComments = () => {
    setState({
      ...state,
      showComments: !state.showComments
    });
  }

  const addComment = async (data) => {
    if (!props.userId) {
      alert('You are not authorized!')
      return;
    }

    const comment = await CommentService.createComment({
      trackId: track._id,
      content: data.content.value
    });

    const newComments = comments;
    newComments.push(comment);
    setComments(newComments);

    closeFormModal();
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center px-5">
      <h1 className="mt-3">{track.title}</h1>
      <InfoList
        item={track}
      />
      <div className="mt-3 d-inline-block">
        <Button
          className="me-3 btn-primary"
          onClick={addTrackToQueue}
        >
          Add to queue
        </Button>
        <Button
          className="btn-success me-3"
          onClick={event => showFormModal({
            title: 'Choose the playlist',
            controls: forms.choosePlaylistListForm(props.playlists),
            submitHandler: addToPlaylist,
            formIsValid: true,
          }, event)}
        >
          Add to playlist
        </Button>
        <Button
          className="btn-secondary"
          onClick={showComments}
        >
          View comments
        </Button>
      </div>
      {state.showComments ? <CommentsList
        track={track}
        comments={comments}
        addComment={(e) => showFormModal({
          title: 'Enter the comment',
          controls: forms.commentUserForm,
          submitHandler: addComment,
          formIsValid: true,
        }, e)}
      /> : null}
      <FormModal
        title={formModal.title}
        controls={formModal.controls}
        showModal={formModal.show}
        submitHandler={formModal.submitHandler}
        formIsValid={state.formIsValid}
        closeModal={closeFormModal}
        changeValidity={() => {}}
      />
      <StandardModal
        showModal={notAuthModal.show}
        title={notAuthModal.title}
        content={notAuthModal.content}
        closeModal={closeModal}
      />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    userId: state.auth.userId,
    playlists: state.playlists.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAdd: track => dispatch(actions.trackAdded(track)),
    onAddTrack: (payload, trackId) => {dispatch(actions.addTrackToPlaylist(payload, trackId))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackPage);