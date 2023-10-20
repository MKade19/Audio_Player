const ApiError = require("../../errors/api.error");
const {checkAuth} = require("../../util/util");
const CommentService = require('../../services/comment.service');
const UserService = require('../../services/user.service');
const TrackService = require('../../services/track.service');

module.exports = {
  query: {
    commentsByTrack: async (root, {trackId}, {req}) => {
      return new CommentService().commentsByTrack(trackId);
    },

    comment: async (root, { id }, {req}) => {
      return new CommentService().singleCommentById(id);
    },

    commentsData: async (root, {limit, pageNumber}, {req}) => {
      const commentsData =
        await new CommentService((pageNumber - 1) * limit, limit)
          .allComments();

      return {comments: commentsData.comments, total: commentsData.total};
    }
  },

  mutation: {
    addComment: async (root, { commentInput }, { req }) => {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      const user = await new UserService().singleUserById(payload.userId);
      if (!user) {
        throw ApiError.NotFound('There is no such a user');
      }

      const track = await new TrackService().singleTrackById(commentInput.trackId);
      if (!track) {
        throw ApiError.NotFound('There is no such a track');
      }

      const comment = await new CommentService().createComment({
        content: commentInput.content,
        trackId: commentInput.trackId,
        userId: payload.userId
      });

      return {
        _id: comment._id,
        content: comment.content,
        user: { userName: user.userName }
      };
    },

    addFullComment: async (root, { userName, trackTitle, content }, { req }) => {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      const user = await new UserService().singleUserByUserName(userName);
      if (!user) {
        throw ApiError.NotFound('There is no such a user');
      }

      const track = await new TrackService().singleTrackByTitle(trackTitle);
      if (!track) {
        throw ApiError.NotFound('There is no such a track');
      }

      const comment = await new CommentService().createComment({
        content: content,
        trackId: track._id,
        userId: user._id
      });

      return {
        _id: comment._id,
        content: comment.content,
        user: { userName: user.userName }
      };
    },

    updateComment: async (root, { commentId ,userName, trackTitle, content }, { req }) => {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      const user = await new UserService().singleUserByUserName(userName);
      if (!user) {
        throw ApiError.NotFound('There is no such a user');
      }

      const track = await new TrackService().singleTrackByTitle(trackTitle);
      if (!track) {
        throw ApiError.NotFound('There is no such a track');
      }

      const commentService = new CommentService();
      const comment = await commentService.singleCommentById(commentId);
      if (!comment) {
        throw ApiError.NotFound('There is no such a comment!');
      }

      await commentService.updateComment({
        commentId,
        content,
        trackId: track._id,
        userId: user._id,
      });

      return {_id: commentId};
    },

    deleteComment: async (root, { id }, { req }) => {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      const user = await new UserService().singleUserById(payload.userId);
      if (!user) {
        throw ApiError.NotFound('There is no such a user');
      }

      await new CommentService().deleteComment(id);

      return {_id: id};
    }
  }
}