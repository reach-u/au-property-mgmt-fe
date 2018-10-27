import React, {Component} from 'react';
import Registry from './views/registry';
import {realEstateStore} from './stores/realEstate';
import YloMap from './views/ylomap';
import {Switch, Route, Redirect} from 'react-router-dom';
import FullDetails from './views/fullDetails';
import './index.css';
import {fullDetailsStore} from './stores/fullDetails';

class App extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from="/" to="/search" />
        <Route path="/search" render={props => <Registry store={realEstateStore} {...props} />} />
        <Route path="/testmap" render={() => <YloMap />} />
        <Route
          path="/details/:id"
          render={props => <FullDetails store={fullDetailsStore} {...props} />}
        />
      </Switch>
    );
  }
}

export default App;
