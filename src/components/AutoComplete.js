import React, {Component} from 'react';
import ReactAutocomplete from 'react-autocomplete';
import api from "../config/API";

class Autocomplete extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      items: []
    }
  }

  setItems(query) {
    fetch(api.estates(query))
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          let results = [];
          for (let i = 0; i < data.length; i++) {
            results.push({
              label: this.getLabel(data[i]),
              id: data[i].id
            })
          }

          results.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));

          this.setState({items: results});
        }
      });
  }

  getLabel(data) {
    let result = data.country + " " + data.county + " " +
      data.street + " " + data.house;

    if (!!data.apartment) {
      result += "-" + data.apartment;
    }
    return result;
  }

  onSelect(e) {
    this.setState({value: e.value});
    this.props.store.fetchEstates(e.value);
  }

  handleChange(e) {
    this.setState({value: e.target.value});
    this.setItems(e.target.value)
  }

  render() {
    return (
      <ReactAutocomplete
        inputProps={{className: "input-field bp3-input bp3-large bp3-intent-primary", style: {width: "350px"}}}
        items={this.state.items}
        getItemValue={item => item.label}
        renderItem={(item, highlighted) =>
          <div key={item.id} style={{backgroundColor: highlighted ? '#eee' : 'transparent'}}>
            {item.label}
          </div>
        }
        value={this.state.value}
        onChange={e => this.handleChange(e)}
        onSelect={value => this.onSelect({value})}
        menuStyle={{
          borderRadius: '3px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '0 0',
          fontSize: '90%',
          position: 'fixed',
          overflow: 'auto',
          maxHeight: '30%', // TODO: don't cheat, let it flow to the bottom
        }}
      />
    )
  }
}

export default Autocomplete;