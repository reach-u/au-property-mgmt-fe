import api from '../config/API';
import {decorate, observable, action, computed, when} from 'mobx';

class TransactionStore {
  constructor() {
    when(() => this.transactionId, () => this.fetchTransaction());
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
        if (this.transactionList.length > 0) {
          this.transactionId = this.transactionList[0].transactionId;
          this.transactionStatus = this.transactionList[0].paid ? 'paid' : 'unpaid';
        }
      });
  }

  startTransaction = (userId, addressId) => {
    fetch(`${window.location.origin}/${api.buyProperty(userId, addressId)}`, {method: 'POST'})
      .then(response => response.json())
      .then(data => (this.transactionId = data.transactionId));
  };

  fetchTransaction() {
    fetch(`${window.location.origin}/${api.transactionStatus(this.transactionId)}`)
      .then(response => response.json())
      .then(data => (this.currentTransaction = data));
  }

  signTransaction = role => {
    const url = `${window.location.origin}/${
      role === 'buyer' ? api.signBuyer(this.transactionId) : api.signSeller(this.transactionId)
    }`;
    fetch(url, {method: 'POST'})
      .then(response => response.json())
      .then(data => (this.currentTransaction = data));
  };

  payTax = () => {
    this.loading = true;
    setTimeout(() => {
      const url = `${window.location.origin}/${api.payTax(this.transactionId)}`;
      fetch(url, {method: 'POST'}).then(response => {
        if (response.status === 200) {
          this.transactionStatus = 'paid';
        } else {
          this.transactionStatus = 'error';
        }
        this.loading = false;
      });
    }, 2500);
  };

  get transactionDetails() {
    return this.currentTransaction || {};
  }
}

decorate(TransactionStore, {
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
