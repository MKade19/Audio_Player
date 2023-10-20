import axios from "../axios/axios";

class CommentService {
  fetchCommentsByTrack = async trackId => {
    const graphQlQuery = {
      query: `query CommentsByTrack($trackId: ID!) {
          commentsByTrack(trackId: $trackId) {
            _id
            content
            user {
              userName
            }
          }
        }`,
      variables: {trackId: trackId}
    }

    const response = await axios.post('', graphQlQuery);
    //console.log(response);
    return response.data.data.commentsByTrack;
  }

  createComment = async ({trackId, content}) => {
    const graphQlQuery = {
      query: `mutation AddComment($commentInput: CommentInputData!) {
        addComment(commentInput: $commentInput) {
          _id
          content
          user {
            userName
          }
        }
      }`,
      variables: {
        commentInput: {
          content: content,
          trackId: trackId,
        }
      }
    }

    const response = await axios.post('', graphQlQuery);
    // console.log(response);
    return response.data.data.addComment;
  }

  createFullComment = async (controls) => {
    const graphQlQuery = {
      query: `mutation AddComment($content: String!, $userName: String!, $trackTitle: String!) {
        addFullComment(content: $content, userName: $userName, trackTitle: $trackTitle) {
          _id
          content
          user {
            userName
          }
        }
      }`,
      variables: {
        content: controls.content.value,
        userName: controls.userName.value,
        trackTitle: controls.trackTitle.value
      }
    }

    const response = await axios.post('', graphQlQuery);
    // console.log(response);
    return response.data.data.addFullComment;
  }

  fetchCommentForForm = async commentId => {
    const graphQlQuery = {
      query: `query Comment($id: ID!) {
          comment(id: $id) {
            content
            user {
              userName
            }
            track {
              title
            }
          }
        }`,
      variables: {id: commentId}
    }

    const response = await axios.post('', graphQlQuery);
    // console.log(response);
    return {
      content: response.data.data.comment.content,
      userName: response.data.data.comment.user.userName,
      trackTitle: response.data.data.comment.track.title,
    };
  }

  updateComment = async (commentId, controls) => {
    const graphQlQuery = {
      query: `mutation UpdateComment($commentId: String!, $userName: String!, $trackTitle: String!, $content: String!) {
        updateComment(commentId: $commentId, userName: $userName, trackTitle: $trackTitle, content: $content) {
          _id
        }
      }`,
      variables: {
        commentId,
        userName: controls.userName.value,
        trackTitle: controls.trackTitle.value,
        content: controls.content.value
      }
    };

    const response = await axios.post('', graphQlQuery);
    console.log(response);
  }
}

export default new CommentService();