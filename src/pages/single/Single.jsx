import { useRef, useState, useEffect } from "react";
import "./single.scss";

import React from "react";
import StartEndMap from "../../components/map/StartEndMap";
import MapsComponent from "../../components/map/Map";
import CircularProgress from "@mui/material/CircularProgress";
import MiniDrawer from "../../components/sidebar/sidebar2coll2";
import {
  Typography,
  Box,
  makeStyles,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";

import { useParams } from "react-router-dom";

import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

import axios from "axios";
import { useTheme } from "@emotion/react";

import { LiveTracking, LiveView } from "../../components/map/liveLocation";
const Single = () => {
  const API_KEY_GMAPS = process.env.NEXT_GMAPS_APP_API_KEY;

  // const { apiLoaded } = useLoadScript({
  //   googleMapsApiKey: process.env.GMAPS_APP_API_KEY,
  // });

  const { assetSerialNumber, assetName } = useParams();

  //map prt

  //calling api again after
  //TODO: call api only in one place

  const [SingleAsset, setSingleAsset] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [deviceId, setdeviceId] = useState(null);

  //API call for single asset info fetch
  useEffect(() => {
    async function getSingleAsset() {
      try {
        setLoading(true);
        const SingleAsset = await axios.get(
          `https://4n53lh55nc.execute-api.ap-south-1.amazonaws.com/prod/asset?assetSerialNumber=${assetSerialNumber}&assetName=${assetName}`
        );
        setSingleAsset(SingleAsset.data);
        setdeviceId(SingleAsset.data.deviceSerialNumber);
      } catch (error) {
        console.log("ERROR");
      }
    }
    getSingleAsset();

    setLoading(false);
  }, []);

  // console.log(deviceId);

  const latitudeStart = parseFloat(SingleAsset.startLocationLatitude, 10);
  const longitudeStart = parseFloat(SingleAsset.startLocationLongitude, 10);

  const latitudeEnd = parseFloat(SingleAsset.endLocationLatitude, 10);
  const longitudeEnd = parseFloat(SingleAsset.endLocationLongitude, 10);

  const positionStart = {
    lat: latitudeStart,
    lng: longitudeStart,
  };

  const positionEnd = {
    lat: latitudeEnd - 34,
    lng: longitudeEnd - 43,
  };

  //API call for location history info

  const [addBluePath, setaddBluePath] = useState([]);
  const [LoadingBluePath, setLoadingBluePath] = useState(false);
  const componentMounted = useRef(true); // (3) component is mounted

  useEffect(() => {
    async function getBluePath() {
      try {
        setLoadingBluePath(true);
        const BluePath = await axios.get(
          `https://ehkwpzkqme.execute-api.ap-south-1.amazonaws.com/prod/trackhistory?deviceSerialNumber=${deviceId}`
        );

        setaddBluePath(BluePath.data.path);
        //data.path is necessary
        setLoadingBluePath(false);
        // console.log(BluePath.data.path[0].Latitude);
      } catch (error) {
        console.log("ERROR 2");
      }
    }
    getBluePath();
  }, [deviceId]);

  const onLoad = (marker) => {
    // console.log("marker: ", marker);
  };

  const center = {
    lat: 27.1753738514716,
    lng: 78.04209928206996,
  };

  const mapContainerStyle = {
    width: "1000px",
    height: "400px",
  };

  const clientID = deviceId;

  return isLoading ? (
    <div className="loader">
      <Box sx={{ display: "flex" }}>
        <CircularProgress color="secondary" />
      </Box>
    </div>
  ) : (
    <div className="single">
      <MiniDrawer />
      <div className="singleContainer">
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
              <div className="details">
                <h1 className="itemTitle">{SingleAsset.assetName}</h1>
                <div className="detailItem">
                  <span className="itemKey">Asset Type:</span>
                  <span className="itemValue">{SingleAsset.assetType}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Expected Delivery :</span>
                  <span className="itemValue">
                    {SingleAsset.expectedDeliveryDateTime}
                  </span>
                  <span className="itemValue">
                    {SingleAsset.startLocationLatitude}{" "}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <h1 className="title">Start and End Location</h1>
            {/* <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" /> */}
            <StartEndMap
              positionStart={positionStart}
              positionEnd={positionEnd}
            ></StartEndMap>
          </div>
        </div>

        {/* for the time putting map here will make component when get api single  */}
        <div className="bottom">
          <div>{}</div>

          {/* //TODO: extract to component */}
          <h1 className="title">Location History</h1>
          {/* {!deviceId ? (
            <div className="loader">
              <Box sx={{ display: "flex" }}>
                Loading Map ...
                <CircularProgress color="secondary" />
              </Box>
            </div>
          ) : ( */}
          <div className="map">
            <LoadScript googleMapsApiKey="AIzaSyCqnsYyCrtslXT09ZGHvzQPu6f2biBEFR4">
              <GoogleMap
                id="marker-example"
                mapContainerStyle={mapContainerStyle}
                zoom={15}
                center={center}
              >
                {addBluePath.map((marker, i) => (
                  <Marker
                    key={i}
                    position={{
                      lat: parseFloat(marker.Latitude),
                      lng: parseFloat(marker.Longitude),
                    }}
                    icon={{
                      path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                      fillColor: "blue",
                      fillOpacity: 0.6,
                      strokeWeight: 0.5,
                      rotation: 0,
                      scale: 2,
                    }}
                    title={`Crossed On: ${marker.TimeDate}`}
                  ></Marker>
                ))}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
        {/* THIS IS :IVE TRACKIGGG */}
        <div className="bottom">
          <h1 className="title">Live Tracking</h1>
          <div className="map">
            <LiveTracking clientID={clientID}></LiveTracking>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
