import './App.css';
import NavigationBar from "./components/UI/NavBar/NavigationBar";
import PlayerPage from "./components/pages/PlayerPage/PlayerPage";
import HomePage from "./components/pages/HomePage/HomePage";
import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import AuthPage from "./components/pages/AuthPage/AuthPage";
import AdminPage from "./components/pages/AdminPage/AdminPage";
import {useEffect, useState} from "react";
import {connect} from "react-redux";
import * as actions from "./store/actions";
import StandardModal from "./components/UI/Modals/StandardModal/StandardModal";
import AdminMain from "./components/pages/AdminPage/AdminMain/AdminMain";
import EditAddPage from "./components/pages/AdminPage/EditAddPage/EditAddPage";
import TrackListPage from "./components/pages/TrackListPage/TrackListPage";
import TrackPage from "./components/pages/TrackPage/TrackPage";
import ErrorPage from "./components/pages/ErrorPage/ErrorPage";
import PlaylistsPage from "./components/pages/PlaylistsPage/PlaylistsPage";

function App(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [ logoutModal, setLogoutModal ] = useState({
    title: '',
    content: '',
    show: false,
    redirectTo: ''
  });

  useEffect(() => {
    if (props.auth.userId)
      props.onFetchPlaylists(props.auth.userId);

    if (location.pathname === '/') {
      navigate('/home');
    }
  }, []);

  const showModal = () => {
    setLogoutModal({
      title: 'Success!',
      content: 'You have logged out successfully!',
      show: true,
      redirectTo: '/home'
    })
  }

  const closeModal = () => {
    setLogoutModal({
      title: '',
      content: '',
      show: false,
      redirectTo: ''
    });
    props.onRefresh();
  }

  const logout = () => {
    showModal();
    props.onLogout();
  }

  return (
    <div className="App">
      <NavigationBar logoutHandler={logout}/>
      <Routes>
        <Route path="/home" element={ <HomePage/> }/>
        <Route path="/player" element={ <PlayerPage/> }/>
        <Route path="/signIn" element={ <AuthPage isSignIn={true}/> }/>
        <Route path="/signUp" element={ <AuthPage isSignIn={false}/> }/>
          <Route path="/admin" element={
            props.auth.role === 'ADMIN' ? <AdminPage/>
              : <Navigate to={'/errorForbidden'}/>
          }>
          <Route path="main" element={<AdminMain/>}/>
          <Route path="edit" element={<EditAddPage mode="EDIT"/>}/>
          <Route path="create" element={<EditAddPage mode="CREATE"/>}/>
        </Route>
        <Route path="/categories/:type" element={<TrackListPage/>}/>
        <Route path="/track" element={<TrackPage/>}/>
        <Route path="/playlists" element={<PlaylistsPage/>}/>
        <Route path="/Search" element={<TrackListPage searchMode={true} />}/>
        <Route path="/errorNotFound" element={<ErrorPage
          code={404}
          message={`Not found!`}
        />}/>
        <Route path="/errorUnauthorized" element={<ErrorPage
          code={401}
          message={`You have to be authorized to reach this page!`}
        />}/>
        <Route path="/errorForbidden" element={<ErrorPage
          code={403}
          message={`You don't have access to reach this page`}
        />}/>
        <Route path="*" element={<ErrorPage
          code={404}
          message={`Not found!`}
        />}/>
      </Routes>
      <StandardModal
        showModal={logoutModal.show}
        title={logoutModal.title}
        content={logoutModal.content}
        redirectTo={logoutModal.redirectTo}
        closeModal={closeModal}
      />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    tracks: {...state.tracks},
    auth: {...state.auth}
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(actions.logout()),
    onRefresh: () => dispatch(actions.refreshSuccess()),
    onFetchPlaylists: userId => dispatch(actions.fetchPlaylists(userId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
