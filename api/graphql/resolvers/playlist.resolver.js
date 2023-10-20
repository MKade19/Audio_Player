const {checkAuth} = require("../../util/util");
const ApiError = require("../../errors/api.error");
const PlaylistService = require("../../services/playlist.service");
const UserService = require("../../services/user.service");
const TrackService = require("../../services/track.service");

module.exports = {
  query: {
    getPlaylistsByUser: async (root, {userId}, {req}) => {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      const user = await new UserService().singleUserById(userId);
      if (!user) {
        throw ApiError.NotFound('There is no such a user!');
      }

      const playlistService = new PlaylistService();

      return playlistService.playlistsByUser(userId);
    },

    playlist: async (root, {id}, {req}) => {
      return new PlaylistService().singlePlaylistById(id);
    },

    playlistForForm: async (root, {id}, {req}) => {
      return new PlaylistService().singlePlaylistForFormById(id);
    },

    playlistsData: async (root, {limit, pageNumber}, {req}) => {
      const playlistsData = await new PlaylistService((pageNumber - 1) * limit, limit).allPlaylists();
      return {playlists: playlistsData.playlists, total: playlistsData.total};
    }
  },
  mutation: {
    createRawPlaylist: async (root, { playlistName, userId }, {req}) => {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      const user = await new UserService().singleUserById(userId);
      if (!user) {
        throw ApiError.NotFound('There is no such a user!');
      }

      const playlistService = new PlaylistService();
      const playlist = await playlistService.singlePlaylistByTitle(playlistName);
      if (playlist) {
        throw ApiError.UnprocessableEntity('Playlist with this name already exists!');
      }

      const newPlaylist = await playlistService.createPlaylist({
        title: playlistName,
        userId: userId,
        trackList: []
      });

      return {
        _id: newPlaylist._doc._id,
        title: newPlaylist._doc.title,
        tracks: newPlaylist._doc.trackList
      };
    },

    createPlaylist: async (root, { playlistInput }, {req}) => {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      const user = await new UserService().singleUserByUserName(playlistInput.userName);
      if (!user) {
        throw ApiError.NotFound('There is no such a user!');
      }

      const playlistService = new PlaylistService();
      const playlist = await playlistService.singlePlaylistByTitle(playlistInput.title);
      if (playlist) {
        throw ApiError.UnprocessableEntity('Playlist with this name already exists!');
      }

      const tracks = playlistInput.tracks.split(', ');
      const trackIds = (await new TrackService().tracksByTitles(tracks))
        .map(track => track._id);

      const newPlaylist = await playlistService.createPlaylist({
        title: playlistInput.title,
        userId: user._id,
        trackList: trackIds
      });

      return {
        _id: newPlaylist._doc._id,
        title: newPlaylist._doc.title,
        tracks: newPlaylist._doc.trackIds
      };
    },

    updatePlaylist: async (root, { playlistId, playlistInput }, {req}) => {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      const user = await new UserService().singleUserByUserName(playlistInput.userName);
      if (!user) {
        throw ApiError.NotFound('There is no such a user!');
      }

      const playlistService = new PlaylistService();
      const existingPlaylist = await playlistService.singlePlaylistByTitle(playlistInput.title);
      if (existingPlaylist) {
        throw ApiError.UnprocessableEntity('Playlist with this name already exists!');
      }

      const playlist = await playlistService.singlePlaylistById(playlistId);
      if (!playlist) {
        throw ApiError.NotFound('There is no such a playlist!');
      }

      const tracks = playlistInput.tracks.split(', ');
      const trackIds = (await new TrackService().tracksByTitles(tracks))
        .map(track => track._id);

      await playlistService.updatePlaylist({
        title: playlistInput.title,
        userId: user._id,
        trackList: trackIds
      });

      return { _id: playlistId };
    },

    deletePlaylist: async (root, { playlistId }, {req}) => {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      const playlistService = new PlaylistService();
      await playlistService.deletePlaylist(playlistId);

      return playlistService.singlePlaylistById(playlistId);
    },

    addTrackToPlaylists: async (root, { playlistNames, trackId }, {req}) => {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      const track = await new TrackService().singleTrackById(trackId);
      if (!track) {
        throw ApiError.NotFound('There is no such a track!');
      }

      const playlistService = new PlaylistService();
      const playlist = await playlistService.playlistByTitlesAndTrack({
        playlistTitles: playlistNames,
        trackId: trackId
      });
      if (playlist) {
        throw ApiError.UnprocessableEntity('This track is already added to one or many of selected playlists!');
      }

      const result = await playlistService.addTrackToPlaylists({
        playlistTitles: playlistNames,
        trackId: trackId
      });

      return {
        ...track,
        likesQuantity: track.usersWhoLiked.length
      };
    },

    removeTrackFromPlaylist: async (root, { playlistName, trackId }, {req}) => {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      const track = await new TrackService().singleTrackById(trackId);
      if (!track) {
        throw ApiError.NotFound('There is no such a track!');
      }

      const playlistService = new PlaylistService();
      await playlistService.removeTrackFromPlaylist({
        playlistName: playlistName,
        trackId: trackId
      });

      return playlistService.singlePlaylistByTitle(playlistName);
    }
  }
}