export default {
  tracks: {
    _id: '',
    title: '',
    audioUrl: '',
    author: '',
    category: '',
    description: '',
    listensQuantity: '',
    likesQuantity: '',
    uploadedBy: '',
    createdAt: '',
    updatedAt: '',
  },

  users: {
    _id: '',
    email: '',
    userName: '',
    role: '',
  },

  playlists: {
    _id: '',
    title: '',
    user: '{ userName }',
    tracks: '{ title }'
  },

  comments: {
    _id: '',
    content: '',
    track: '{ title }',
    user: '{ userName }',
    title: ''
  }
}