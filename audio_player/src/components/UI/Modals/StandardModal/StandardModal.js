import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useNavigate} from "react-router-dom";

const StandardModal = props => {
  const navigate = useNavigate();

  const handleClose = () => {
    props.closeModal();

    if (props.redirectTo)
      navigate(props.redirectTo);
  };

  return (
    <Modal show={props.showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.content}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default StandardModal;