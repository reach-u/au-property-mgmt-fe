import React, {Component} from 'react';
import ReactAutocomplete from 'react-autocomplete';
import api from '../config/API';
import {withRouter} from 'react-router';
import {Button} from '@blueprintjs/core';
import '../views/registry/search.css';

class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.store.query,
      items: [],
    };
  }

  setItems(query) {
    fetch(`${window.location.origin}/${api.estates(query)}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          let results = [];
          for (let i = 0; i < data.length; i++) {
            results.push({
              label: Autocomplete.getLabel(data[i]),
              id: data[i].id,
            });
          }

          results.sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0));

          this.setState({items: results});
        }
      });
  }

  static getLabel(data) {
    let result = data.country + ' ' + data.county + ' ' + data.street + ' ' + data.house;

    if (!!data.apartment) {
      result += '-' + data.apartment;
    }
    return result;
  }

  onSelect(e) {
    this.setState({value: e.value});
    this.props.store.setQuery(e.value);
    this.props.store.fetchEstates(e.value);
    this.props.history.push('/results');
  }

  handleChange(e) {
    this.props.store.setQuery(e.target.value);
    this.setState({value: e.target.value});
    this.setItems(e.target.value);
  }

  handleSearch = (searchObject, myProperty = false) => {
    const {store, authstore, history} = this.props;
    store.fetchEstates(searchObject, myProperty, authstore);
    history.push('/results');
  };

  handleClick = () => {
    this.handleSearch(this.getValues());
  };

  getValues = () => {
    const value = document.querySelector('.input-field').value;

    if (!value) return;

    return value;
  };

  render() {
    return (
      <div className={`search-box ${this.props.className || ''}`}>
        <ReactAutocomplete
          inputProps={{
            className: 'input-field bp3-input bp3-large bp3-intent-primary',
            placeholder: 'Property number or address',
          }}
          items={this.state.items}
          getItemValue={item => item.label}
          renderItem={(item, highlighted) => (
            <div key={item.id} style={{backgroundColor: highlighted ? '#eee' : 'transparent'}}>
              {item.label}
            </div>
          )}
          value={this.state.value}
          onChange={e => this.handleChange(e)}
          onSelect={value => this.onSelect({value})}
          menuStyle={{
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '0 0',
            fontSize: '95%',
            position: 'fixed',
            overflow: 'auto',
            maxHeight: '30%', // TODO: don't cheat, let it flow to the bottom
          }}
        />
        <Button
          minimal
          className="search-button"
          title="Search"
          icon="search"
          onClick={this.handleClick}
        />
      </div>
    );
  }
}

export default withRouter(Autocomplete);
