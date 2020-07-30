import React, { Component } from "react";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

const MapObj = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiZmVlbHNicmVhZG1hbiIsImEiOiJja2Q3ejJyeTMwNXNwMnlwbWVpMm9qMWRzIn0.9QWRsTV_8GVh1-i63Nu3Qg",
});
class Map extends Component {
  render() {
    return (
      <div>
        <MapObj
          style="mapbox://styles/mapbox/streets-v9"
          containerStyle={{
            height: "100vh",
            width: "100vw",
          }}
        >
          <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}
          >
            <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
          </Layer>
        </MapObj>
        ;
      </div>
    );
  }
}

export default Map;
