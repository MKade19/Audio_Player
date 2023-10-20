import {useEffect, useState} from "react";
import {Link} from 'react-router-dom'
import {connect} from "react-redux";

import forms from '../../../util/forms'
import util from "../../../util/util";
import * as actions from '../../../store/actions'
import StandardModal from "../../UI/Modals/StandardModal/StandardModal";
import FormUI from "../../UI/FormUI/FormUI";

const AuthPage = props => {
  const [ state, setState ] = useState({
    controls: {},
    formIsValid: false,
    modal: {
      title: '',
      content: '',
      redirectTo: '',
      show: false
    },
  });

  useEffect(() => {
    const controls = {...forms.signInForm};
    setState({...state, controls: {...controls}});
  }, []);

  useEffect(() => {
    if (state.controls.email)
      if (props.isSignIn) {
        let signInControls = {...util.refreshControls(state.controls)};
        signInControls.userName = null;
        setState({
          ...state,
          controls: {...signInControls},
        });
      } else {
        let signUpControls = {...util.refreshControls(state.controls)};
        signUpControls.userName = {
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
        setState({
          ...state,
          controls: {...signUpControls},
        });
      }
  }, [props.isSignIn]);

  useEffect(() => {
    if (props.error) {
      setState({...state, modal: {
        title: 'Error', content: props.error.message, show: true, redirectTo: ''
      }});
      return;
    }

    if (props.isSignIn && props.success) {
      setState({...state, modal: {
        title: 'Success!', content: 'You have authenticated successfully', show: true, redirectTo: '/home'
      }});
    }

    if (!props.isSignIn && props.success) {
      setState({...state, modal: {
        title: 'Success!', content: 'You have registered successfully!', show: true, redirectTo: '/signIn'
      }});
    }
  }, [props.error, props.success]);

  const inputChangeHandler = (controls, formIsValid) => {
    setState({...state, controls: controls, formIsValid: formIsValid});
  }

  const submitHandler = async () => {
    if (props.isSignIn) {
      props.onAuth(state.controls.email.value, state.controls.password.value);
    } else {
      props.onRegister(
        state.controls.email.value,
        state.controls.password.value,
        state.controls.userName.value
      );
    }
  }

  const closeModal = () => {
    setState({...state, modal: {title: '', content: '', show: false, redirectTo: ''}});
    props.onRefresh();
  }

  return (
    <main className="d-flex flex-column align-items-center mt-3">
      <h1>{props.isSignIn ? 'Sign in' : 'Sign up'}</h1>
      <FormUI
        inputChangeHandler={inputChangeHandler}
        controls={state.controls}
        formIsValid={state.formIsValid}
        submitHandler={submitHandler}
      />
      <Link className="d-block mt-2" to={props.isSignIn ? '/signUp' : '/signIn'}>
        {props.isSignIn ? 'Sign up' : 'Back to sign in'}
      </Link>
      <StandardModal
        showModal={state.modal.show}
        title={state.modal.title}
        content={state.modal.content}
        closeModal={closeModal}
        redirectTo={state.modal.redirectTo}
      />
    </main>
  );
}

const mapStateToProps = state => {
  return {
    success: state.auth.success,
    error: state.auth.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password) => dispatch(actions.auth(email, password)),
    onRegister: (email, password, userName) => dispatch(actions.register(email, password, userName)),
    onRefresh: () => dispatch(actions.refreshSuccess()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage);