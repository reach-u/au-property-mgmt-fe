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
    const {history, authstore, store} = this.props;
    const isDesktop = window.innerWidth > 1200;

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
        <Motion defaultStyle={{y: -200}} style={{y: spring(authstore.userAuth ? 0 : -200)}}>
          {style => (
            <div className="logged-in-container" style={{transform: `translateY(${style.y}px)`}}>
              <button className="properties-button" onClick={this.showOverlay}>
                MENU
              </button>
              <UserAuthDetails authstore={authstore} className="nav-button" />
              <Overlay isOpen={this.state.menuOpen}>
                <div className="mobile-menu">
                  <span className="menu-close">
                    <Icon icon="cross" iconSize={25} />
                  </span>
                  <Link to={'/results'}>Find a property</Link>
                  <button
                    className="menu-link"
                    onClick={() => {
                      store.fetchEstates(null, true, authstore);
                      history.push('/results');
                    }}>
                    My properties
                  </button>
                </div>
              </Overlay>
            </div>
          )}
        </Motion>
        <Motion
          defaultStyle={{y: 0}}
          style={{y: spring(authstore.userAuth ? (isDesktop ? -300 : 300) : 0)}}>
          {style => (
            <div
              className="user-container"
              style={{transform: `translateY(${style.y}px)`}}
              onClick={() => authstore.initAndLoginUsers()}>
              <button className="user-action" onClick={() => authstore.initAndLoginUsers()}>
                LOG IN
              </button>
              {isDesktop && <Icon icon="log-in" iconSize={24} className="logged-out-icon" />}
            </div>
          )}
        </Motion>
        {authstore.loading && (
          <div style={{position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 2000}}>
            <ProgressBar intent="primary" />
          </div>
        )}

        {this.renderDesktopNav()}
      </Fragment>
    );
  }

  renderDesktopNav = () => {
    const {authstore, store, history} = this.props;
    const isDesktop = window.innerWidth > 1200;

    if (isDesktop && authstore.userAuth) {
      return (
        <div className="logged-in-container">
          <div className="logged-in-actions">
            <Link to="/results">Find a property</Link>
            <button
              className="properties-button"
              onClick={() => {
                store.fetchEstates(null, true, authstore);
                history.push('/results');
              }}>
              My properties
            </button>
          </div>
          <UserAuthDetails authstore={authstore} className="nav-button" />
        </div>
      );
    } else {
      return null;
    }
  };

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
