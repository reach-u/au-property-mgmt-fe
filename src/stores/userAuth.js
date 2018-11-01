import {decorate, observable, computed, action} from 'mobx';
import api from '../config/API';

class UserAuthStore {
  userAuth = null;
  users = [];
  loading = false;

  static _getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  initAndLoginUsers() {
    this.loading = true;
    fetch(api.getAllPersons())
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          let selectedUser;
          for (let item of data) {
            if (!!item.givenName && item.givenName.toLowerCase().indexOf('sulev') > -1) {
              selectedUser = item;
              break;
            }
          }
          if (!selectedUser && data.length > 0) {
            selectedUser = data[UserAuthStore._getRndInteger(0, data.length - 1)];
          } else {
            //throw new Error('No users available');
          }
          this.users = data.filter(user => !!user.givenName);
          this.userAuth = selectedUser;
          this.loading = false;
        }
      });
  }

  get currentUser() {
    return this.userAuth || {};
  }

  get userName() {
    return this.userAuth ? `${this.userAuth.givenName} ${this.userAuth.familyName}` : 'John Doe';
  }
}

decorate(UserAuthStore, {
  loading: observable,
  userAuth: observable,
  users: observable,
  initAndLoginUsers: action,
  currentUser: computed,
  userName: computed,
});

export const userAuthStore = new UserAuthStore();
