import React, {Component} from 'react';
import Registry from './views/registry';
import {realEstateStore} from './stores/realEstate';
import './index.css';

class App extends Component {
  render() {
    return <Registry store={realEstateStore} />;
  }
}

export default App;
