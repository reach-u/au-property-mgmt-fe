import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';
import './navigation.scss';
import logo from '../assets/landregistry_logo.png';
import {Icon, Overlay, ProgressBar} from '@blueprintjs/core';
import UserAuthDetails from '../components/UserAuthDetails';
import {observer} from 'mobx-react';
import {Motion, spring} from 'react-motion';

class Navigation extends Component {
  state = {
    menuOpen: false,
  };

  render() {
    const {history, authstore, store, location} = this.props;
    const isDesktop = window.innerWidth > 1200;
    const isHomePage = location.pathname === '/search';
    const isSearch = location.pathname === '/results';
    const isProperties = location.pathname === '/properties';
    const isTransactions = location.pathname === '/transactions';
    const isHelp = location.pathname === '/help';
    const activeTransactions = authstore.userTransactions.length > 0;

    return (
      <Fragment>
        <div className="top-bar">
          <div
            className="logo-container"
            title="Back to search"
            onClick={() => history.push('/search')}>
            <img src={logo} className="logo" alt="Logo" />
          </div>
        </div>
        <Motion
          defaultStyle={{y: -200}}
          style={{y: spring(!isDesktop && (authstore.userAuth || !isHomePage) ? 0 : -200)}}>
          {style => (
            <div className="logged-in-container" style={{transform: `translateY(${style.y}px)`}}>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <button className="properties-button" onClick={this.showOverlay}>
                  MENU
                </button>
                {activeTransactions && <div className="transaction-notification-small" />}
              </div>
              <UserAuthDetails authstore={authstore} className="nav-button" />
              <Overlay isOpen={this.state.menuOpen}>
                <div className="mobile-menu">
                  <span className="menu-close">
                    <Icon icon="cross" iconSize={25} />
                  </span>
                  <Link to={'/results'}>Find a property</Link>
                  {!!authstore.userAuth && (
                    <button
                      className="menu-link"
                      onClick={() => {
                        store.fetchEstates(null, true, authstore);
                        history.push('/properties');
                      }}>
                      My properties
                    </button>
                  )}
                  {!!authstore.userAuth && (
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: 32}}>
                      <Link to="/transactions">My transactions</Link>
                      {activeTransactions && (
                        <div className="transaction-notification">
                          {authstore.userTransactions.length}
                        </div>
                      )}
                    </div>
                  )}
                  {!authstore.userAuth && (
                    <button className="menu-link" onClick={() => authstore.initAndLoginUsers()}>
                      Log in
                    </button>
                  )}
                  <Link to="/help" style={{marginTop: 32}}>
                    Help
                  </Link>
                </div>
              </Overlay>
            </div>
          )}
        </Motion>
        <Motion
          defaultStyle={{y: -200}}
          style={{y: spring(isDesktop && authstore.userAuth ? 0 : -200)}}>
          {style => (
            <div style={{transform: `translateY(${style.y}px)`}} className="logged-in-container">
              <div className="logged-in-actions">
                <Link
                  to="/results"
                  className="properties-button"
                  style={{textDecoration: isSearch ? 'underline' : 'none'}}>
                  Find a property
                </Link>
                <button
                  className="properties-button"
                  style={{textDecoration: isProperties ? 'underline' : 'none'}}
                  onClick={() => {
                    store.fetchEstates(null, true, authstore);
                    history.push('/properties');
                  }}>
                  My properties
                </button>
                <Link
                  to="/transactions"
                  className="properties-button"
                  style={{
                    textDecoration: isTransactions ? 'underline' : 'none',
                  }}>
                  My transactions
                </Link>
                {activeTransactions && (
                  <div className="transaction-notification">
                    {authstore.userTransactions.length}
                  </div>
                )}
                <Link
                  to="/help"
                  className="properties-button"
                  style={{
                    textDecoration: isHelp ? 'underline' : 'none',
                  }}>
                  Help
                </Link>
              </div>
              <UserAuthDetails authstore={authstore} className="nav-button" />
            </div>
          )}
        </Motion>
        <Motion defaultStyle={{opacity: 0}} style={{opacity: spring(authstore.userAuth ? 0 : 1)}}>
          {style => (
            <div
              className={
                isHomePage
                  ? 'login-container'
                  : isDesktop
                    ? 'login-container-top'
                    : 'login-container-hidden'
              }
              style={{
                opacity: style.opacity,
                pointerEvents: style.opacity === 0 ? 'none' : 'auto',
              }}>
              <button
                className={
                  isHomePage ? 'login-action' : isDesktop ? 'login-action-top' : 'login-action'
                }
                onClick={() => authstore.initAndLoginUsers()}>
                LOG IN
              </button>
            </div>
          )}
        </Motion>
        {authstore.loading && (
          <div style={{position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 2000}}>
            <ProgressBar intent="primary" />
          </div>
        )}
      </Fragment>
    );
  }

  hideOverlay = () => {
    this.setState({menuOpen: false}, () => {
      document.removeEventListener('click', this.hideOverlay);
    });
  };

  showOverlay = () => {
    this.setState({menuOpen: true}, () => {
      document.addEventListener('click', this.hideOverlay);
    });
  };
}

export default withRouter(observer(Navigation));
