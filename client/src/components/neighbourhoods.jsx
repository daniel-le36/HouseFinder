import React, { Component } from "react";
import { List, Header, Icon } from "semantic-ui-react";

const Neighbourhoods = ({ neighbourhoods, SetActiveCoords }) => {
  return (
    <div id="NeighbourhoodsContainer">
      <Header as="h4" icon>
        <Icon name="home" />
        Best Neighbourhoods
        <Header.Subheader>
          These are the top neighbourhoods that fit your preferences
        </Header.Subheader>
      </Header>
      <List relaxed selection>
        {neighbourhoods.map((neighbourhood, index) => (
          <List.Item
            className="areaSelect"
            onClick={() =>
              SetActiveCoords(index, neighbourhood.geometry.coordinates[0][0])
            }
          >
            <List.Content>
              <List.Header>Area {index + 1}</List.Header>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export default Neighbourhoods;
