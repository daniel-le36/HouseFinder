import React, { Component } from "react";
import Map from "./map";
import Preferences from "./preferences";
import Neighbourhoods from "./neighbourhoods";
class Page extends Component {
  state = {
    neighbourhoods: [],
    activeIndex: -1,
    activeCoords: [],
    geojson: {
      type: "FeatureCollection",
      features: [],
    },
  };

  // Get the neighbourhoods from the server
  GetNeighbourhoods = (preferences) => {
    fetch(
      "https://f33qcxxglc.execute-api.us-east-1.amazonaws.com/production/getrankedhouses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferences: preferences,
        }),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        // Get the list of preferences from the server
        this.setState({ geojson: result["neighbourhoods"] });
      });
  };

  // Set the coords to focus
  SetActiveCoords = (index, coords) => {
    this.setState({ activeIndex: index, activeCoords: coords });
  };

  render() {
    return (
      <div className="App" style={{ display: "flex" }}>
        <Preferences getNeighbourhoods={this.GetNeighbourhoods} />
        <Map
          areas={this.state.neighbourhoods}
          geojson={this.state.geojson}
          activeCoords={this.state.activeCoords}
          activeIndex={this.state.activeIndex}
        />
        <Neighbourhoods
          neighbourhoods={this.state.geojson.features}
          SetActiveCoords={this.SetActiveCoords}
        />
      </div>
    );
  }
}

export default Page;
