import React, { useDebugValue } from "react";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Typography,
  Box,
  makeStyles,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";

import { useParams } from "react-router-dom";

import {
  GoogleMap,
  InfoWindow,
  Polyline,
  useLoadScript,
  Marker,
  LoadScript,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "1000px",
  height: "400px",
};

const mapContainerRight = {
  width: "700px",
  height: "350px",
};

const center = {
  lat: 20,
  lng: 88,
};

export const LiveTracking = (props) => {
  const [isLoading, setisLoading] = useState(false);
  const [liveLoc, setliveLoc] = useState([
    {
      curLoc: {
        lat: 50,
        lng: 50,
      },
    },
  ]);
  const deviceserialNum = props.clientID;
  console.log(deviceserialNum);
  const { curLoc } = liveLoc;
  const updateState = (data) =>
    setliveLoc((liveLoc) => ({ ...liveLoc, ...data }));

  useEffect(() => {
    getLiveLocation();
  }, []);

  const getLiveLocation = async function getLiveLocation() {
    try {
      // TODO: add customize
      setisLoading(true);
      const response = await axios.get(
        `https://ehkwpzkqme.execute-api.ap-south-1.amazonaws.com/prod/trackpoint?deviceSerialNumber=50bb3998601240ab96ecaff7a0bf562a`
      );

      const LiveLocation = await response.data.path;

      updateState({
        curLoc: {
          lat: parseFloat(LiveLocation.Latitude),
          lng: parseFloat(LiveLocation.Longitude),
        },
      });
      console.log("HELLO this updates ");
      console.log(LiveLocation.Longitude);
      setisLoading(false);
    } catch (error) {
      console.log("ERROR IN Liive LOCcation");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getLiveLocation();
    }, 1000000);

    return () => clearInterval(interval);
  }, []);

  return isLoading ? (
    <div className="loader">
      <Box sx={{ display: "flex" }}>
        <CircularProgress color="secondary" />
      </Box>
    </div>
  ) : (
    <LoadScript googleMapsApiKey="AIzaSyCqnsYyCrtslXT09ZGHvzQPu6f2biBEFR4">
      <GoogleMap
        id="marker-example"
        mapContainerStyle={mapContainerStyle}
        zoom={4}
        center={center}
      >
        <Marker
          icon={{
            path: "M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
            fillColor: "#333300",
            fillOpacity: 0.6,
            rotation: 0,
            scale: 2,
          }}
          position={curLoc}
        ></Marker>
      </GoogleMap>
    </LoadScript>
  );
};
