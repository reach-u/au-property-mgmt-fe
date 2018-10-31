import {decorate, observable} from 'mobx';
import api from '../config/API';


class UserAuthStore {

  userAuth = null;
  users = [];

  _getRndInteger (min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

  initAndLoginUsers() {
    fetch(api.getAllPersons()).then(response => response.text())
      .then(data => {
        let persons = JSON.parse(data);
        if (!persons.error) {
          let selectedUser;
          for (let item of persons) {
            if (!!item.givenName && item.givenName.toLowerCase().indexOf("sulev") > -1) {
              selectedUser = item;
              break;
            }
          }
          if (!selectedUser && persons.length > 0) {
            selectedUser = persons[this._getRndInteger(0, persons.length-1)];
          }
          this.users = persons.filter(user => !!user.givenName);
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
