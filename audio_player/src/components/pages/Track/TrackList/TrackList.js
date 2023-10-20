import Track from "../Track";
import React, {useEffect, useState} from "react";
const TrackList = props => {
  let trackCounter = 1;

  const [state, setState] = useState({
    trackList: []
  });

  useEffect(() => {
    if (props.trackList) {
      setState({...state, trackList: props.trackList});
    }
  }, [props.trackList]);

  return (
    <div className="list-group" id="list-tab" role="tablist">
      {state.trackList.map(track => {
         return <Track
             key={track._id}
             track={{_id: track._id, title: track.title}}
             trackNumber={trackCounter++}
             toggleTrack={props.toggleTrack}
           />
      })}
    </div>
  );
}
export default TrackList;