import {observable, computed, action, decorate, when} from 'mobx';
import api from '../config/API';

class RealEstateStore {
  constructor() {
    when(() => this.estateDetails.currentOwner, () => this.fetchOwnerData());
  }

  estates = [];
  state = 'not_loaded';
  details = null;
  detailsId = null;
  fullDetails = false;
  ownerDetails = {};
  loading = false;
  query = '';

  fetchEstates(query, onlyMyProperties = false, authStore) {
    this.loading = true;
    query = !!onlyMyProperties ? '' : query;
    let userId = authStore && authStore.userAuth ? authStore.userAuth.code : '';
    let apiSelection = !!onlyMyProperties ? api.myEstates(userId) : api.estates(query);
    this.resetDetails();
    fetch(`${window.location.origin}/${apiSelection}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          this.estates = [];
        } else {
          this.estates = data;
        }
        this.state = 'loaded';
        this.loading = false;
      })
      .catch(() => (this.loading = false));
  }

  fetchEstateDetails(id) {
    this.loading = true;
    this.detailsId = id;
    fetch(`${window.location.origin}/${api.details(id)}`)
      .then(response => response.json())
      .then(data => {
        this.details = data;
        this.loading = false;
      })
      .catch(() => (this.loading = false));
  }

  fetchOwnerData() {
    this.loading = true;
    fetch(api.person(this.estateDetails.currentOwner))
      .then(res => res.json())
      .then(data => {
        this.ownerDetails = data;
        this.loading = false;
      })
      .catch(() => (this.loading = false));
  }

  setQuery(input) {
    this.query = input;
  }

  get estateCount() {
    return this.estates.length;
  }

  get dataAvailable() {
    return this.state === 'loaded' && this.estateCount > 0;
  }

  get noResults() {
    return this.state === 'loaded' && this.estateCount === 0;
  }

  get detailsAvailable() {
    return !!this.details;
  }

  get detailedAddress() {
    const estate = this.details || {};
    return `${estate.street} ${estate.house}${estate.apartment ? `-${estate.apartment}` : ''}`;
  }

  get estateData() {
    return this.details || {};
  }

  get estateDetails() {
    return this.estateData.detailedData || {};
  }

  get mortgageData() {
    const {mortgageSize, mortgageSubject} = this.estateDetails;
    return mortgageSize || mortgageSubject
      ? `Mortgage ${mortgageSize}$ (${mortgageSubject})`
      : 'No mortgage';
  }

  get ownerName() {
    const {currentOwner} = this.estateDetails;
    const {firstName, lastName} = this.ownerDetails;
    return firstName || lastName ? `${firstName || ''} ${lastName || ''}` : currentOwner;
  }

  get previousOwnerData() {
    const {previousOwner} = this.estateDetails;
    return previousOwner ? `Previously owned by ${previousOwner}` : 'No previous owner';
  }

  resetDetails() {
    this.details = null;
    this.detailsId = null;
  }
}

decorate(RealEstateStore, {
  dataAvailable: computed,
  detailedAddress: computed,
  details: observable,
  detailsAvailable: computed,
  detailsId: observable,
  estateCount: computed,
  estateData: computed,
  estateDetails: computed,
  estates: observable,
  fetchEstateDetails: action,
  fetchEstates: action,
  fetchOwnerData: action,
  fullDetails: observable,
  loading: observable,
  mortgageData: computed,
  noResults: computed,
  ownerDetails: observable,
  ownerName: computed,
  previousOwnerData: computed,
  query: observable,
  resetDetails: action,
  setQuery: action,
  state: observable,
});

export const realEstateStore = new RealEstateStore();
