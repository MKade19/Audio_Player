import {useNavigate, useSearchParams} from "react-router-dom";
import forms from '../../../../util/forms'
import FormUI from "../../../UI/FormUI/FormUI";
import {useEffect, useState} from "react";
import {connect} from "react-redux";
import util from '../../../../util/util'
import TrackService from '../../../../services/track.service';
import UserService from "../../../../services/user.service";
import PlaylistService from "../../../../services/playlist.service";
import {Button} from "react-bootstrap";
import CommentService from "../../../../services/comment.service";

const EditAddPage = props => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [controls, setControls] = useState({});
  const [formIsValid, setFormIsValid] = useState(false);
  const [record, setRecord] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modal, setModal] = useState({
    title: '',
    content: '',
    redirectTo: '',
    show: false
  });

  const fetchRecord = async fetchFunction => {
    setRecord(await fetchFunction(searchParams.get('id')));
  }

  useEffect(() => {
    let formConfig = {}, fetchFunction;
    switch (searchParams.get('collectionName')) {
      case 'tracks':
        formConfig = forms.trackForm;
        fetchFunction = TrackService.fetchOneTrackForForm;
        break;
      case 'users':
        formConfig = forms.userForm;
        fetchFunction = UserService.fetchOneUserForForm;
        break;
      case 'playlists':
        formConfig = forms.playlistsForm;
        fetchFunction = PlaylistService.fetchPlaylistForForm;
        break;
      case 'comments':
        formConfig = forms.commentAdminForm;
        fetchFunction = CommentService.fetchCommentForForm;
        break;
      default:
    }

    if (props.mode === 'EDIT') {
      fetchRecord(fetchFunction);
      delete formConfig.password;
    }

    const controls = {...formConfig};
    setControls(controls);
  }, [searchParams]);

  useEffect(() => {
    if (!record) return;

    let updatedControls;
    updatedControls = JSON.parse(JSON.stringify(controls));
    for (let key in record) {
      if (key !== 'audioUrl') {
        updatedControls[key].value = record[key];
        updatedControls[key].valid = true;
      }
    }

    setControls(updatedControls);
  }, [record]);

  const inputChangeHandler = (controls, formIsValid, file) => {
    setControls(controls);
    setFormIsValid(formIsValid);
    if (file) {
      setSelectedFile(file)
    }
  }

  const submitHandler = async () => {
    if (props.mode === 'CREATE') {
      await createRecord();
    } else {
      await updateRecord();
    }

    setControls({...util.refreshControls(controls)});
  }

  const createRecord = async () => {
    if (!window.confirm('Do you want to add this record?')) return;

    switch (searchParams.get('collectionName')) {
      case 'tracks':
        const audioData = new FormData();
        audioData.append(
          "audioFile",
          selectedFile,
          selectedFile.name
        );
        await TrackService.createTrack({
          audioData,
          fieldValues: controls,
          userId: props.userId
        });
        break;
      case 'users':
        await UserService.createUser(controls);
        break;
      case 'playlists':
        await PlaylistService.createPlaylist(controls);
        break;
      case 'comments':
        await CommentService.createFullComment(controls);
        break;
    }
  }

  const updateRecord = async () => {
    if (!window.confirm('Do you want to update this record?')) return;

    const recordId = searchParams.get('id');

    switch (searchParams.get('collectionName')) {
      case 'tracks':
        if (!selectedFile) {
          return;
        }

        const audioData = new FormData();
        audioData.append(
          "audioFile",
          selectedFile,
          selectedFile.name
        );

        await TrackService.updateTrack({
          audioData,
          fieldValues: controls,
          userId: props.userId,
          trackId: recordId,
          oldUrl: record.audioUrl
        });
        break;
      case 'users':
        await UserService.updateUser(recordId, controls);
        break;
      case 'playlists':
        await PlaylistService.updatePlaylist({ payload: {
          ...controls,
          playlistId: recordId
        }})
        break;
      case 'comments':
        await CommentService.updateComment(recordId, controls);
        break;
    }
  }

  const navigateToMain = () => {
    navigate({pathname: '/admin/main', search: '', hash: ''})
  }

  return (
    <div className="d-flex flex-column align-items-center mt-3">
      <h1>{props.mode === 'CREATE' ? 'Create' : 'Edit'} {searchParams.get('collectionName').slice(0, -1)}</h1>
      <FormUI
        controls={controls}
        inputChangeHandler={inputChangeHandler}
        formIsValid={formIsValid}
        submitHandler={submitHandler}
      />
      <Button variant="link" onClick={navigateToMain}>Back to administration</Button>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    userId: state.auth.userId
  }
}

export default connect(mapStateToProps)(EditAddPage);