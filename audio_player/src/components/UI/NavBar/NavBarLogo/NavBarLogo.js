import {Navbar, Nav} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'


const NavBarLogo = props => {
  return (
    <LinkContainer to={'/home'}>
      <Navbar.Brand>AudioPlayer</Navbar.Brand>
    </LinkContainer>
  );
}

export default NavBarLogo;