import {decorate, observable, computed, action, reaction} from 'mobx';
import api from '../config/API';
import {sortAlphabetically} from '../utils/string';

class UserAuthStore {
  constructor() {
    reaction(() => this.userAuth, () => this.fetchUserTransactions());
  }

  userAuth = null;
  users = [];
  userTransactions = [];
  loading = false;

  static _getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  initAndLoginUsers() {
    this.loading = true;
    fetch(`${window.location.origin}/${api.getAllPersons()}`)
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
          this.users = persons.filter(user => !!user.givenName).sort(sortAlphabetically);
          this.userAuth = selectedUser;
          this.loading = false;
        }
      });
  }

  getUsernameById(id = 0) {
    const user = this.users.find(user => user.code.toString() === id.toString()) || {
      givenName: 'John',
      familyName: 'Doe',
    };
    return `${user.givenName} ${user.familyName}`;
  }

  fetchUserTransactions() {
    fetch(`${window.location.origin}/${api.getPersonsTransactions(this.userAuth.code)}`)
      .then(response => response.json())
      .then(data => (this.userTransactions = data.filter(transaction => !transaction.signedByAll)));
  }

  changeUser(user) {
    this.userAuth = null;
    this.userAuth = user;
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
  changeUser: action,
  fetchUserTransactions: action,
  getUsernameById: action,
  loading: observable,
  userAuth: observable,
  users: observable,
  initAndLoginUsers: action,
  currentUser: computed,
  userName: computed,
  userId: computed,
  userTransactions: observable,
});

export const userAuthStore = new UserAuthStore();
