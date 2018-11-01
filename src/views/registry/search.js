import React from 'react';
import {Button, FormGroup} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import AutoComplete from '../../components/AutoComplete';
import {realEstateStore} from '../../stores/realEstate';
import background from '../../assets/img_background.jpg';
import './search.css';

const Search = ({store, authstore, history}) => {
  const handleSearch = (searchObject, myProperty = false) => {
    store.fetchEstates(searchObject, myProperty, authstore);
    history.push('/results');
  };

  const handleClick = () => {
    handleSearch(getValues());
  };

  const getValues = () => {
    const value = document.querySelector('.input-field').value;

    if (!value) return;

    return value;
  };

  return (
    <div className="search-container">
      <img className="background" alt="" src={background} />
      <div className="search-box">
        <h1 className="search-header">Find a property</h1>
        <FormGroup>
          <AutoComplete store={realEstateStore} />
        </FormGroup>
        <Button
          minimal
          className="search-button"
          title="Search"
          icon="search"
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default observer(Search);
