import React from "react";

const PlayerMenu = props => {
  return (
    <div className="mt-3">
      <div className="d-flex justify-content-around mb-3">
        <span>Listens: {props.currentTrackListens}</span>
        <span>Likes: {props.currentTrackLikes}</span>
      </div>
      <div className="d-flex justify-content-around mb-3">
        <button className="btn btn-outline-primary" disabled={props.isLiked} onClick={props.addLike}>👍 Like</button>
        <button className="btn btn-outline-success" onClick={props.addToPlaylist}>Add to playlist</button>
        <button className="btn btn-outline-secondary" onClick={props.removeTrack}>🗑 Remove from queue</button>
      </div>
    </div>
  )
}

export default PlayerMenu;