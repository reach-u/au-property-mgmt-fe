import React, {Fragment} from 'react';
import {observer} from 'mobx-react';
import Results from './registry/results';
import {NonIdealState} from '@blueprintjs/core';
import './registry/registry.scss';
// import Details from './registry/details';
import Autocomplete from '../components/AutoComplete';
// import {Motion, spring} from 'react-motion';

const Registry = observer(({realEstateStore, authstore}) => {
  return (
    <Fragment>
      <div className="registry-container">
        <Autocomplete store={realEstateStore} className="registry-search" />
        {realEstateStore.dataAvailable && <Results store={realEstateStore} />}
        {/*realEstateStore.detailsAvailable && <Details store={realEstateStore} />*/}
        {realEstateStore.noResults && (
          <NonIdealState
            icon="search"
            title="No search results"
            description="Try another address"
            className="non-ideal-search"
          />
        )}
      </div>
    </Fragment>
  );
});

export default Registry;
