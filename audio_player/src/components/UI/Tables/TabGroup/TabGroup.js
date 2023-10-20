import {Tab, Row, Col, ListGroup} from 'react-bootstrap';
import {useEffect, useState} from "react";
import entityTitles from "../../../../entities/entityTitles";
import PaginationBar from "../../PaginationBar/PaginationBar";

const TabGroup = props => {
  const [state, setState] = useState({
    collection: [],
    info: {
      showModal: false,
      title: '',
      redirectTo: '',
      content: ''
    },
  });

  useEffect(() => {
    if (props.collection) {
      setState({...state, collection: props.collection});
    }
  }, [props.collection]);

  const items = state.collection.map(item => {
    return (
      <ListGroup.Item action href={'#' + item._id} key={item._id}>
        {item[Object.keys(item).find(key => entityTitles.includes(key))]}
      </ListGroup.Item>
    )
  });

  const getContentForPane = item => {
    return Object.keys(item).map(key => {
      let content = item[key];
      if (key === 'tracks') {
        content = item[key].map(el => el.title).join(', ');
      }
      if (key === 'user') {
        content = item[key].userName;
      }
      if (key === 'track') {
        content = item[key].title;
      }

      return (
        <ListGroup.Item key={key}>
          <b>{key}:</b> {content}
        </ListGroup.Item>
      );
    })
  }

  const tabPanes = state.collection.map(item => {
    return (
      <Tab.Pane eventKey={'#' + item._id} key={item._id}>
        <ListGroup>
          {getContentForPane(item)}
        </ListGroup>
      </Tab.Pane>
    );
  });

  return (
    <div
      style={{display: props.show ? '' : 'none'}}
      className="mt-3"
    >
      <Tab.Container id="list-group-tabs-example">
        <Row>
          <Col lg={4} className="d-flex justify-content-center flex-column align-items-center">
            <h3>Select record</h3>
            <ListGroup style={{wordBreak: 'break-all'}}>
              {items}
            </ListGroup>
            <div className="mt-3">
              <PaginationBar
                pageNumber={props.pageNumber}
                pagesCount={props.pagesCount}
              />
            </div>
          </Col>
          <Col lg={2}/>
          <Col lg={5}>
            <h3>Record fields</h3>
            <Tab.Content>
              {tabPanes}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default TabGroup;