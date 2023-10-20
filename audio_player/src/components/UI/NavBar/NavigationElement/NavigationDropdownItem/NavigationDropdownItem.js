import {NavDropdown} from 'react-bootstrap';
import {LinkContainer} from "react-router-bootstrap";


const NavigationDropdownItem = props => {
  let item = null;

  switch (props.type) {
    case 'ref':
      item =
        <LinkContainer to={props.parentHref + props.href}>
          <NavDropdown.Item>{props.title}</NavDropdown.Item>
        </LinkContainer>
      break;
    case 'hr':
      item =
        <NavDropdown.Divider/>
      break;
  }

  return item;
}

export default NavigationDropdownItem;