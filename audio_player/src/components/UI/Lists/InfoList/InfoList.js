import {ListGroup} from "react-bootstrap";
import util from "../../../../util/util";

const InfoList = props => {
  const getContentForList = item => {
    return Object.keys(item).map(key => {
      if (!util.fieldsForTrackPage.includes(key))
        return null

      return (
        <ListGroup.Item key={key}>
          <b>{key}:</b> {item[key]}
        </ListGroup.Item>
      );
    })
  }

  return (
    <ListGroup variant="flush" className="mt-3" style={{wordBreak: 'break-all'}}>
      {getContentForList(props.item)}
    </ListGroup>
  )
}

export default InfoList;