import React from 'react';
import Search from './registry/search';
import {FlexDiv} from '../components/styledComponents';
import {observer} from 'mobx-react';
import {Route} from 'react-router-dom';

const Registry = observer(({store, history, location}) => {
  const handleSearch = searchObject => {
    store.fetchEstates(searchObject);
  };

  return (
    <FlexDiv
      width="100%"
      height={store.estateCount > 0 ? 'auto' : '100%'}
      alignItems={store.estateCount > 0 ? 'flex-start' : 'center'}>
      <Route
        to={location.pathname}
        render={props => <Search handleSearch={handleSearch} store={store} {...props} />}
      />
    </FlexDiv>
  );
});

export default Registry;
