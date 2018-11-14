import React, {Component, Fragment, lazy, Suspense} from 'react';
import Registry from './views/registry';
import {realEstateStore} from './stores/realEstate';
import {Switch, Route, Redirect} from 'react-router-dom';
import {withRouter} from 'react-router';
import './index.css';
import './views/navigation.scss';
import {Spinner} from '@blueprintjs/core';
import {userAuthStore} from './stores/userAuth';
import {transactionStore} from './stores/transaction';
import {Motion, spring} from 'react-motion';
import {observer} from 'mobx-react';
import Navigation from './views/navigation';

const NotFoundPage = lazy(() => import('./views/404'));
const OwnerChange = lazy(() => import('./views/ownerChange'));
const Search = lazy(() => import('./views/registry/search'));
const Details = lazy(() => import('./views/registry/details'));
const Transactions = lazy(() => import('./views/transactions'));
const UserProperties = lazy(() => import('./views/userProperties'));
const Help = lazy(() => import('./views/help'));
const Transaction = lazy(() => import('./views/singleTransaction'));

export const loading = (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Spinner intent="primary" />
  </div>
);

class App extends Component {
  state = {
    userId: null,
  };

  render() {
    const isLoggedIn = !!userAuthStore.userAuth;

    return (
      <Fragment>
        <Navigation store={realEstateStore} authstore={userAuthStore} />
        <div className="body-container">
          <Suspense fallback={loading}>
            <Switch>
              <Redirect exact from="/" to="/search" />
              <Route
                path="/search"
                render={props => (
                  <Search {...props} store={realEstateStore} authstore={userAuthStore} />
                )}
              />
              <Route path="/help" render={() => <Help />} />
              <Route
                path="/results"
                render={props => (
                  <Suspense fallback={loading}>
                    <Registry
                      realEstateStore={realEstateStore}
                      authstore={userAuthStore}
                      {...props}
                    />
                  </Suspense>
                )}
              />
              {isLoggedIn ? (
                <Route
                  path="/owner-change/:id"
                  render={props => (
                    <Suspense fallback={loading}>
                      <OwnerChange
                        store={realEstateStore}
                        transactionStore={transactionStore}
                        userStore={userAuthStore}
                        {...props}
                      />
                    </Suspense>
                  )}
                />
              ) : (
                <Redirect to="/search" />
              )}
              {isLoggedIn ? (
                <Route
                  path="/properties"
                  render={() => (
                    <Suspense fallback={loading}>
                      <UserProperties store={realEstateStore} authstore={userAuthStore} />
                    </Suspense>
                  )}
                />
              ) : (
                <Redirect to="/search" />
              )}
              {isLoggedIn ? (
                <Route
                  path="/transactions"
                  render={props => (
                    <Suspense fallback={loading}>
                      <Transactions authstore={userAuthStore} store={realEstateStore} {...props} />
                    </Suspense>
                  )}
                />
              ) : (
                <Redirect to="/search" />
              )}
              {isLoggedIn ? (
                <Route
                  path="/transaction/:id"
                  render={props => (
                    <Suspense fallback={loading}>
                      <Transaction
                        store={realEstateStore}
                        transactionStore={transactionStore}
                        userStore={userAuthStore}
                        {...props}
                      />
                    </Suspense>
                  )}
                />
              ) : (
                <Redirect to="/search" />
              )}
              <Route path="/:id" render={() => <NotFoundPage />} />
            </Switch>
          </Suspense>

          <Motion
            defaultStyle={{x: 2000}}
            style={{x: spring(realEstateStore.detailsVisible ? 0 : 2000)}}>
            {style => (
              <div
                style={{transform: `translateX(${style.x}px)`, zIndex: 1000}}
                className="details-animation-container">
                <Suspense fallback={loading}>
                  {!!realEstateStore.detailsId && (
                    <Details store={realEstateStore} authstore={userAuthStore} />
                  )}
                </Suspense>
              </div>
            )}
          </Motion>
        </div>
      </Fragment>
    );
  }

  componentDidMount() {
    userAuthStore.initAndLoginUsers();
  }

  componentDidUpdate(prevProps) {
    if (
      userAuthStore.userId !== this.state.userId &&
      this.props.location.pathname === '/properties'
    ) {
      this.setState({userId: userAuthStore.userId}, () => {
        realEstateStore.fetchEstates(null, true, userAuthStore);
      });
    }
    if (this.props.location.pathname !== prevProps.location.pathname) {
      realEstateStore.closeDetailsModal();
    }
  }
}

export default withRouter(observer(App));
