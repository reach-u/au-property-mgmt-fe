import {Navbar, Button, Alignment} from '@blueprintjs/core';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import UserAuthDetails from '../components/UserAuthDetails';
import {Route} from 'react-router-dom';
import {withRouter} from 'react-router';
import AutoComplete from '../components/AutoComplete';
import './navigation.css';

class Navigation extends Component {
  render() {
    return (
      <Navbar fixedToTop className="nav-container">
        <Navbar.Group>
          <Button
            large
            minimal
            intent={'primary'}
            onClick={() => this.props.history.push('/search')}
            className="nav-button">
            Home
          </Button>
        </Navbar.Group>
        <Navbar.Group className="nav-middle">
          <Route render={props => this.renderSearch(props)} />
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>{this.renderLogin()}</Navbar.Group>
      </Navbar>
    );
  }

  renderLogin() {
    const {userStore} = this.props;
    if (!userStore.userAuth) {
      return (
        <Button
          intent="primary"
          className="nav-button"
          large
          style={{marginLeft: 30}}
          onClick={() => userStore.initAndLoginUsers()}>
          Log in
        </Button>
      );
    } else {
      return <UserAuthDetails authstore={userStore} className="nav-button" />;
    }
  }

  renderSearch({location}) {
    if (location.pathname.indexOf('/search') === -1) {
      return <AutoComplete store={this.props.estateStore} />;
    }
    return null;
  }
}

export default withRouter(observer(Navigation));
