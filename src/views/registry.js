import React, {Fragment} from 'react';
import {observer} from 'mobx-react';
import Results from './registry/results';
import {NonIdealState, ProgressBar} from '@blueprintjs/core';
import './registry/registry.scss';
import Autocomplete from '../components/AutoComplete';

const Registry = observer(({realEstateStore}) => {
  return (
    <Fragment>
      <div className="registry-container">
        <Autocomplete store={realEstateStore} className="registry-search" />
        {realEstateStore.dataAvailable && <Results store={realEstateStore} />}
        {realEstateStore.noResults && (
          <NonIdealState
            icon="search"
            title="No search results"
            description="Try another address"
            className="non-ideal-search"
          />
        )}
        {realEstateStore.loading && (
          <div style={{position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 2000}}>
            <ProgressBar intent="primary" />
          </div>
        )}
      </div>
    </Fragment>
  );
});

export default Registry;
