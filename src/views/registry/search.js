import React from 'react';
import {Button, FormGroup} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import {FlexItem} from '../../components/styledComponents';
import AutoComplete from '../../components/AutoComplete';
import {realEstateStore} from '../../stores/realEstate';
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
      <div className="search-box">
        <FlexItem>
          <FormGroup>
            <AutoComplete store={realEstateStore} />
          </FormGroup>
        </FlexItem>
        <FlexItem>
          <Button
            active
            fill
            intent="primary"
            large
            style={{marginBottom: 15}}
            onClick={handleClick}>
            Find real estates
          </Button>
        </FlexItem>
      </div>
    </div>
  );
};

export default observer(Search);
