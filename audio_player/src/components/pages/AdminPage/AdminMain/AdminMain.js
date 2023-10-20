import CollectionsHandler from "../CollectionsHandler/CollectionsHandler";
import TabGroup from "../../../UI/Tables/TabGroup/TabGroup";
import {useOutletContext} from "react-router-dom";

const AdminMain = props => {
  const outlet = useOutletContext();

  return (
    <div>
      <h1>Administration</h1>
      <CollectionsHandler
        collections={outlet.collections}
        currentCollectionTitle={outlet.currentCollectionTitle}
        changeHandler={outlet.changeHandler}
        createRecord={outlet.createRecord}
        editRecord={outlet.editRecord}
        deleteRecord={outlet.deleteRecord}
      />
      <TabGroup
        collection={outlet.currentCollection}
        show={outlet.showTable}
        pageNumber={outlet.pageNumber}
        pagesCount={outlet.pagesCount}
      />
    </div>
  );
}

export default AdminMain;