import React, {Fragment} from 'react';
import Search from './registry/search';
import {FlexDiv} from '../components/styledComponents';
import {observer} from 'mobx-react';
import Results from './registry/results';
import {NonIdealState} from '@blueprintjs/core';

const Registry = observer(({store}) => {
  const handleSearch = searchObject => {
    store.fetchEstates(searchObject);
  };

  return (
    <Fragment>
      <FlexDiv
        width="100%"
        height={store.state === 'loaded' ? 'auto' : '100%'}
        alignItems={store.state === 'loaded' ? 'flex-start' : 'center'}>
        <Search handleSearch={handleSearch} store={store} />
      </FlexDiv>
      {store.dataAvailable && <Results store={store} />}
      {store.noResults && (
        <NonIdealState icon="search" title="No search results" description="Try another address" />
      )}
    </Fragment>
  );
});

export default Registry;
