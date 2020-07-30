import React, { Component } from "react";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

const MapObj = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiZmVlbHNicmVhZG1hbiIsImEiOiJja2Q3ejJyeTMwNXNwMnlwbWVpMm9qMWRzIn0.9QWRsTV_8GVh1-i63Nu3Qg",
});
class Map extends Component {
  render() {
    return (
      <div id="MapboxContainer">
        <MapObj
          style="mapbox://styles/mapbox/streets-v9"
          containerStyle={{ height: "95vh", width: "50vw", marginRight: "0" }}
          center={[-79.5618, 43.8425]}
        >
          <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}
          >
            <Feature coordinates={[-79.5618, 43.8425]} />
          </Layer>
        </MapObj>
      </div>
    );
  }
}

export default Map;
