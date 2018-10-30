import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {FlexItem} from "./styledComponents";

class UserAuthDetails extends Component {

  state = {
    user: this.props.authstore.userAuth,
    users: this.props.authstore.users,
    showMyProperties: this.props.showMyProperties,
    displayMenu: false
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
    this.props.showMyProperties();
  }

  render() {

    return (
      <FlexItem className="dropdown" style={{background: "#0e5a8a"}}>
        <div className="bp3-button bp3-active bp3-large bp3-intent-primary" onClick={this.showDropdownMenu}>
          Logged in as { (this.props.authstore && this.props.authstore.userAuth) ?
          this.props.authstore.userAuth.givenName + " " + this.props.authstore.userAuth.familyName : ""
        }
        </div>

        {this.state.displayMenu ? (
            <ul>
              {this.props.authstore.users.map((object, i) =>
                <li key={i} onClick={() => this.handleClick(object)}>
                  <a onClick={() => this.handleClick(object)}
                     className="active" href="#">
                    {object.givenName + " " + object.familyName}
                  </a>
                </li>)}
            </ul>
          ) :
          (
            null
          )
        }

      </FlexItem>
    )
  }
}

export default observer(UserAuthDetails);