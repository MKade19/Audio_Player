import {Form} from "react-bootstrap";

const Input = props => {
  let inputElement = null;
  let inputClasses = ['form-control', 'mt-2'];

  if (props.Invalid && props.shouldValidate && props.touched) {
    inputClasses.push('is-invalid');
  }

  switch (props.elementType) {
    case ('input'):
      inputElement =
        <input
          className={inputClasses.join(' ')}
          {...props.elementConfig}
          value={props.value}
          onChange={props.onChange}
        />
      break;
    case ('select'):
      inputElement =
        <select
          className={inputClasses.join(' ')}
          {...props.elementConfig}
          value={props.value}
          onChange={props.onChange}
        />
      break;
    case ('textarea'):
      inputElement =
        <textarea
          className={inputClasses.join(' ')}
          {...props.elementConfig}
          value={props.value}
          onChange={props.onChange}
        />
      break;
    case 'checkbox':
      inputElement =
        <Form.Check
            className={inputClasses.join(' ')}
            type='checkbox'
            label={props.elementConfig.label}
            value={props.value}
            onChange={props.onChange}
            id={props.elementConfig.id}
            checked={props.active}
        />
      break;
    case 'radioGroup':
      inputElement =
        <div>
          {props.elementConfig.radios.map(el => <Form.Check
            className={inputClasses.join(' ')}
            type='radio'
            value={el.value}
            label={el.label}
            id={'radio' + el.value}
            onChange={props.onChange}
            checked={el.value === props.value}
            key={'radio' + el.value}
          />)}
        </div>
      break;
    default:
      inputElement =
        <input
          className={inputClasses.join(' ')}
          {...props.elementConfig}
          value={props.value}
          onChange={props.onChange}
        />
      break;
  }

  return (
    <div className="form-group mt-4">
      {props.elementType !== 'checkbox' ?
        <label htmlFor={props.elementConfig.id}>{props.elementConfig.label}</label>
      : null}
      {inputElement}
    </div>
  );
}

export default Input;