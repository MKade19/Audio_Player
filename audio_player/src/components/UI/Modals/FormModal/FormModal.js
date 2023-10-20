import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import FormUI from "../../FormUI/FormUI";
import {useEffect, useState} from "react";

const FormModal = props => {
  const [state, setState] = useState({
    controls: null,
  });

  useEffect(() => {
    setState({...state, controls: props.controls})
  }, [props.controls]);

  const handleClose = () => {
    props.closeModal();
  };

  const inputChangeHandler = (controls, formIsValid) => {
    props.changeValidity(formIsValid);
    setState({...state, controls: controls});
  }

  const submitHandler = () => {
    const payload = [];
    for (let key in state.controls) {
      payload[key] = state.controls[key];
    }

    props.submitHandler(payload);
  }

  return (
    <Modal show={props.showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormUI
          inputChangeHandler={inputChangeHandler}
          controls={state.controls}
          formIsValid={props.formIsValid}
          submitHandler={submitHandler}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FormModal;