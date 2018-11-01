import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Icon, Overlay, Classes} from '@blueprintjs/core';

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
    this.setState({displayMenu: true}, () => {
      document.addEventListener('click', this.hideDropdownMenu);
    });
  }

  hideDropdownMenu() {
    this.setState({displayMenu: false}, () => {
      document.removeEventListener('click', this.hideDropdownMenu);
    });
  }

  handleClick(user) {
    this.props.authstore.userAuth = user;
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
            <span style={{display: 'flex', alignItems: 'center'}}>
              {authstore.userName} <Icon icon="user" style={{marginLeft: 10}} iconSize={30} />
            </span>
          ) : (
            <span>
              {authstore.userAuth.givenName.substring(0, 1)}
              {authstore.userAuth.familyName.substring(0, 1)}
            </span>
          )}
        </button>

        <Overlay isOpen={this.state.displayMenu} className={Classes.OVERLAY_SCROLL_CONTAINER}>
          <div className="overlay-content">
            <span className="overlay-close">
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
              <li className="list-item" onClick={() => window.location.reload()}>
                <span style={{margin: '0 4px'}}>LOG OUT</span> <Icon icon="log-out" iconSize={11} />
              </li>
            </ul>
          </div>
        </Overlay>
      </div>
    );
  }
}

export default observer(UserAuthDetails);
