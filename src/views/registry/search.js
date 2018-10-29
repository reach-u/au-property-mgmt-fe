import React from 'react';
import {Button, FormGroup} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import {FlexItem} from '../../components/styledComponents';
import AutoComplete from '../../components/AutoComplete';
import UserAuthDetails from '../../components/UserAuthDetails';
import {realEstateStore} from '../../stores/realEstate';

const Search = ({handleSearch, store, authstore}) => {
  const handleClick = () => {
    handleSearch(getValues());
  };

  const getValues = () => {
    const value = document.querySelector('.input-field').value;

    if (!value) return;

    return value;
  };

  const showMyProperties = () => {
    handleSearch(null, true);
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
          '0px 1px 5px 0px rgba(0, 0, 0, 0.2),0px 2px 2px 0px rgba(0, 0, 0, 0.14),0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
        zIndex: 10,
        background: '#fff',
      },
      styles
    );
  };

  return (
    <div style={style()}>
      <FlexItem>
        <FormGroup>
          <AutoComplete store={realEstateStore} />
        </FormGroup>
      </FlexItem>
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
      <FlexItem style={{width: 'calc(100% - 1000px)'}} />
      <FlexItem className="my-properties">
        <button className="my-properties bp3-large bp3-intent-primary" onClick={showMyProperties}>
          My properties
        </button>
      </FlexItem>
      <FlexItem>{store.state === 'loaded' && <UserAuthDetails authstore={authstore} />}</FlexItem>
    </div>
  );
};

export default observer(Search);
