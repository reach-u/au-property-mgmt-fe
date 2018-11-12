import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Icon, Overlay, Classes} from '@blueprintjs/core';
import '../views/navigation.scss';

class UserAuthDetails extends Component {
  state = {
    user: this.props.authstore.userAuth,
    users: this.props.authstore.users,
    displayMenu: false,
  };

  constructor(props) {
    super(props);
    this.showDropdownMenu = this.showDropdownMenu.bind(this);
    this.hideDropdownMenu = this.hideDropdownMenu.bind(this);
  }

  showDropdownMenu(event) {
    event.preventDefault();
    setTimeout(() => {
      this.setState({displayMenu: true});
    }, 800);
  }

  hideDropdownMenu() {
    this.setState({displayMenu: false}, () => {
      this.props.onLogin();
    });
  }

  handleClick(user) {
    this.props.authstore.changeUser(user);
    this.props.onLogin();
  }

  render() {
    const {className, authstore} = this.props;
    const isDesktop = window.innerWidth > 1200;

    return (
      <div className={className}>
        <button
          className={isDesktop ? 'user-icon-large' : 'user-icon-small'}
          title="Switch user"
          onClick={this.showDropdownMenu}>
          {isDesktop ? (
            authstore.userAuth ? (
              <span style={{display: 'flex', alignItems: 'center'}}>
                {authstore.userName} <Icon icon="user" style={{marginLeft: 10}} iconSize={30} />
              </span>
            ) : (
              <span>LOG IN</span>
            )
          ) : authstore.userAuth ? (
            <span>
              {authstore.currentUser.givenName.substring(0, 1)}
              {authstore.currentUser.familyName.substring(0, 1)}
            </span>
          ) : (
            <Icon icon="person" iconSize={18} />
          )}
        </button>

        <Overlay
          isOpen={this.state.displayMenu || this.props.loginOpen}
          className={Classes.OVERLAY_SCROLL_CONTAINER}>
          <div className="overlay-content">
            <span className="overlay-close" onClick={this.hideDropdownMenu} title="Cancel">
              <Icon icon="cross" iconSize={25} />
            </span>
            <ul className="user-list">
              {authstore.users.map((object, i) => (
                <li
                  key={i}
                  className={
                    object.givenName + ' ' + object.familyName === authstore.userName
                      ? 'current-user list-item'
                      : 'list-item'
                  }
                  onClick={() => this.handleClick(object)}>
                  <p onClick={() => this.handleClick(object)} style={{margin: 0}}>
                    {object.givenName + ' ' + object.familyName}
                  </p>
                </li>
              ))}
              {!!authstore.userAuth && (
                <li className="list-item" onClick={() => window.location.reload()}>
                  <span style={{margin: '0 4px'}}>LOG OUT</span>{' '}
                  <Icon icon="log-out" iconSize={11} />
                </li>
              )}
            </ul>
          </div>
        </Overlay>
      </div>
    );
  }
}

export default observer(UserAuthDetails);
