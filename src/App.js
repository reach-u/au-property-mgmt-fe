import React, {Component, Fragment, lazy, Suspense} from 'react';
import {realEstateStore} from './stores/realEstate';
import {Switch, Route, Redirect} from 'react-router-dom';
import {withRouter} from 'react-router';
import './index.css';
import './views/navigation.scss';
import {userAuthStore} from './stores/userAuth';
import {transactionStore} from './stores/transaction';
import {Motion, spring} from 'react-motion';
import {observer} from 'mobx-react';
import Navigation from './views/navigation';
import waitAtLeast from './utils/gracefulLoader';
import itlLogo from "./assets/itl_logo.svg";

const Registry = lazy(() => waitAtLeast(600, import('./views/registry')));
const NotFoundPage = lazy(() => waitAtLeast(600, import('./views/404')));
const OwnerChange = lazy(() => waitAtLeast(600, import('./views/ownerChange')));
const Search = lazy(() => waitAtLeast(600, import('./views/registry/search')));
const Details = lazy(() => waitAtLeast(600, import('./views/registry/details')));
const Transactions = lazy(() => waitAtLeast(600, import('./views/transactions')));
const UserProperties = lazy(() => waitAtLeast(600, import('./views/userProperties')));
const Help = lazy(() => waitAtLeast(600, import('./views/help')));
const Transaction = lazy(() => waitAtLeast(600, import('./views/singleTransaction')));

export const loading = (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
    }}>
    <div className="lds-ellipsis">
      <div />
      <div />
      <div />
      <div />
    </div>
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
                      <UserProperties realEstateStore={realEstateStore} authstore={userAuthStore}/>
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

          <Suspense fallback={<div />}>
            <Motion
              defaultStyle={{x: 2000}}
              style={{x: spring(realEstateStore.detailsVisible ? 0 : 2000)}}>
              {style => (
                <div
                  style={{transform: `translateX(${style.x}px)`, zIndex: 1000}}
                  className="details-animation-container">
                  {!!realEstateStore.detailsId && (
                    <Details store={realEstateStore} authstore={userAuthStore} />
                  )}
                </div>
              )}
            </Motion>
          </Suspense>

          {/*{this.props.location.pathname !== '/search' && (*/}
            <div className="footer">
              <div className="footer-block footer-logo"><img src={itlLogo} alt="ITL logo" height={15} /></div>
              <div className="footer-block">Estonian Association of Information Technology and Telecommunications</div>
              <div className="footer-block">Lõõtsa 6, 11415 Tallinn</div>
               <div className="footer-block">6177&nbsp;145</div>
               <div className="footer-block"><a href="mailto:info@itl.ee">info@itl.ee</a></div>
            </div>
          )}
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
