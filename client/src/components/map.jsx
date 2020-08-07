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
    fetch("http://127.0.0.1:5000/getboundary")
      .then((res) => res.json())
      .then((result) => {
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
          this.map.addSource("boundary", {
            type: "geojson",
            data: result["geojson"],
          });
          this.map.addLayer({
            id: "boundary",
            type: "line",
            source: "boundary",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#BF93E4",
              "line-width": 5,
            },
          });
          this.map.addLayer({
            id: "area",
            type: "fill",
            source: "area",
            layout: {},
            paint: {
              "fill-color": "#7889fa",
              "fill-opacity": 0.5,
              "fill-outline-color": "#000",
            },
          });

          // Sets map zoom to the bounds of Vaughan
          const boundaryCoords =
            result["geojson"].features[0].geometry.coordinates;
          const bounds = boundaryCoords.reduce(function (bounds, coord) {
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(boundaryCoords[0], boundaryCoords[0]));
          this.map.fitBounds(bounds, { padding: 20 });
        });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    // If the active neighbourhood changed, pan to the new one
    if (prevProps.activeIndex !== this.props.activeIndex) {
      // Sets map zoom to the bounds of the chosen neighbourhood
      const boundaryCoords = this.props.geojson.features[this.props.activeIndex]
        .geometry.coordinates[0];
      const bounds = boundaryCoords.reduce(function (bounds, coord) {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(boundaryCoords[0], boundaryCoords[0]));
      this.map.fitBounds(bounds);
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
