import React, {Component, Fragment} from 'react';
import Registry from './views/registry';
import {realEstateStore} from './stores/realEstate';
import YloMap from './views/ylomap';
import {Switch, Route, Redirect} from 'react-router-dom';
import FullDetails from './views/fullDetails';
import './index.css';
import NotFoundPage from './views/404';
import {userAuthStore} from './stores/userAuth';
import OwnerChange from './views/ownerChange';

class App extends Component {
  constructor() {
    super();
    App.pseudoLoginWithSulevAccount();
  }

  static pseudoLoginWithSulevAccount() {
    userAuthStore.initAndLoginUsers();
  }

  render() {
    return (
      <Fragment>
        <Switch>
          <Redirect exact from="/" to="/search" />
          <Route
            path="/search"
            render={props => (
              <Registry realEstateStore={realEstateStore} authstore={userAuthStore} {...props} />
            )}
          />
          <Route path="/testmap" render={() => <YloMap />} />
          <Route path="/owner-change/:id" render={props => <OwnerChange {...props} />} />
          <Route
            path="/details/:id"
            render={props => <FullDetails estateStore={realEstateStore} {...props} />}
          />
          <Route path="/:id" component={NotFoundPage} />
        </Switch>
      </Fragment>
    );
  }
}

export default App;
