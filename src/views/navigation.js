import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router';
import './navigation.scss';
import logo from '../assets/landregistry_logo.png';
import {Spinner, Icon} from '@blueprintjs/core';
import UserAuthDetails from '../components/UserAuthDetails';
import {observer} from 'mobx-react';

class Navigation extends Component {
  render() {
    return (
      <Fragment>
        <div className="top-bar">
          <div
            className="logo-container"
            title="Back to search"
            onClick={() => this.props.history.push('/search')}>
            <img src={logo} className="logo" alt="Logo" />
          </div>
        </div>
        {this.renderLogin()}
      </Fragment>
    );
  }

  renderLogin = () => {
    const {authstore, store, history} = this.props;
    const isDesktop = window.innerWidth > 1200;

    if (!authstore.userAuth) {
      return (
        <div className="user-container" onClick={() => authstore.initAndLoginUsers()}>
          <button className="user-action" onClick={() => authstore.initAndLoginUsers()}>
            {authstore.loading ? <Spinner size={20} intent="primary" /> : 'LOG IN'}
          </button>
          {isDesktop && <Icon icon="log-in" iconSize={24} className="logged-out-icon" />}
        </div>
      );
    } else {
      return (
        <div className="logged-in-container">
          <button
            className="properties-button"
            onClick={() => {
              store.fetchEstates(null, true, authstore);
              history.push('/results');
            }}>
            {isDesktop ? 'My properties' : <Icon icon="menu" iconSize={30} />}
          </button>
          <UserAuthDetails authstore={authstore} className="nav-button" />
        </div>
      );
    }
  };
}

export default withRouter(observer(Navigation));
