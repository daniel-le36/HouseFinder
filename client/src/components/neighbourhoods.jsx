import React, { Component } from "react";
import { List } from "semantic-ui-react";

const Neighbourhoods = ({ neighbourhoods, SetActiveCoords }) => {
  console.log(neighbourhoods);
  return (
    <div id="NeighbourhoodsContainer">
      <List divided relaxed>
        {neighbourhoods.map((neighbourhood, index) => (
          <List.Item>
            <List.Content
              onClick={() =>
                SetActiveCoords(index, neighbourhood.geometry.coordinates[0][0])
              }
            >
              Area {index + 1}
            </List.Content>
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export default Neighbourhoods;
