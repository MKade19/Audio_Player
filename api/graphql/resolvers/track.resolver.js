const TrackService = require('../../services/track.service');
const User = require("../../models/user");
const ApiError = require("../../errors/api.error");
const {deleteFile, checkAuth} = require('../../util/util');

module.exports = {
  query: {
    tracksDataChunk: async function (root, {limit, pageNumber, category, userId, title}, {req}) {
      let tracksData;
      const trackService = new TrackService((pageNumber - 1) * limit, limit);

      switch (category) {
        case 'Most popular tracks':
          tracksData = await trackService.tracksSortedByListens();
          break;
        case 'Your favorites':
          tracksData = await trackService.getFavorites(userId);
          break;
        case 'Search':
          tracksData = await trackService.searchTracks(title);
          break;
        default:
          tracksData = await trackService.tracksByCategory(category);
      }

      return {total: tracksData.total, tracks: tracksData.tracks};
    },

    tracksData: async function (root, {limit, pageNumber}, {req}) {
      const trackService = new TrackService((pageNumber - 1) * limit, limit);
      const tracksData = await trackService.allTracks();

      return {tracks: tracksData.tracks, total: tracksData.total};
    },

    track: async (root, { id }, {req}) => {
      return new TrackService().singleTrackById(id);
    },

    categories: async (root, args, {req}) => {
      return new TrackService().categories();
    },
  },
  mutation: {
    createTrack: async function (root, { trackInput }, {req}) {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      if (payload.role !== 'ADMIN') {
        throw ApiError.Forbidden();
      }

      const trackService = new TrackService();
      const potentialTrack = await trackService.singleTrackByTitle(trackInput.title);
      if (potentialTrack) {
        throw ApiError.UnprocessableEntity('Track with this title already exists!');
      }

      const user = await User.findById(trackInput.uploadedBy);
      if (!user) {
        throw ApiError.UnprocessableEntity('There is no such a user');
      }

      return new TrackService().createTrack({
        fields: trackInput,
        userName: user.userName
      });
    },

    updateTrack: async function (root, { id, trackInput, oldUrl }, {req}) {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      if (payload.role !== 'ADMIN') {
        throw ApiError.Forbidden();
      }

      deleteFile(oldUrl);
      const trackService = new TrackService();

      const track = await trackService.singleTrackById(id);
      if (!track) {
        throw ApiError.NotFound('There is no such a track!');
      }

      await trackService.updateTrackById({
        trackId: id,
        newValues: trackInput
      });

      return track;
    },

    deleteTrack: async function (root, { id }, {req}) {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      if (payload.role !== 'ADMIN') {
        throw ApiError.Forbidden();
      }

      const trackService = new TrackService();

      const track = await trackService.singleTrackById(id);
      if (!track) {
        throw ApiError.NotFound('There is no such a track!');
      }

      const audioUrl = track.audioUrl;
      deleteFile(audioUrl);

      await trackService.deleteTrackById(id);

      return track;
    },

    addLike: async function (root, { id }, {req}) {
      const payload = checkAuth(req.headers.authorization);
      if (!payload) {
        throw ApiError.Unauthorized();
      }

      const trackService = new TrackService();

      const track = await trackService.singleTrackById(id);
      if (!track) {
        throw ApiError.NotFound('There is no such a track!');
      }

      if (track.usersWhoLiked.includes(payload.userId)) {
        throw ApiError.BadRequest('You have already liked this track!');
      }

      await trackService.addLike(id, payload.userId);

      return track.usersWhoLiked.length + 1;
    },

    addListen: async (root, { id }, { req }) => {
      const trackService = new TrackService();

      const track = await trackService.singleTrackById(id);
      if (!track) {
        throw ApiError.NotFound('There is no such a track!');
      }

      await trackService.addListen(id);

      return trackService.singleTrackById(id);
    }
  }
}