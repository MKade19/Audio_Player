import {connect} from "react-redux";

const ErrorPage = props => {
  return (
    <div className="mt-3">
      <h1>Error {props.code}</h1>
      Message: {props.message}
    </div>
  )
}

export default connect()(ErrorPage);