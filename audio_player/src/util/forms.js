export default {
  /*
  * SIGN IN FORM
  * */
  signInForm: {
    email: {
      elementType: 'input',
      elementConfig: {
        label: "Email address",
        type: "email",
        id: "emailInput",
        placeholder: "Enter email",
      },
      value: '',
      validation: {
        required: true
      },
      touched: false,
      valid: false
    },
    password: {
      elementType: 'input',
      elementConfig: {
        label: "Password",
        type: "password",
        id: "passwordInput",
        placeholder: "Enter password",
      },
      value: '',
      validation: {
        required: true,
        minLength: 6,
        maxLength: 20
      },
      touched: false,
      valid: false
    },
  },

  /*
  * SIGN UP FORM
  * */
  signUpForm: {
    email: {
      elementType: 'input',
      elementConfig: {
        label: "Email address",
        type: "email",
        id: "emailInput",
        placeholder: "Enter email",
      },
      value: '',
      validation: {
        required: true
      },
      touched: false,
      valid: false
    },
    password: {
      elementType: 'input',
      elementConfig: {
        label: "Password",
        type: "password",
        id: "passwordInput",
        placeholder: "Enter password",
      },
      value: '',
      validation: {
        required: true,
        minLength: 6,
        maxLength: 20
      },
      touched: false,
      valid: false
    },
    userName: {
      elementType: 'input',
      elementConfig: {
        label: "Username",
        type: "text",
        id: "nameInput",
        placeholder: "Enter name",
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      touched: false,
      valid: false
    }
  },

  /*
  * USER FORM
  * */

  userForm: {
    email: {
      elementType: 'input',
      elementConfig: {
        label: "Email address",
        type: "email",
        id: "emailInput",
        placeholder: "Enter email",
      },
      value: '',
      validation: {
        required: true
      },
      touched: false,
      valid: false
    },
    password: {
      elementType: 'input',
      elementConfig: {
        label: "Password",
        type: "password",
        id: "passwordInput",
        placeholder: "Enter password",
      },
      value: '',
      validation: {
        required: true
      },
      touched: false,
      valid: false
    },
    userName: {
      elementType: 'input',
      elementConfig: {
        label: "Username",
        type: "text",
        id: "nameInput",
        placeholder: "Enter name",
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      touched: false,
      valid: false
    },
    role: {
      elementType: 'radioGroup',
      elementConfig: {
        label: "Roles",
        type: "text",
        radios: [
          {
            label: 'User',
            value: 'USER'
          },
          {
            label: 'Admin',
            value: 'ADMIN'
          },
        ],
        id: "roleInput",
      },
      value: 'USER',
      validation: {
        required: true,
      },
      touched: false,
      valid: true
    },
  },

  /*
  * TRACK FORM
  * */

  trackForm: {
    title: {
      elementType: 'input',
      elementConfig: {
        label: "Title",
        type: "text",
        id: "titleInput",
        placeholder: "Enter title",
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      touched: false,
      valid: false
    },
    audioUrl: {
      elementType: 'input',
      elementConfig: {
        label: "AudioUrl",
        type: "file",
        id: "audioInput",
        placeholder: "Enter url",
      },
      value: '',
      validation: {
        required: true,
        minLength: 5
      },
      touched: false,
      valid: false
    },
    author: {
      elementType: 'input',
      elementConfig: {
        label: "Author",
        type: "text",
        id: "authorInput",
        placeholder: "Enter author",
      },
      value: '',
      validation: {
        required: true,
      },
      touched: false,
      valid: false
    },
    category: {
      elementType: 'input',
      elementConfig: {
        label: "Category",
        type: "text",
        id: "categoryInput",
        placeholder: "Enter category",
      },
      value: '',
      validation: {
        required: true,
        minLength: 2
      },
      touched: false,
      valid: false
    },
    description: {
      elementType: 'textarea',
      elementConfig: {
        label: "Description",
        type: "text",
        id: "descriptionInput",
        placeholder: "Enter description",
      },
      value: '',
      validation: {
        required: true,
      },
      touched: false,
      valid: false
    },
  },

  /*
  * PLAYLISTS FORM
  * */

  playlistsForm: {
    title: {
      elementType: 'input',
      elementConfig: {
        label: "Title",
        type: "text",
        id: "titleInput",
        placeholder: "Enter title",
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      touched: false,
      valid: false
    },
    userName: {
      elementType: 'input',
      elementConfig: {
        label: "Username",
        type: "text",
        id: "nameInput",
        placeholder: "Enter name",
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      touched: false,
      valid: false
    },
    trackList: {
      elementType: 'textarea',
      elementConfig: {
        label: "Tracklist (Enter all per ', ')",
        type: "text",
        id: "tracklistInput",
        placeholder: "Enter tracklist",
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      touched: false,
      valid: false
    },
  },

  /*
  * ADD PLAYLIST FROM
  * */

  addPlaylistForm: {
    playlistName: {
      elementType: 'input',
      elementConfig: {
        label: "Playlist name",
        type: "text",
        id: "titleInput",
        placeholder: "Enter title",
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      touched: false,
      valid: true
    },
  },

  /*
  * COMMENT USER FORM
  * */

  commentUserForm: {
    content: {
      elementType: 'textarea',
      elementConfig: {
        label: "Comment",
        type: "text",
        id: "contentInput",
        placeholder: "Enter comment",
      },
      value: '',
      validation: {
        required: true,
      },
      touched: false,
      valid: true
    }
  },

  /*
  * CHOOSE PLAYLIST FORM
  * */

  choosePlaylistListForm: (values) => {
    if (!values) {
      return null;
    }

    if (values.length === 0) {
      return null;
    }

    const form = {}
    values.forEach(val => {
      form[val.title] = {
        elementType: 'checkbox',
        elementConfig: {
          label: val.title,
          type: "checkbox",
          id: "playlistsCheckbox" + val._id,
        },
        value: val.title,
        active: false,
        validation: {
          required: false,
        },
        touched: false,
        valid: true
      };
    });

    return form;
  },

  /*
  * COMMENT ADMIN FORM
  * */

  commentAdminForm: {
    trackTitle: {
      elementType: 'input',
      elementConfig: {
        label: "Track title",
        type: "text",
        id: "trackInput",
        placeholder: "Enter title",
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      touched: false,
      valid: false
    },
    userName: {
      elementType: 'input',
      elementConfig: {
        label: "Username",
        type: "text",
        id: "nameInput",
        placeholder: "Enter name",
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      touched: false,
      valid: false
    },
    content: {
      elementType: 'textarea',
      elementConfig: {
        label: "Content",
        type: "text",
        id: "contentInput",
        placeholder: "Enter content",
      },
      value: '',
      validation: {
        required: true,
      },
      touched: false,
      valid: true
    }
  },
}