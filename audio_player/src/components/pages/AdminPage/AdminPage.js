import {useEffect, useState} from "react";
import axios from "../../../axios/axios";
import Entities from '../../../entities/entities';
import {Outlet, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import StandardModal from "../../UI/Modals/StandardModal/StandardModal";
import util from "../../../util/util";

const AdminPage = props => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [collections, setCollections] = useState(null);
  const [currentCollection, setCurrentCollection] = useState([]);
  const [currentRecordId, setCurrentRecordId] = useState('');
  const [currentCollectionTitle, setCurrentCollectionTitle] = useState('...');
  const [showTable, setShowTable] = useState(false);
  const [pagesCount, setPagesCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [mode, setMode] = useState('');
  const [modal, setModal] = useState({
    title: '',
    content: '',
    redirectTo: '',
    show: false
  });

  useEffect(() => {
    if (!searchParams.get('collectionName')) {
      setShowTable(false);
      setCurrentCollectionTitle('...');
      return;
    }

    setCurrentRecordId(location.hash.slice(1));
    setCurrentCollectionTitle(searchParams.get('collectionName'));

    if (!searchParams.get('page')) {
      searchParams.set('page', '1');
      setSearchParams(searchParams);
      return;
    }

    let newPage = parseInt(searchParams.get('page'));

    if (newPage < 1) {
      searchParams.set('page', `${pagesCount}`);
      setSearchParams(searchParams);
      return;
    }

    if (!newPage || newPage > pagesCount) {
      searchParams.set('page', '1');
      setSearchParams(searchParams);
      return;
    }

    setPageNumber(newPage);
  }, [searchParams, location.hash]);

  useEffect(() => {
    if (searchParams.get('collectionName')) {
      fetchCollectionRecords(searchParams.get('collectionName'));
    }
  }, [pageNumber]);

  useEffect(() => {
    const fetchCollections = async () => {
      const graphQlQuery = {
        query: `{
          collections {
            values
          }
        }`
      }

      const collectionsData = await axios.post('', graphQlQuery);
      let collectionTitle = '...', showTable = false;

      if (searchParams.get('collectionName')) {
        collectionTitle = searchParams.get('collectionName');
        showTable = true;
      }

      setCollections(collectionsData.data.data.collections.values.filter(col => col !== 'tokens'));
      setCurrentCollectionTitle(collectionTitle);
      setShowTable(showTable);

      if (searchParams.get('collectionName')) {
        fetchCollectionRecords(collectionTitle);
      }
    }

    fetchCollections();
    window.location.hash = '';
  }, []);

  const fetchCollectionRecords = async (name) => {
    const subfields = Object.keys(Entities[name]).map(k => k + Entities[name][k]).join(' ');

    const graphQlQuery = {
      query: `{
        ${name}Data (limit: ${util.TRACKS_LIMIT}, pageNumber: ${pageNumber}) {
          ${name} {
            ${subfields}
          }
          total
        }
      }`,
    }

    const collectionData = await axios.post('', graphQlQuery);
    setCurrentCollection(collectionData.data.data[`${name}Data`][name]);
    setCurrentCollectionTitle(name);
    setShowTable(true);
    setPagesCount(Math.ceil(collectionData.data.data[`${name}Data`].total / util.TRACKS_LIMIT));
  }

  const toggleCollection = async name => {
    await fetchCollectionRecords(name);
    searchParams.set('collectionName', name);
    setSearchParams(searchParams);
  }

  const changeHandler = async (value) => {
    await toggleCollection(value);
  }

  const showModal = (title, content, redirectTo) => {
    setModal({
      title: title,
      content: content,
      redirectTo: redirectTo,
      show: true
    });
  }

  const closeModal = () => {
    setModal({
      title: '',
      content: '',
      redirectTo: '',
      show: false
    });
  }

  const createRecord = async () => {
    if (currentCollectionTitle !== '...') {
      navigate('/admin/create?collectionName=' + currentCollectionTitle);
    } else {
      showModal('Error', 'Select collection!', null);
    }
  }

  const editRecord = async () => {
    if (currentRecordId.trim() !== '' || currentCollectionTitle !== '...') {
      navigate('/admin/edit?collectionName=' + currentCollectionTitle + '&id=' + currentRecordId);
    } else {
      showModal('Error', 'Select record or collection!', null);
    }
  }

  const deleteRecord = async () => {
    if (currentRecordId.trim() !== '') {
      let resolverName = '';
      switch (currentCollectionTitle) {
        case 'tracks':
          resolverName = 'deleteTrack';
          break;
        case 'users':
          resolverName = 'deleteUser';
          break;
        case 'playlists':
          resolverName = 'deletePlaylist';
          break;
        case 'comments':
          resolverName = 'deleteComment';
          break;
        default:
          showModal('Error', 'Invalid collection!', '');
      }

      if (!window.confirm('Are you sure!')) {
        return;
      }

      const graphQlQuery = {
        query: `mutation Delete($id: ID!) {
          ${resolverName}(id: $id) {
            _id
          }
        }`,
        variables: {id: currentRecordId}
      }

      await axios.post('', graphQlQuery);

      let newCurrentRecordId = '';
      if (currentCollection.length !== 0)
        newCurrentRecordId = currentCollection[0]._id;

      alert('Record was deleted successfully!');
      setCurrentCollection(currentCollection.filter(el => el._id !== currentRecordId));
      setCurrentRecordId(newCurrentRecordId);
    } else {
      showModal('Error', 'Select record or collection!', '');
    }
  }

  return (
    <main className="p-3 mt-2">
      <Outlet
        context={{
          collections: collections,
          currentCollectionTitle: currentCollectionTitle,
          changeHandler: changeHandler,
          createRecord: createRecord,
          editRecord: editRecord,
          deleteRecord: deleteRecord,
          showTable: showTable,
          currentCollection: currentCollection,
          mode: mode,
          pageNumber: pageNumber,
          pagesCount: pagesCount
        }}
      />
      <StandardModal
        showModal={modal.show}
        title={modal.title}
        content={modal.content}
        closeModal={closeModal}
        redirectTo={modal.redirectTo}
      />
    </main>
  );
}

export default AdminPage;