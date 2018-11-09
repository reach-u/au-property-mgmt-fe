import React, {Component, Fragment} from 'react';
import Registry from './views/registry';
import {realEstateStore} from './stores/realEstate';
import YloMap from './views/ylomap';
import {Switch, Route, Redirect} from 'react-router-dom';
import {withRouter} from 'react-router';
import './index.css';
import './views/navigation.scss';
import NotFoundPage from './views/404';
import {userAuthStore} from './stores/userAuth';
import {transactionStore} from './stores/transaction';
import OwnerChange from './views/ownerChange';
import Navigation from './views/navigation';
import Search from './views/registry/search';
import {Motion, spring} from 'react-motion';
import Details from './views/registry/details';
import {observer} from 'mobx-react';
import Transactions from './views/transactions';
import UserProperties from './views/userProperties';
import Help from './views/help';

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
          <Switch>
            <Redirect exact from="/" to="/search" />
            <Route
              path="/search"
              render={props => (
                <Search {...props} store={realEstateStore} authstore={userAuthStore} />
              )}
            />
            <Route path="/help" component={Help} />
            <Route
              path="/results"
              render={props => (
                <Registry realEstateStore={realEstateStore} authstore={userAuthStore} {...props} />
              )}
            />
            <Route path="/testmap" render={() => <YloMap />} />
            {isLoggedIn ? (
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
            ) : (
              <Redirect to="/search" />
            )}
            {isLoggedIn ? (
              <Route
                path="/properties"
                render={() => <UserProperties store={realEstateStore} authstore={userAuthStore} />}
              />
            ) : (
              <Redirect to="/search" />
            )}
            {isLoggedIn ? (
              <Route
                path="/transactions"
                render={props => <Transactions authstore={userAuthStore} {...props} />}
              />
            ) : (
              <Redirect to="/search" />
            )}
            <Route path="/:id" component={NotFoundPage} />
          </Switch>
          <Motion
            defaultStyle={{x: 2000}}
            style={{x: spring(realEstateStore.detailsVisible ? 0 : 2000)}}>
            {style => (
              <div
                style={{transform: `translateX(${style.x}px)`, zIndex: 1000}}
                className="details-animation-container">
                <Details store={realEstateStore} authstore={userAuthStore} />
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

  componentDidUpdate() {
    if (
      userAuthStore.userId !== this.state.userId &&
      this.props.location.pathname === '/properties'
    ) {
      this.setState({userId: userAuthStore.userId}, () => {
        realEstateStore.fetchEstates(null, true, userAuthStore);
      });
    }
  }
}

export default withRouter(observer(App));
