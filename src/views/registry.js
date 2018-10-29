import React, {Fragment} from 'react';
import Search from './registry/search';
import {FlexDiv} from '../components/styledComponents';
import {observer} from 'mobx-react';
import Results from './registry/results';
import {NonIdealState} from '@blueprintjs/core';
import Details from './registry/details';

const Registry = observer(({realEstateStore, authstore}) => {
  const handleSearch = (searchObject, myProperty = false) => {
    realEstateStore.fetchEstates(searchObject, myProperty, authstore);
  };

  return (
    <Fragment>
      <FlexDiv
        width="100%"
        height={realEstateStore.state === 'loaded' ? 'auto' : '100%'}
        alignItems={realEstateStore.state === 'loaded' ? 'flex-start' : 'center'}>
        <Search handleSearch={handleSearch} store={realEstateStore} authstore={authstore} />
      </FlexDiv>
      <div style={{display: 'flex'}}>
        {realEstateStore.dataAvailable && <Results store={realEstateStore} />}
        {realEstateStore.detailsAvailable && <Details store={realEstateStore} />}
        {realEstateStore.noResults && (
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
