import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";

const Track = props => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [state, setState] = useState({
    track: {},
    isActive: false
  });

  useEffect(() => {
    setState({
      track: props.track,
      isActive: props.track._id === searchParams.get('trackId')
    });
  }, [props.track]);

  return (
    <a
      className={'list-group-item list-group-item-action' + (state.isActive ? ' active' : '')}
      id="list-home-list"
      data-bs-toggle="list"
      href="src/components/pages/Track/Track"
      role="tab"
      aria-controls="list-home"
      onClick={props.toggleTrack.bind(props.track, props.track)}
    >
      {`${props.trackNumber}. ${state.track.title}`}
    </a>
  );
}

export default Track;