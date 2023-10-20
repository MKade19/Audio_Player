const Playlist = require("../models/playlist");

class PlaylistService {
  constructor(startPos, limit) {
    this.startPos = startPos;
    this.limit = limit;
  }

  playlistsByUser = async userId => {
    return Playlist.aggregate([
      {
        $match: {$expr: { $eq: ['$userId', { $toObjectId: userId }] }}
      },
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
          localField: 'trackList',
          as: 'tracks'
        }
      },
      { $unwind: {path: '$user'} }
    ]);
  }

  singlePlaylistById = async playlistId => {
    return Playlist.findById(playlistId);
  }

  singlePlaylistByTitle = async playlistTitle => {
    return Playlist.findOne({title: playlistTitle});
  }

  singlePlaylistForFormById = async playlistId => {
    return (await Playlist.aggregate([
      {
        $match: {$expr: { $eq: ['$_id', { $toObjectId: playlistId }] }}
      },
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
          localField: 'trackList',
          as: 'tracks'
        }
      },
      { $unwind: {path: '$user'} }
    ]))[0];
  }

  allPlaylists = async () => {
    return {
      playlists: await Playlist.aggregate([
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
            localField: 'trackList',
            as: 'tracks'
          }
        },
        { $unwind: {path: '$user'} },
        { $skip: this.startPos },
        { $limit: this.limit }
      ]),
      total: await Playlist.find({}).count()
    };
  }

  createPlaylist = async ({ title, trackList, userId }) => {
    return await Playlist.create({
      title,
      trackList,
      userId
    });
  }

  updatePlaylist = async ({ playlistId, title, userId, trackList }) => {
    return Playlist.updateOne({_id: playlistId}, {
      $set: {
        title: title,
        userId: userId,
        trackList: trackList
      }
    })
  }

  deletePlaylist = async playlistId => {
    return Playlist.deleteOne({_id: playlistId});
  }

  playlistByTitlesAndTrack = async ({playlistTitles, trackId}) => {
    return Playlist.findOne({
      title: { $in: playlistTitles },
      trackList: trackId
    });
  }

  addTrackToPlaylists = async ({ playlistTitles, trackId }) => {
    return Playlist.updateMany(
      { title: { $in: playlistTitles } },
      { $push: { trackList: trackId } }
    );
  }

  removeTrackFromPlaylist = async ({ playlistName, trackId }) => {
    return Playlist.updateOne(
      {title: playlistName},
      {$pull: {trackList: trackId}}
    );
  }
}

module.exports = PlaylistService;