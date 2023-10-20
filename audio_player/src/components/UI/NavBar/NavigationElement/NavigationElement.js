import NavigationDropdownItem from "./NavigationDropdownItem/NavigationDropdownItem";
import {LinkContainer} from "react-router-bootstrap";
import {NavLink, NavDropdown} from "react-bootstrap";

const NavigationElement = props => {
  let element = null;

  switch (props.type) {
    case 'ref':
      element =
        <LinkContainer to={props.href}>
          <NavLink
            className="nav-link"
            href={props.href}
            onClick={props.onClick}
            disabled={props.disabled}
          >
            {props.title}
          </NavLink>
        </LinkContainer>
      break;
    case 'dropdown':
      let items = props.dropdownItems;

      if (props.categoriesList) {
        if (props.categoriesList.length !== 0) {
          items = items.concat(props.categoriesList.map(i => {
            return {
              type: 'ref',
              href: '/' + i,
              title: i
            }
          }));
        }
      }

      element =
        <NavDropdown title={props.title}>
          {items.map(i => {
            return <NavigationDropdownItem
              key={props.dropdownItems.indexOf(i)}
              type={i.type}
              href={i.href}
              parentHref={props.href}
              title={i.title}
            />
          })}
        </NavDropdown>
      break;
  }

  return element;
}

export default NavigationElement;