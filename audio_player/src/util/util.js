import axiosForFile from "axios";

export default {
  TRACKS_LIMIT: 5,

  checkValidity: (value, rules) => {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    return isValid;
  },

  refreshControls: (controls) => {
    let updatedControls = controls;

    for (let key in controls) {
      updatedControls[key] = {...updatedControls[key], value: ''};
    }

    return updatedControls;
  },

  uploadAudioFile: async (formData) => {
    let response = await axiosForFile.post('http://localhost:5000/uploadAudio', formData);

    return response.data.filename;
  },

  fieldsForTrackPage: ['title', 'category', 'author', 'likesQuantity', 'listensQuantity', 'description']
}