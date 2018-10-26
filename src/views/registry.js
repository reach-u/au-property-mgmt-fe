import React from 'react';
import Search from './registry/search';
import {FlexDiv} from '../components/styledComponents';
import {observer} from 'mobx-react';

const Registry = observer(({store}) => {
  const handleSearch = searchObject => {
    store.fetchEstates(searchObject);
  };

  return (
    <FlexDiv width="100%" height="100%">
      <Search handleSearch={handleSearch} />
    </FlexDiv>
  );
});

export default Registry;
