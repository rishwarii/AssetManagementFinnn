import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import AssetList from "./pages/list/AssetList";
import Single from "./pages/single/Single";

import New from "./pages/new/New";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="assetList">
              <Route index element={<AssetList />} />
              <Route
                path=":assetSerialNumber/:assetName"
                element={<Single />}
              />
              {/* this is where we route for page */}
              <Route path="new" element={<New title="Add New User" />} />
            </Route>
            <Route path="products">
              <Route index element={<AssetList />} />
              <Route path=":productId" element={<Single />} />
              <Route path="new" element={<New title="Add New Product" />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
