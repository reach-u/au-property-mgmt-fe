import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Button} from '@blueprintjs/core';

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
    return (
      <div className={this.props.className}>
        <Button large minimal style={{marginLeft: 30}} onClick={this.showDropdownMenu}>
          Logged in as {this.props.authstore.userName}
        </Button>

        {this.state.displayMenu && (
          <ul>
            {this.props.authstore.users.map((object, i) => (
              <li key={i} onClick={() => this.handleClick(object)}>
                <p onClick={() => this.handleClick(object)} style={{margin: 0}}>
                  {object.givenName + ' ' + object.familyName}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default observer(UserAuthDetails);
