import React, { Component } from "react";
import { List, Dropdown, Button } from "semantic-ui-react";
class Preferences extends Component {
  state = {
    housePrefs: [
      { id: 1, factor: "Schools" },
      { id: 2, factor: "Churches" },
      { id: 3, factor: "Grocery Stores" },
    ],
    selectedPrefs: [],
  };

  componentDidMount() {
    fetch("http://127.0.0.1:5000/getpreferences")
      .then((res) => res.json())
      .then((result) => {
        // Get the list of preferences from the server
        this.setState({ housePrefs: result["preferences"] });
      });
  }

  // Select a preference from the dropdown and add to list
  SelectPref = (event, { value }) => {
    const preferences = [...this.state.housePrefs];
    const item = preferences.filter((i) => i.id === value)[0];
    const selectedPrefs = [...this.state.selectedPrefs];
    selectedPrefs.push(item);
    this.setState({ selectedPrefs: selectedPrefs });
  };

  // Shift a preference to higher or lower priority
  ShiftItem = (id, direction) => {
    const preferences = [...this.state.selectedPrefs];
    const position = preferences.findIndex((i) => i.id === id);
    if (
      (position < preferences.length - 1 && direction === 1) ||
      (position > 0 && direction === -1)
    ) {
      const item = preferences[position]; // save item for later
      const newPrefs = preferences.filter((i) => i.id !== id); // remove item from array
      newPrefs.splice(position + direction, 0, item);
      this.setState({ selectedPrefs: newPrefs });
    }
  };

  // Remove a selected preference from the list
  RemovePref = (id) => {
    const preferences = [...this.state.selectedPrefs];
    const filtered = preferences.filter((pref) => pref.id !== id);
    this.setState({ selectedPrefs: filtered });
  };

  render() {
    return (
      <div id="PreferencesContainer">
        {/* Dropdown for adding preferences*/}
        <Dropdown
          placeholder="Select Preferences"
          fluid
          selection
          selectOnNavigation={false}
          selectOnBlur={false}
          value=""
          onChange={this.SelectPref}
          options={this.state.housePrefs
            .filter(
              (pref) =>
                !this.state.selectedPrefs.some(
                  (selPref) => pref.id === selPref.id
                )
            )
            .map((pref, index) => {
              return {
                text: pref.factor,
                value: pref.id,
                key: index,
              };
            })}
        />
        {/* List of selected preferences */}
        <List>
          {this.state.selectedPrefs.map((pref, index) => (
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
              <List.Icon
                name="cancel"
                onClick={() => this.RemovePref(pref.id)}
              />
            </List.Item>
          ))}
        </List>
        <Button
          onClick={() =>
            this.props.getNeighbourhoods(
              this.state.selectedPrefs.map((pref) => {
                return pref.factor;
              })
            )
          }
        >
          Update
        </Button>
      </div>
    );
  }
}

export default Preferences;
