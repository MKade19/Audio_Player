import {useEffect, useState} from "react";
import {Link} from 'react-router-dom'
import {connect} from "react-redux";

import forms from '../../../util/forms'
import util from "../../../util/util";
import * as actions from '../../../store/actions'
import StandardModal from "../../UI/Modals/StandardModal/StandardModal";
import FormUI from "../../UI/FormUI/FormUI";

const AuthPage = props => {
  const [ controls, setControls ] = useState({});
  const [ formIsValid, setFormIsValid ] = useState(false);
  const [ modal, setModal] = useState({
    title: '',
    content: '',
    redirectTo: '',
    show: false
  });


  useEffect(() => {
    const controls = {...forms.signInForm};
    setControls({...controls});
  }, []);

  useEffect(() => {
    if (controls.email)
      if (props.isSignIn) {
        let signInControls = {...util.refreshControls(controls)};
        signInControls.userName = null;
        setControls({...signInControls});
      } else {
        let signUpControls = {...util.refreshControls(controls)};
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
        setControls({...signUpControls});
      }
  }, [props.isSignIn]);

  useEffect(() => {
    if (props.error) {
      setModal({
        title: 'Error', 
        content: props.error.message, 
        show: true, 
        redirectTo: ''
      });
      return;
    }

    if (props.isSignIn && props.success) {
      setModal({
        title: 'Success!', 
        content: 'You have authenticated successfully!', 
        show: true, 
        redirectTo: '/home'
      });
    }

    if (!props.isSignIn && props.success) {
      setModal({
        title: 'Success!', 
        content: 'You have registered successfully!', 
        show: true, 
        redirectTo: '/home'
      });
    }
  }, [props.error, props.success]);

  const inputChangeHandler = (controls, formIsValid) => {
    setControls(controls);
    setFormIsValid(formIsValid);
  }

  const submitHandler = async () => {
    if (props.isSignIn) {
      props.onAuth(controls.email.value, controls.password.value);
    } else {
      props.onRegister(
        controls.email.value,
        controls.password.value,
        controls.userName.value
      );
    }
  }

  const closeModal = () => {
    setModal({
      title: '', 
      content: '', 
      show: false, 
      redirectTo: ''
    });
    props.onRefresh();
  }

  return (
    <main className="d-flex flex-column align-items-center mt-3">
      <h1>{props.isSignIn ? 'Sign in' : 'Sign up'}</h1>
      <FormUI
        inputChangeHandler={inputChangeHandler}
        controls={controls}
        formIsValid={formIsValid}
        submitHandler={submitHandler}
      />
      <Link className="d-block mt-2" to={props.isSignIn ? '/signUp' : '/signIn'}>
        {props.isSignIn ? 'Sign up' : 'Back to sign in'}
      </Link>
      <StandardModal
        showModal={modal.show}
        title={modal.title}
        content={modal.content}
        closeModal={closeModal}
        redirectTo={modal.redirectTo}
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