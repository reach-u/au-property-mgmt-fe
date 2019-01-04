import {decorate, observable, computed, action, reaction} from 'mobx';
import api from '../config/API';
import {sortAlphabetically} from '../utils/string';

class UserAuthStore {
  constructor() {
    reaction(() => this.userAuth, () => this.fetchUserTransactionsAndPayments());
  }

  userAuth = null;
  users = [];
  userTransactions = [];
  userPayments = [];
  loading = false;

  initAndLoginUsers() {
    fetch(`${window.location.origin}/${api.getAllPersons()}`)
      .then(response => {
        if (response.json) {
          return response.json();
        } else {
          return response;
        }
      })
      .then(data => {
        if (!data.error) {
          this.users = data.filter(user => !!user.givenName).sort(sortAlphabetically);
        }
      });
  }

  getUsernameById = (id = 0) => {
    const user = this.users.find(user => user.code.toString() === id.toString()) || {
      givenName: 'John',
      familyName: 'Doe',
    };
    return `${user.givenName} ${user.familyName}`;
  };

  fetchUserTransactionsAndPayments() {
    fetch(`${window.location.origin}/${api.getPersonsTransactions(this.userId)}`)
      .then(response => response.json())
      .then(transactions => {
        this.userTransactions = transactions.sort((a, b) => {
          if (a.signedByAll > b.signedByAll) {
            return 1;
          }
          if (b.signedByAll > a.signedByAll) {
            return -1;
          }
          return 0;
        });
      })
      .then(() => {
        fetch(`${window.location.origin}/${api.getPersonsPayments(this.userId)}`)
          .then(response => response.json())
          .then(payments => {
            this.userPayments = payments;
          });
      });
  }

  changeUser(user) {
    this.loading = true;
    setTimeout(() => {
      this.userAuth = null;
      this.userAuth = user;
      this.loading = false;
    }, 500);
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

  get pendingTransactions() {
    return this.userTransactions.filter(item => !item.signedByAll);
  }

  get pendingPayments() {
    return this.userPayments.filter(item => !item.paid);
  }
}

decorate(UserAuthStore, {
  changeUser: action,
  fetchUserTransactionsAndPayments: action,
  getUsernameById: action,
  loading: observable,
  userAuth: observable,
  users: observable,
  initAndLoginUsers: action,
  currentUser: computed,
  pendingTransactions: computed,
  pendingPayments: computed,
  userName: computed,
  userId: computed,
  userTransactions: observable,
  userPayments: observable,
});

export const userAuthStore = new UserAuthStore();
