import {decorate, observable} from 'mobx';
import api from '../config/API';


class UserAuthStore {

  userAuth = null;
  users = [];

  _getRndInteger (min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

  initAndLoginUsers() {
    console.log("r");
    fetch(api.getAllPersons()).then(response => response.json())
      .then(data => {
        if (!data.error) {
          let selectedUser;
          for (let item of data) {
            if (!!item.givenName && item.givenName.toLowerCase().indexOf("sulev") > -1) {
              selectedUser = item;
              break;
            }
          }
          if (!selectedUser && data.length > 0) {
            selectedUser = data[this._getRndInteger(0, data.length-1)];
          }
          this.users = data.filter(user => !!user.givenName);
          this.userAuth = selectedUser;
        }
      });
  }

}

decorate(UserAuthStore, {
  userAuth: observable,
  users: observable
});

export const userAuthStore = new UserAuthStore();
