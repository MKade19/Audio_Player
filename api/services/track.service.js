const Track = require("../models/track");

class TrackService {
  constructor(startPos, limit) {
    this.startPos = startPos;
    this.limit = limit;
  }

  allTracks = async () => {
    return {
      tracks: await Track.aggregate([
        {
          $addFields: {
            'likesQuantity': {
              $size: '$usersWhoLiked'
            }
          }
        },
        { $skip: this.startPos },
        { $limit: this.limit }
      ]),
      total: await Track.find({}).count()
    };
  }

  singleTrackById = async (trackId) => {
    return (await Track.aggregate([
      {
        $match: {
          $expr: { $eq: ['$_id', { $toObjectId: trackId }] }
        }
      },
      {
        $addFields: {
          'likesQuantity': {
            $size: '$usersWhoLiked'
          }
        }
      },
    ]))[0];
  }

  singleTrackByTitle = async (title) => {
    return (await Track.aggregate([
      {
        $match: { title: title }
      },
      {
        $addFields: {
          'likesQuantity': {
            $size: '$usersWhoLiked'
          }
        }
      },
    ]))[0];
  }

  tracksSortedByListens = async () => {
    return {
      tracks: await Track.aggregate([
        { $sort: { listensQuantity: -1 } },
        {
          $addFields: {
            'likesQuantity': {
              $size: '$usersWhoLiked'
            }
          }
        },
        { $skip: this.startPos },
        { $limit: this.limit }
      ]),
      total: await Track.find({}).count()
    };
  }

  tracksByCategory = async category => {
    return {
      tracks: await Track.aggregate([
        { $match: {category: category} },
        {
          $addFields: {
            'likesQuantity': {
              $size: '$usersWhoLiked'
            },
          }
        },
        { $skip: this.startPos },
        { $limit: this.limit }
      ]),
      total: await Track.find({category: category}).count()
    };
  }

  searchTracks = async title => {
    const regexFilter = '^.*' + title + '.*$';

    return {
      tracks: await Track.aggregate([
        { $match: {title: {$regex: regexFilter, $options: 'i'}} },
        {
          $addFields: {
            'likesQuantity': {
              $size: '$usersWhoLiked'
            },
          }
        },
        { $skip: this.startPos },
        { $limit: this.limit }
      ]),
      total: await Track.find({title: {$regex: regexFilter}}).count()
    }
  }

  tracksByTitles = async titles => {
    return Track.find({ title: { $in: titles }});
  }

  getFavorites = async userId => {
    return {
      tracks: await Track.aggregate([
        {
          $addFields: {
            'likesQuantity': {
              $size: '$usersWhoLiked'
            },
            'user': '$usersWhoLiked'
          }
        },
        { $unwind: { path: '$user' } },
        {
          $match: { $expr: { $eq: ['$user', { $toObjectId: userId }] } }
        },
        { $skip: this.startPos },
        { $limit: this.limit }
      ]),
      total: await Track.find({usersWhoLiked: userId}).count()
    };
  }

  categories = async () => {
    return Track.distinct('category');
  }

  createTrack = async ({fields, userName}) => {
    const newTrack = new Track({
      ...fields,
      listensQuantity: 0,
      likesQuantity: 0,
      uploadedBy: userName,
      createdAt: new Date().toISOString(),
    });

    return newTrack.save();
  }

  updateTrackById = async ({trackId, newValues}) => {
    return Track.updateOne({_id: trackId}, { $set: newValues });
  }

  deleteTrackById = async (trackId) => {
    return Track.deleteOne({_id: trackId});
  }

  addLike = async (trackId, userId) => {
    return Track.updateOne(
      {_id: trackId},
      {$push: {usersWhoLiked: userId}
      });
  }

  addListen = async trackId => {
    return Track.updateOne(
      {_id: trackId},
      {$inc: {listensQuantity: 1}}
    );
  }
}

module.exports = TrackService;