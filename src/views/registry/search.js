import React from 'react';
import {Button, FormGroup, Spinner} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import AutoComplete from '../../components/AutoComplete';
import {realEstateStore} from '../../stores/realEstate';
import background from '../../assets/img_background.jpg';
import button from '../../assets/btn_login.png';
import './search.css';
import UserAuthDetails from '../../components/UserAuthDetails';

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

  const renderLogin = () => {
    if (!authstore.userAuth) {
      return (
        <button className="log-in user-action" onClick={() => authstore.initAndLoginUsers()}>
          {authstore.loading ? <Spinner size={20} intent="primary" /> : 'LOG IN'}
        </button>
      );
    } else {
      return (
        <div className="user-container">
          <button
            className="user-action"
            onClick={() => {
              store.fetchEstates(null, true, authstore);
              history.push('/results');
            }}>
            My properties
          </button>
          <UserAuthDetails authstore={authstore} className="nav-button" />
        </div>
      );
    }
  };

  return (
    <div className="search-container">
      <img className="background" alt="" src={background} />
      <div className="search-box">
        <h1 className="search-header">Find a property</h1>
        <FormGroup>
          <AutoComplete store={realEstateStore} />
        </FormGroup>
        <Button minimal className="search-button" title="Search" onClick={handleClick}>
          <img alt="Search button" height="24px" src={button} />
        </Button>
      </div>
      {renderLogin()}
    </div>
  );
};

export default observer(Search);
