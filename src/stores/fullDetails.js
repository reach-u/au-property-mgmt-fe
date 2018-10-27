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

  get mortgageData() {
    const {mortgageSize, mortgageSubject} = this.detailedData;
    return mortgageSize || mortgageSubject
      ? `Mortgage ${mortgageSize}$ (${mortgageSubject})`
      : 'No mortgage';
  }

  get previousOwnerData() {
    const {previousOwner} = this.detailedData;
    return previousOwner ? `Previously owned by ${previousOwner}` : 'No previous owner';
  }
}

decorate(FullDetailsStore, {
  details: observable,
  fetchDetailsData: action,
  coordinateData: computed,
  detailedData: computed,
  addressData: computed,
  mortgageData: computed,
  previousOwnerData: computed,
});

export const fullDetailsStore = new FullDetailsStore();
