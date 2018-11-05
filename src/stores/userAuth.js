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
        let persons = data;
        if (!persons.error) {
          let selectedUser;
          for (let item of persons) {
            if (!!item.givenName && item.givenName.toLowerCase().indexOf('sulev') > -1) {
              selectedUser = item;
              break;
            }
          }
          if (!selectedUser && persons.length > 0) {
            selectedUser = persons[this._getRndInteger(0, persons.length - 1)];
          }
          this.users = persons.filter(user => !!user.givenName);
          this.userAuth = selectedUser;
          this.loading = false;
        }
      });
  }

  get currentUser() {
    return (
      this.userAuth || {
        givenName: 'John',
        familyName: 'Doe',
      }
    );
  }

  get userName() {
    return this.userAuth ? `${this.userAuth.givenName} ${this.userAuth.familyName}` : 'John Doe';
  }

  get userId() {
    return this.userAuth ? parseInt(this.userAuth.code, 10) : 0;
  }
}

decorate(UserAuthStore, {
  loading: observable,
  userAuth: observable,
  users: observable,
  initAndLoginUsers: action,
  currentUser: computed,
  userName: computed,
  userId: computed,
});

export const userAuthStore = new UserAuthStore();
