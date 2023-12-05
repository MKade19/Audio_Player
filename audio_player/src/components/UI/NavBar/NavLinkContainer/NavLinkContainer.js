import NavigationElement from "../NavigationElement/NavigationElement";
import {useEffect, useState} from "react";
import {Navbar, Nav} from "react-bootstrap";
import {connect} from "react-redux";
import TrackService from '../../../../services/track.service';

const NavLinkContainer = props => {
  const [categories, setCategories] = useState([]);
  const [navigationItems, setNavigationItems] = useState({
    openPlayer: {
      title: 'Open player',
      type: 'ref',
      href: '/player',
      adminRequired: false,
      authRequired: false,
    },
    categories: {
      title: 'Categories',
      type: 'dropdown',
      adminRequired: false,
      authRequired: false,
      href: '/categories',
      dropdownItems: [
        {
          title: 'Most popular',
          type: 'ref',
          href: '/Most popular tracks',
        },
        {
          title: 'Your favorites',
          type: 'ref',
          href: '/Your favorites',
        },
        {
          type: 'hr'
        }
      ]
    },
    playlists: {
      title: 'Your playlists',
      type: 'ref',
      user: '',
      href: '/playlists',
      adminRequired: false,
      authRequired: true,
    },
    search: {
      title: 'Search for',
      type: 'ref',
      href: '/Search',
      adminRequired: false,
      authRequired: false,
    },
    admin: {
      title: 'Admin',
      type: 'ref',
      href: '/admin/main',
      adminRequired: true,
      authRequired: true,
    },
    signIn: {
      title: 'Sign in',
      type: 'ref',
      href: '/signIn',
      adminRequired: false,
      authRequired: false,
    },
    userName: {
      title: props.userName,
      type: 'ref',
      href: '',
      disabled: true,
      adminRequired: false,
      authRequired: true,
    },
    logOut: {
      title: 'log out',
      type: 'ref',
      href: '',
      adminRequired: false,
      authRequired: true,
      click: props.logoutHandler
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await TrackService.fetchCategories();
      const newDropdown = categories.map(el => {
          return {
            title: el,
            type: 'ref',
            href: '/' + el,
          }
        });

      
      setNavigationItems({
        ...navigationItems,
        categories: {
          ...navigationItems.categories,
          dropdownItems: [
            ...navigationItems.categories.dropdownItems,
            ...newDropdown
          ]
        }
      });
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    setNavigationItems({
      ...navigationItems,
      userName: {
        ...navigationItems.userName,
        title: props.userName
      }
    });
  }, [props.userName]);

  const navItemsArray = [];
  for (let key in navigationItems) {
    if (navigationItems[key].authRequired && !props.userId) {
      continue;
    }

    if (navigationItems[key].adminRequired && props.role !== 'ADMIN') {
      continue;
    }

    if (key === 'signIn' && props.userId) {
      continue;
    }

    navItemsArray.push({
      id: key,
      config: navigationItems[key]
    });
  }

  return (
    <Navbar.Collapse>
      <Nav className="mr-auto">
        {navItemsArray.map(el => {
          return <NavigationElement
            key={el.id}
            title={el.config.title}
            type={el.config.type}
            href={el.config.href}
            disabled={el.config.disabled}
            onClick={el.config.click}
            dropdownItems={el.config.dropdownItems}
            categoriesList={el.id === 'categories' ? props.categoriesList : null}
          />
        })}
      </Nav>
    </Navbar.Collapse>
  );
}

const mapStateToProps = state => {
  return {
    userId: state.auth.userId,
    role: state.auth.role,
    userName: state.auth.userName
  };
};

export default connect(mapStateToProps)(NavLinkContainer);