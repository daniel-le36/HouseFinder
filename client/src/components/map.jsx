import React, { Component } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZmVlbHNicmVhZG1hbiIsImEiOiJja2Q3ejJyeTMwNXNwMnlwbWVpMm9qMWRzIn0.9QWRsTV_8GVh1-i63Nu3Qg";

class Map extends Component {
  state = {
    lng: -79.5618,
    lat: 43.8425,
    zoom: 22,
    map: null,
    geojson: {},
  };
  componentDidMount() {
    // Initialize map
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
    });
    this.map.on("load", () => {
      this.map.addSource("area", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      this.map.addLayer({
        id: "area",
        type: "fill",
        source: "area",
        layout: {},
        paint: {
          "fill-color": "#088",
          "fill-opacity": 0.8,
        },
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // If the active neighbourhood changed, pan to the new one
    if (prevProps.activeIndex !== this.props.activeIndex) {
      this.map.setZoom(15);
      this.map.panTo(this.props.activeCoords);
    }
    // Update map data
    this.map.getSource("area").setData(this.props.geojson);
  }

  render() {
    return (
      <div id="MapboxContainer">
        <div ref={(el) => (this.mapContainer = el)} className="mapContainer" />
      </div>
    );
  }
}

export default Map;
