import "./list.scss";

import DataTable from "../../components/datatable/DataTable.jsx";

import MiniDrawer from "../../components/sidebar/sidebar2coll2";

const AssetList = () => {
  return (
    <div className="list">
      <MiniDrawer />
      <div className="listContainer">
        <DataTable></DataTable>
        {/* <Table></Table> */}
      </div>
    </div>
  );
};

export default AssetList;
