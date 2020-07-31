import React, { Component } from "react";
import { List, Icon } from "semantic-ui-react";
class Preferences extends Component {
  state = {
    housePrefs: [
      { id: 1, factor: "Schools" },
      { id: 2, factor: "Churches" },
      { id: 3, factor: "Grocery Stores" },
    ],
  };
  ShiftItem = (id, direction) => {
    const preferences = [...this.state.housePrefs];
    const position = preferences.findIndex((i) => i.id === id);
    if (
      (position < preferences.length - 1 && direction === 1) ||
      (position > 0 && direction === -1)
    ) {
      const item = preferences[position]; // save item for later
      const newPrefs = preferences.filter((i) => i.id !== id); // remove item from array
      newPrefs.splice(position + direction, 0, item);
      this.setState({ housePrefs: newPrefs });
    }
  };

  render() {
    return (
      <div id="PreferencesContainer">
        <List>
          {this.state.housePrefs.map((pref, index) => (
            <List.Item key={pref.id} style={{ display: "flex" }}>
              <List.Content>{pref.factor}</List.Content>
              <List.Icon
                name="chevron up"
                onClick={() => this.ShiftItem(pref.id, -1)}
              />
              <List.Icon
                name="chevron down"
                onClick={() => this.ShiftItem(pref.id, 1)}
              />
            </List.Item>
          ))}
        </List>
      </div>
    );
  }
}

export default Preferences;
