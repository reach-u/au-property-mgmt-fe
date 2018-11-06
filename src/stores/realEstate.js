import {observable, computed, action, decorate} from 'mobx';
import api from '../config/API';

class RealEstateStore {
  estates = [];
  state = 'not_loaded';
  details = null;
  detailsId = null;
  detailsVisible = false;
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

  fetchEstateDetails(id, showModal = true) {
    this.loading = true;
    this.detailsId = id;
    fetch(`${window.location.origin}/${api.details(id)}`)
      .then(response => response.json())
      .then(data => {
        this.details = data;
        this.loading = false;
        this.detailsVisible = showModal;
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

  resetDetails() {
    this.details = null;
    this.detailsId = null;
  }

  closeDetailsModal() {
    this.detailsVisible = false;
  }
}

decorate(RealEstateStore, {
  closeDetailsModal: action,
  dataAvailable: computed,
  detailedAddress: computed,
  details: observable,
  detailsAvailable: computed,
  detailsId: observable,
  detailsVisible: observable,
  estateCount: computed,
  estateData: computed,
  estateDetails: computed,
  estates: observable,
  fetchEstateDetails: action,
  fetchEstates: action,
  fullDetails: observable,
  loading: observable,
  noResults: computed,
  query: observable,
  resetDetails: action,
  setQuery: action,
  state: observable,
});

export const realEstateStore = new RealEstateStore();
