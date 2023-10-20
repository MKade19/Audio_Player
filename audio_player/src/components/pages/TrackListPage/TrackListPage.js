import {connect} from "react-redux";
import ListGroup from 'react-bootstrap/ListGroup';
import {Link, useLocation, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import * as actions from "../../../store/actions";
import TrackService from '../../../services/track.service';
import PaginationBar from "../../UI/PaginationBar/PaginationBar";
import util from "../../../util/util";
import FormUI from "../../UI/FormUI/FormUI";


const TrackListPage = props => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [tracks, setTracks] = useState([]);
  const [pagesCount, setPagesCount] = useState(0);
  const [category, setCategory] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [controls, setControls] = useState({
    searchTitle: {
      elementType: 'input',
      elementConfig: {
        label: "Search for title",
        type: "text",
        id: "titleInput",
        placeholder: "Enter title",
      },
      value: '',
      validation: {
        required: false
      },
      touched: false,
      valid: true
    },
  })

  const fetchTracks = async () => {
    if (category.trim() === '') {
      return;
    }

    const tracksData = await TrackService.fetchTracksChunk({
      limit: util.TRACKS_LIMIT,
      pageNumber: pageNumber,
      category: category,
      userId: props.userId,
      title: controls.searchTitle.value
    });
    setTracks(tracksData.tracks);
    setPagesCount(Math.ceil(tracksData.total / util.TRACKS_LIMIT));
  }

  useEffect(() => {
    setCategory(location.pathname.slice(
      location.pathname.lastIndexOf('/') + 1)
      .replaceAll('\%20', ' '));

    if (category === 'Search') {
      setIsSearch(true);
    }

    fetchTracks();
  }, [location]);

  useEffect(() => {
    fetchTracks();
  }, [pageNumber]);

  useEffect(() => {
    if (!searchParams.get('page')) {
      setSearchParams({'page': '1'});
      return;
    }

    let newPage = parseInt(searchParams.get('page'));

    if (newPage < 1) {
      setSearchParams({'page': `${pagesCount}`});
      return;
    }

    if (!newPage || newPage > pagesCount) {
      setSearchParams({'page': '1'});
      return;
    }

    setPageNumber(newPage);
  }, [searchParams]);

  const listItems = tracks.map(i => {
    return (
      <ListGroup.Item key={i._id}>
        <Link className="fw-bold" key={i._id} to={'/track?id=' + i._id}>{i.title}</Link>
        <br/>category: {i.category}
        <br/>{i.listensQuantity} listens
      </ListGroup.Item>
    );
  });

  const inputChangeHandler = (controls) => {
    setControls(controls);
  }

  const searchRecords = async () => {
    await fetchTracks();
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <h1 className="mt-3">{category}</h1>
      {isSearch && controls ? <div>
        <FormUI
          inputChangeHandler={inputChangeHandler}
          controls={controls}
          formIsValid={true}
          submitHandler={searchRecords}
        />
      </div> : null}
      <ListGroup className="mt-3">
        {listItems}
      </ListGroup>
      <div className="mt-3">
        <PaginationBar
          pageNumber={pageNumber}
          pagesCount={pagesCount}
        />
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    tracks: {...state.tracks},
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchTracks: () => dispatch(actions.fetchTracks()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackListPage);