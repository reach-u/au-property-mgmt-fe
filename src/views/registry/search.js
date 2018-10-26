import React from 'react';
import {Button, InputGroup, Classes, FormGroup} from '@blueprintjs/core';

const address = 'searchAddress';
const property = 'propertyNumber';

const Search = ({handleSearch}) => {
  const handleKeyDown = event => {
    if (event.keyCode === 13) {
      handleSearch(getValues());
    }
  };

  const handleClick = () => {
    handleSearch(getValues());
  };

  const getValues = () => {
    const values = Array.from(document.querySelectorAll('.input-field')).map(
      element => element.childNodes[0]
    );

    return values
      .map(node => node.value)
      .filter(value => value)
      .join(',');

    /* return values.reduce((object, node) => {
      object[node.id] = node.value;
      return object;
    }, {}); */
  };

  return (
    <div>
      <FormGroup label="Address" labelFor={address}>
        <InputGroup
          className={`${Classes.INTENT_PRIMARY} input-field`}
          type="text"
          large
          placeholder="Wajir Rd, Mombasa, Kenya"
          onSubmit={handleSearch}
          onKeyDown={handleKeyDown}
          id={address}
        />
      </FormGroup>
      <FormGroup label="Property number" labelFor={property}>
        <InputGroup
          className={`${Classes.INTENT_PRIMARY} input-field`}
          type="text"
          large
          placeholder="100999"
          onKeyDown={handleKeyDown}
          id={property}
        />
      </FormGroup>
      <Button active fill intent="primary" large onClick={handleClick}>
        Find real estate
      </Button>
    </div>
  );
};

export default Search;
