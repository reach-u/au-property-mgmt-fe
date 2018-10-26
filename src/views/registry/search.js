import React from 'react';
import {Button, InputGroup, Classes, FormGroup} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import {FlexItem} from '../../components/styledComponents';

const address = 'searchAddress';
// const property = 'propertyNumber';

const Search = observer(({handleSearch, store}) => {
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

  const style = () => {
    const styles =
      store.state === 'loaded'
        ? {
            display: 'flex',
            width: '100%',
            borderRadius: 0,
            padding: '8px 4px 4px 4px',
          }
        : {
            display: 'block',
            width: 'auto',
            borderRadius: '5px',
            padding: 20,
          };

    return Object.assign(
      {
        alignItems: 'flex-end',
        boxShadow:
          '0px 1px 8px 0px rgba(0, 0, 0, 0.2),0px 3px 4px 0px rgba(0, 0, 0, 0.14),0px 3px 3px -2px rgba(0, 0, 0, 0.12)',
      },
      styles
    );
  };

  return (
    <div style={style()}>
      <FlexItem>
        <FormGroup label="Address" labelFor={address}>
          <InputGroup
            className={`${Classes.INTENT_PRIMARY} input-field`}
            type="text"
            large
            placeholder="Try &quot;Mombasa&quot;"
            onSubmit={handleSearch}
            onKeyDown={handleKeyDown}
            id={address}
          />
        </FormGroup>
      </FlexItem>
      {/*
      <FlexItem>
        <FormGroup label="Property number" labelFor={property}>
          <InputGroup
            className={`${Classes.INTENT_PRIMARY} input-field`}
            type="text"
            large
            placeholder="10032"
            onKeyDown={handleKeyDown}
            id={property}
          />
        </FormGroup>
      </FlexItem>
      */}
      <FlexItem>
        <Button
          active
          fill={store.estateCount === 0 && store.state !== 'loaded'}
          intent="primary"
          large
          style={{marginBottom: 15}}
          onClick={handleClick}>
          Find real estates
        </Button>
      </FlexItem>
    </div>
  );
});

export default Search;
