import React, {Component} from 'react';
import Registry from './views/registry';
import {realEstateStore} from './stores/realEstate';
import YloMap from './views/ylomap';
import {Switch, Route, Redirect} from 'react-router-dom';
import './index.css';

class App extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from="/" to="/search" />
        <Route path="/search" render={props => <Registry store={realEstateStore} {...props} />} />
        <Route path="/testmap" render={() => <YloMap />} />
      </Switch>
    );
  }
}

export default App;
