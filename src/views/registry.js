import React, {Fragment} from 'react';
import {observer} from 'mobx-react';
import Results from './registry/results';
import {NonIdealState} from '@blueprintjs/core';
import Details from './registry/details';

const Registry = observer(({realEstateStore}) => {
  return (
    <Fragment>
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
