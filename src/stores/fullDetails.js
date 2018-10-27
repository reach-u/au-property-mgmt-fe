import api from '../config/API';
import {observable, computed, action, decorate, when} from 'mobx';

class FullDetailsStore {
  constructor() {
    when(() => this.ownerId, () => this.fetchOwnerData());
  }

  details = {};
  loading = true;
  ownerDetails = {};

  fetchDetailsData(id) {
    this.loading = true;
    fetch(`${window.location.origin}/${api.details(id)}`)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        return {};
      })
      .then(data => {
        this.details = data;
        this.loading = false;
      })
      .catch(err => {
        throw err;
      });
  }

  fetchOwnerData() {
    this.loading = true;
    fetch(api.person(this.details.detailedData.currentOwner))
      .then(res => res.json())
      .then(data => {
        this.ownerDetails = data;
        this.loading = false;
      });
  }

  get ownerId() {
    return this.detailedData.currentOwner;
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

  get ownerName() {
    const {currentOwner} = this.detailedData;
    const {firstName, lastName} = this.ownerDetails;
    return firstName || lastName ? `${firstName || ''} ${lastName || ''}` : currentOwner;
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
  loading: observable,
  ownerDetails: observable,
  fetchDetailsData: action,
  fetchOwnerData: action,
  ownerId: computed,
  ownerName: computed,
  coordinateData: computed,
  detailedData: computed,
  addressData: computed,
  mortgageData: computed,
  previousOwnerData: computed,
});

export const fullDetailsStore = new FullDetailsStore();
