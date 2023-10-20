import NavBarLogo from "./NavBarLogo/NavBarLogo";
import NavLinkContainer from "./NavLinkContainer/NavLinkContainer";
import {Navbar, Container} from 'react-bootstrap'

const NavigationBar = props => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <NavBarLogo/>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <NavLinkContainer logoutHandler={props.logoutHandler}/>
      </Container>
    </Navbar>
  )
}

export default NavigationBar;