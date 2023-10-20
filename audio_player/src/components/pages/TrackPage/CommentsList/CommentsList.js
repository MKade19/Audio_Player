import {Button, ListGroup} from "react-bootstrap";
import {connect} from "react-redux";

const CommentsList = props => {
  const addComment = async () => {
    await props.addComment();
  }

  return (
    <div className="mt-3">
      <h2>
        Comments
        <Button variant="success" className="ms-3" onClick={addComment}>Add comment</Button>
      </h2>
      <ListGroup className="my-3 fs-5" style={{wordBreak: 'break-all'}}>
        {props.comments.map(comment =>
            <ListGroup.Item key={comment._id} variant="secondary" className="mt-3">
              <b>{comment.user.userName}:</b> {comment.content}
            </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    userId: state.auth.userId
  }
}

export default connect(mapStateToProps)(CommentsList);