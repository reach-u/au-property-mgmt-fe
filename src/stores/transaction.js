import api from '../config/API';
import {decorate, observable, action, computed, when, reaction} from 'mobx';
import waitAtLeast from '../utils/gracefulLoader';

class TransactionStore {
  constructor() {
    when(() => this.transactionId, () => this.fetchTransaction());
    reaction(() => this.transactionStatus, () => this.fetchTransaction());
  }

  transactionList = [];
  transactionId = null;
  currentTransaction = null;
  transactionStatus = 'unpaid';
  loading = false;

  fetchPropertyTransactions(addressId) {
    fetch(`${window.location.origin}/${api.getTransactions(addressId)}`)
      .then(response => response.json())
      .then(data => {
        this.transactionList = data.filter(transaction => !transaction.signedByAll);
        if (this.transactionList.length > 0 && !this.transactionList[0].signedByAll) {
          this.transactionId = this.transactionList[0].transactionId;
          this.transactionStatus = this.transactionList[0].paid
            ? this.transactionList[0].signedByAll
              ? 'complete'
              : 'paid'
            : 'unpaid';
          this.currentTransaction = this.transactionList[0];
        } else {
          this.clearTransaction();
        }
      });
  }

  startTransaction = (userId, addressId) => {
    fetch(`${window.location.origin}/${api.buyProperty(userId, addressId)}`, {method: 'POST'})
      .then(response => response.json())
      .then(data => (this.transactionId = data.transactionId));
  };

  fetchTransaction = () => {
    this.loading = true;
    if (this.transactionId) {
      waitAtLeast(
        500,
        fetch(`${window.location.origin}/${api.transactionStatus(this.transactionId)}`)
      )
        .then(response => response.json())
        .then(data => {
          this.currentTransaction = data;
          this.transactionStatus = data.paid ? (data.signedByAll ? 'complete' : 'paid') : 'unpaid';
          this.loading = false;
        });
    } else {
      this.loading = false;
      this.clearTransaction();
      return null;
    }
  };

  clearTransaction = () => {
    this.currentTransaction = null;
    this.transactionStatus = 'unpaid';
    this.transactionId = null;
  };

  signTransaction = role => {
    this.loading = true;
    const url = `${window.location.origin}/${
      role === 'buyer' ? api.signBuyer(this.transactionId) : api.signSeller(this.transactionId)
    }`;
    waitAtLeast(800, fetch(url, {method: 'POST'}))
      .then(response => response.json())
      .then(data => {
        this.currentTransaction = data;
        this.transactionStatus = data.signedByAll ? 'complete' : this.transactionStatus;
        this.loading = false;
      });
  };

  payTax = () => {
    this.loading = true;

    const url = `${window.location.origin}/${api.payTax(this.transactionId)}`;
    waitAtLeast(800, fetch(url, {method: 'POST'})).then(response => {
      if (response.status === 200) {
        this.transactionStatus = 'paid';
      } else {
        this.transactionStatus = 'error';
      }
      this.loading = false;
    });
  };

  get transactionDetails() {
    return this.currentTransaction || {};
  }
}

decorate(TransactionStore, {
  clearTransaction: action,
  currentTransaction: observable,
  fetchPropertyTransactions: action,
  fetchTransaction: action,
  loading: observable,
  payTax: action,
  signTransaction: action,
  startTransaction: action,
  transactionDetails: computed,
  transactionList: observable,
  transactionId: observable,
  transactionStatus: observable,
});

export const transactionStore = new TransactionStore();
