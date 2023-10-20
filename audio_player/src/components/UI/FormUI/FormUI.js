import Input from "../Input/Input";
import util from "../../../util/util";
import {useEffect} from "react";

const FormUI = props => {
  const inputChangeHandler = (event, inputId) => {
    const updatedForm = {...props.controls};
    const updatedFormElement = {...updatedForm[inputId]};
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = util.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedForm[inputId] = updatedFormElement;

    let formIsValid = true;
    for (let key in updatedForm) {
      if (updatedForm[key])
        formIsValid = updatedForm[key].valid && formIsValid;
    }

    if (updatedFormElement.elementType === 'checkbox') {
      updatedFormElement.active = !!event.target.checked;
    }

    if (event.target.files)
      props.inputChangeHandler(updatedForm, formIsValid, event.target.files[0]);
    else
      props.inputChangeHandler(updatedForm, formIsValid);
  }

  const submitHandler = async event => {
    event.preventDefault();
    props.submitHandler();
  }

  const formInputArray = [];
  for(let key in props.controls) {
    if (props.controls[key])
      formInputArray.push({
        id: key,
        config: props.controls[key]
      });
  }

  return (
    <form onSubmit={submitHandler} className="my-3">
      {formInputArray.map(el => {
        return <Input
          key={el.id}
          elementType={el.config.elementType}
          elementConfig={el.config.elementConfig}
          value={el.config.value}
          Invalid={!el.config.valid}
          shouldValidate={el.config.validation.required}
          touched={el.config.touched}
          active={el.config.active}
          onChange={(event) => inputChangeHandler(event, el.id)}
        />
      })}
      <button
        type="submit"
        disabled={!props.formIsValid}
        className="btn btn-primary mt-4"
      >
        Submit
      </button>
    </form>
  );
}

export default FormUI;