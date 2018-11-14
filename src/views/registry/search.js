import React from 'react';
import {observer} from 'mobx-react';
import AutoComplete from '../../components/AutoComplete';
import {realEstateStore} from '../../stores/realEstate';
import background from '../../assets/taust_02.jpeg';
import './search.css';

const Search = ({store, authstore}) => {
  return (
    <div className="search-container">
      <img className="background" alt="" src={background} />
      <div className="search-box">
        <h1 className="search-header">Find a property</h1>
        <AutoComplete store={realEstateStore} authstore={authstore} />
      </div>
    </div>
  );
};

export default observer(Search);
