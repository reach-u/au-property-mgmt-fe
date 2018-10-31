import React, {Component, Fragment} from 'react';
import Registry from './views/registry';
import {realEstateStore} from './stores/realEstate';
import YloMap from './views/ylomap';
import {Switch, Route, Redirect} from 'react-router-dom';
import FullDetails from './views/fullDetails';
import './index.css';
import NotFoundPage from './views/404';
import {userAuthStore} from './stores/userAuth';
import {transactionStore} from './stores/transaction';
import OwnerChange from './views/ownerChange';
import Navigation from './views/navigation';
import Search from './views/registry/search';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Navigation userStore={userAuthStore} estateStore={realEstateStore} />
        <div className="body-container">
          <Switch>
            <Redirect exact from="/" to="/search" />
            <Route
              path="/search"
              render={props => (
                <Search {...props} store={realEstateStore} authstore={userAuthStore} />
              )}
            />
            <Route
              path="/results"
              render={props => (
                <Registry realEstateStore={realEstateStore} authstore={userAuthStore} {...props} />
              )}
            />
            <Route path="/testmap" render={() => <YloMap />} />
            <Route
              path="/owner-change/:id"
              render={props => (
                <OwnerChange
                  store={realEstateStore}
                  transactionStore={transactionStore}
                  userStore={userAuthStore}
                  {...props}
                />
              )}
            />
            <Route
              path="/details/:id"
              render={props => (
                <FullDetails
                  estateStore={realEstateStore}
                  transactionStore={transactionStore}
                  {...props}
                />
              )}
            />
            <Route path="/:id" component={NotFoundPage} />
          </Switch>
        </div>
      </Fragment>
    );
  }
}

export default App;
