import AudioPlayer from "./AudioPlayer/AudioPlayer";
import TrackList from "../Track/TrackList/TrackList";
import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {connect} from "react-redux";
import * as actions from "../../../store/actions";

const PlayerPage = props => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (props.trackQueue.length !== 0) {
      const tracks = props.trackQueue;
      let activeTrack = tracks.find(t => true);

      if (!searchParams.get('trackId'))
        setSearchParams({'trackId': activeTrack._id});
      else
        activeTrack = tracks.find(t => t._id === searchParams.get('trackId'));

      setTracks(tracks);
      setCurrentTrack(activeTrack);
    } else {
      setTracks([]);
      setCurrentTrack(null);
    }
  }, [props.trackQueue]);

  useEffect(() => {
    if (tracks.length !== 0) {
      const currentTrack = tracks.find(track => {
        return track._id === searchParams.get('trackId');
      });

      setCurrentTrack(currentTrack);
    }
  }, [searchParams]);

  const toggleTrack = newTrack => {
    setSearchParams({'trackId': newTrack._id});
  }

  const removeTrack = () => {
    if (!window.confirm('Are you sure?')) {
      return;
    }

    setSearchParams({'trackId': ''});
    props.onRemove(searchParams.get('trackId'));
  }

  const nextTrack = () => {
    const newIndex = tracks.indexOf(currentTrack) + 1;

    if(!tracks[newIndex]) {
      alert('Queue has ended!');
      props.onRefreshQueue();
      return;
    }

    toggleTrack(tracks[newIndex]);
  }

  return (
    <main>
      {currentTrack ? <div className="d-flex flex-row justify-content-around my-5">
        <AudioPlayer
          currentTrack={currentTrack}
          removeTrack={removeTrack}
          nextTrack={nextTrack}
        />
        <TrackList
          toggleTrack={toggleTrack}
          trackList={tracks}
          currentTrack={currentTrack}
          removeTrack={removeTrack}
        />
      </div>
      : <h1 className="mt-3">Track queue is empty!</h1>}
    </main>
  );
}

const mapStateToProps = state => {
  return {
    trackQueue: state.trackQueue.queue.tracks,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRemove: trackId => {dispatch(actions.trackRemoved(trackId))},
    onRefreshQueue: () => {dispatch(actions.refreshQueue())}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerPage);