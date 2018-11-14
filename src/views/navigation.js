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
    promptLogin: false,
  };

  render() {
    const {history, authstore, store, location} = this.props;
    const isDesktop = window.innerWidth > 1370;
    const isHomePage = location.pathname === '/search';
    const isSearch = location.pathname === '/results';
    const isProperties = location.pathname === '/properties';
    const isTransactions = location.pathname === '/transactions';
    const isHelp = location.pathname === '/help';
    const activeTransactions = authstore.pendingTransactions.length > 0;

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
              <UserAuthDetails
                authstore={authstore}
                loginOpen={this.state.promptLogin}
                onLogin={this.hideLogin}
                className="nav-button"
                store={store}
              />
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
                          {authstore.pendingTransactions.length}
                        </div>
                      )}
                    </div>
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
                  style={{borderColor: isSearch ? '#008C8C' : 'white'}}>
                  Find a property
                </Link>
                <button
                  className="properties-button"
                  style={{borderColor: isProperties ? '#008C8C' : 'white'}}
                  onClick={() => {
                    store.fetchEstates(null, true, authstore);
                    history.push('/properties');
                  }}>
                  My properties
                </button>
                <Link
                  to="/transactions"
                  className="properties-button"
                  title={
                    activeTransactions
                      ? `${authstore.pendingTransactions.length} pending transactions`
                      : 'No pending transactions'
                  }
                  style={{
                    borderColor: isTransactions ? '#008C8C' : 'white',
                  }}>
                  My transactions
                  {activeTransactions && (
                    <div className="transaction-notification">
                      {authstore.pendingTransactions.length}
                    </div>
                  )}
                </Link>

                <Link
                  to="/help"
                  className="properties-button"
                  style={{
                    borderColor: isHelp ? '#008C8C' : 'white',
                  }}>
                  Help
                </Link>
              </div>
              <UserAuthDetails
                authstore={authstore}
                className="nav-button"
                loginOpen={this.state.promptLogin}
                onLogin={this.hideLogin}
                store={store}
              />
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
                onClick={this.showLogin}>
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
    this.props.store.detailsVisible = false;
    this.setState({menuOpen: true}, () => {
      document.addEventListener('click', this.hideOverlay);
    });
  };

  showLogin = () => {
    this.props.authstore.loading = true;
    this.props.store.detailsVisible = false;
    setTimeout(() => {
      this.setState({promptLogin: true});
      this.props.authstore.loading = false;
    }, 500);
  };

  hideLogin = () => {
    this.setState({promptLogin: false});
  };
}

export default withRouter(observer(Navigation));
