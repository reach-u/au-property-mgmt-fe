import api from '../config/API';
import {observable, computed, action, decorate} from 'mobx';

class FullDetailsStore {
  details = {};

  fetchDetailsData(id) {
    fetch(`${window.location.origin}/${api.details(id)}`)
      .then(response => response.json())
      .then(data => {
        this.details = data;
      });
  }

  get coordinateData() {
    return Object.assign({}, this.details.coordinates);
  }

  get detailedData() {
    return Object.assign({}, this.details.detailedData);
  }

  get addressData() {
    return `${this.details.street} ${this.details.house}${
      this.details.apartment ? `-${this.details.apartment}` : ''
    }, ${this.details.county}, ${this.details.country}`;
  }
}

decorate(FullDetailsStore, {
  details: observable,
  fetchDetailsData: action,
  coordinateData: computed,
  detailedData: computed,
  addressData: computed,
});

export const fullDetailsStore = new FullDetailsStore();
