import axios from "../axios/axios";
import util from "../util/util";

class TrackService {
  fetchOneTrack = async trackId => {
    const graphQlQuery = {
      query: `{
        track(id: "${trackId}") {
          _id
          title
          audioUrl
          author
          category
          description
          listensQuantity
          likesQuantity
          uploadedBy
          usersWhoLiked
          createdAt
          updatedAt
        }
      }`
    }

    let response = {};

    try {
      response = await axios.post('', graphQlQuery);
    } catch (error) {
      alert(error.response.data.errors.map(e => e.message).join('\n'));
      return;
    }
    // console.log(response);
    return response.data.data.track;
  }

  fetchOneTrackForForm = async trackId => {
    const graphQlQuery = {
      query: `{
        track(id: "${trackId}") {
          title
          audioUrl
          author
          category
          description
        }
      }`
    }

    let response = {};

    try {
      response = await axios.post('', graphQlQuery);
    } catch (error) {
      alert(error.response.data.errors.map(e => e.message).join('\n'));
      return;
    }
    // console.log(response);
    return response.data.data.track;
  }

  fetchTracksChunk = async ({limit, pageNumber, category, userId, title}) => {
    const graphQlQuery = {
      query: `query fetchTracks(
        $limit: Int!, 
        $pageNumber: Int!, 
        $category: String!, 
        $userId: String, 
        $title: String) 
      {
        tracksDataChunk(
          limit: $limit, 
          pageNumber: $pageNumber, 
          category: $category, 
          userId: $userId, 
          title: $title)
        {
          tracks {
            _id
            title
            audioUrl
            author
            category
            description
            listensQuantity
            likesQuantity
            uploadedBy
            createdAt
            updatedAt
          }
          total
        } 
      }`,
      variables: {
        limit: limit,
        pageNumber: pageNumber,
        category: category,
        userId: userId,
        title: title
      }
    }

    let response = {};

    try {
      response = await axios.post('', graphQlQuery);
    } catch (error) {
      alert(error.response.data.errors.map(e => e.message).join('\n'));
      return;
    }

    // console.log(response);
    return { ...response.data.data.tracksDataChunk };
  }

  fetchCategories = async () => {
    const graphQlQuery = {
      query: `{
        categories
      }`
    }

    let response = {};

    try {
      response = await axios.post('', graphQlQuery);
    } catch (error) {
      alert(error.response.data.errors.map(e => e.message).join('\n'));
      return;
    }
    // console.log(response);

    return [...response.data.data.categories];
  }

  createTrack = async ({audioData, fieldValues, userId}) => {
    const audioUrl = await util.uploadAudioFile(audioData);
    const payload = {};
    for (let key in fieldValues) {
      payload[key] = fieldValues[key].value;
    }
    payload['audioUrl'] = audioUrl;
    payload['uploadedBy'] = userId;

    const graphQlQuery = {
      query: `
        mutation CreateTrack($payload: TrackInputData!) {
          createTrack(trackInput: $payload) {
            _id
            title
          }
        }
      `,
      variables: {payload: payload}
    }

    let response = {};

    try {
      response = await axios.post('', graphQlQuery);;
    } catch (error) {
      alert(error.response.data.errors.map(e => e.message).join('\n'));
      return;
    }

    return response;
  }

  updateTrack = async ({audioData, fieldValues, userId, trackId, oldUrl}) => {
    const audioUrl = await util.uploadAudioFile(audioData);
    const payload = {};
    for (let key in fieldValues) {
      payload[key] = fieldValues[key].value;
    }
    payload['audioUrl'] = audioUrl;
    payload['uploadedBy'] = userId;

    const graphQlQuery = {
      query: `
        mutation UpdateTrack($id: ID!, $payload: TrackInputData!, $oldUrl: String!) {
          updateTrack(id: $id, trackInput: $payload, oldUrl: $oldUrl) {
            _id
            title
          }
        }
      `,
      variables: {
        id: trackId,
        payload: payload,
        oldUrl: oldUrl
      }
    }

    let response = {};

    try {
      response = await axios.post('', graphQlQuery);;
    } catch (error) {
      alert(error.response.data.errors.map(e => e.message).join('\n'));
      return;
    }

    return response;
  }
}

export default new TrackService();