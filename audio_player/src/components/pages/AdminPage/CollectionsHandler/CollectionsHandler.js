import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";

const CollectionsHandler = props => {
  const [state, setState] = useState({
    collections: [],
  });

  useEffect(() => {
    if (props.collections)
      setState({...state, collections: props.collections});
  }, [props.collections]);

  const options = state.collections.map(el => {
    return (
      <option key={el} value={el}>{el}</option>
    )
  });

  const changeHandler = (event) => {
    if (event.target.value !== '...') {
      props.changeHandler(event.target.value);
    }
  }

  return (
    <div className="d-flex flex-column align-items-center mt-3">
      <div className="mb-3">
        <label htmlFor="selectedTable">Choose the table</label>
        <select
          className="form-select mt-3"
          id="selectedTable"
          onChange={changeHandler}
          value={props.currentCollectionTitle}
        >
          <option>...</option>
          {options}
        </select>
      </div>
      <div className="mb-3">
        <Button className="btn-success mx-3" onClick={props.createRecord}>Create</Button>
        <Button className="btn-primary mx-3" onClick={props.editRecord}>Edit</Button>
        <Button className="btn-danger mx-3" onClick={props.deleteRecord}>Delete</Button>
      </div>
    </div>
  );
}

export default CollectionsHandler;