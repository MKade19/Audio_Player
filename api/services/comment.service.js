const Comment = require("../models/comment");

class CommentService {
  constructor(startPos, limit) {
    this.startPos = startPos;
    this.limit = limit;
  }

  commentsByTrack = async trackId => {
    return Comment.aggregate([
      { $match: { $expr: { $eq: ['$trackId', { $toObjectId: trackId }] } } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: { path: '$user' } }
    ]);
  }

  singleCommentById = async commentId => {
    return (await Comment.aggregate([
      { $match: { $expr: { $eq: ['$_id', { $toObjectId: commentId }] } } },
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'userId',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'tracks',
          foreignField: '_id',
          localField: 'trackId',
          as: 'track'
        }
      },
      { $unwind: {path: '$user'} },
      { $unwind: {path: '$track'} },
    ]))[0];
  }

  allComments = async () => {
    return {
      comments: await Comment.aggregate([
        {
          $lookup: {
            from: 'users',
            foreignField: '_id',
            localField: 'userId',
            as: 'user'
          }
        },
        {
          $lookup: {
            from: 'tracks',
            foreignField: '_id',
            localField: 'trackId',
            as: 'track'
          }
        },
        { $unwind: {path: '$user'} },
        { $unwind: {path: '$track'} },
        { $addFields: {'title': {
          $concat: [
            '$user.userName',
            ': ',
            '$track.title'
          ]
        } } },
        { $skip: this.startPos },
        { $limit: this.limit }
      ]),
      total: await Comment.find({}).count()
    };
  }

  createComment = async ({content, trackId, userId}) => {
    return Comment.create({
      content: content,
      trackId: trackId,
      userId: userId
    });
  }

  updateComment = async ({commentId, content, trackId, userId}) => {
    return Comment.updateOne({_id: commentId}, {
      $set: {
        content: content,
        trackId: trackId,
        userId: userId
      }
    })
  }

  deleteComment = async commentId => {
    return Comment.deleteOne({_id: commentId});
  }
}

module.exports = CommentService;