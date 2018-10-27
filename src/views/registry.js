import React, {Fragment} from 'react';
import Search from './registry/search';
import {FlexDiv} from '../components/styledComponents';
import {observer} from 'mobx-react';
import Results from './registry/results';
import {NonIdealState} from '@blueprintjs/core';
import Details from './registry/details';

const Registry = observer(({store, authstore}) => {

  const handleSearch = (searchObject, myProperty = false) => {
    store.fetchEstates(searchObject, myProperty, authstore);
  };

  return (
    <Fragment>
      <FlexDiv
        width="100%"
        height={store.state === 'loaded' ? 'auto' : '100%'}
        alignItems={store.state === 'loaded' ? 'flex-start' : 'center'}>
        <Search handleSearch={handleSearch} store={store} authstore={authstore} />
      </FlexDiv>
      <div style={{display: 'flex'}}>
        {store.dataAvailable && <Results store={store} />}
        {store.detailsAvailable && <Details store={store} />}
        {store.noResults && (
          <NonIdealState
            icon="search"
            title="No search results"
            description="Try another address"
          />
        )}
      </div>
    </Fragment>
  );
});

export default Registry;
