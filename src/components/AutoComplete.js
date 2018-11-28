import React, {Component} from 'react';
import ReactAutocomplete from 'react-autocomplete';
import api from '../config/API';
import {withRouter} from 'react-router';
import {Button} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import waitAtLeast from '../utils/gracefulLoader';
import '../views/registry/search.css';

class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: false,
    };
  }

  setItems(query) {
    this.setState({loading: true, items: [{id: 0, label: 'Loading...'}]});
    waitAtLeast(100, fetch(`${window.location.origin}/${api.estates(query)}`))
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

          this.setState({items: results, loading: false});
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
    this.props.store.setQuery(e.value);
    this.handleSearch(e.value);
  }

  handleChange = e => {
    this.props.store.setQuery(e.target.value);
    if (e.target.value.length > 2 && !this.state.loading) {
      this.setItems(e.target.value);
    }
  };

  handleSearch = (searchObject, myProperty = false) => {
    const {store, authstore, history} = this.props;
    store.fetchEstates(searchObject, myProperty, authstore);
    history.push(`/results?q=${searchObject}`);
  };

  handleClick = () => {
    this.handleSearch(this.getValues());
  };

  handleMenuVisibilityChange = isOpen => {
    if (isOpen) {
      document.addEventListener('keydown', this.handleKeyDown);
    } else {
      setTimeout(() => {
        document.removeEventListener('keydown', this.handleKeyDown);
      }, 100);
    }
  };

  handleKeyDown = key => {
    if (key.keyCode === 13) {
      this.handleClick();
    }
  };

  getValues = () => {
    const value = document.querySelector('.input-field').value;

    if (!value) return '';

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
          autoHighlight={false}
          items={this.state.items}
          getItemValue={item => item.label}
          renderItem={(item, highlighted) => (
            <div
              key={item.id}
              style={{
                backgroundColor: highlighted ? '#ddd' : 'transparent',
                cursor: 'pointer',
                padding: '1px 8px',
              }}>
              {item.label}
            </div>
          )}
          value={this.props.store.query}
          onChange={e => this.handleChange(e)}
          onSelect={value => this.onSelect({value})}
          onMenuVisibilityChange={this.handleMenuVisibilityChange}
          menuStyle={{
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.18)',
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

export default withRouter(observer(Autocomplete));
