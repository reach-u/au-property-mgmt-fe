import {observable, computed, action, decorate} from 'mobx';
import api from '../config/API';

class RealEstateStore {
  estates = [];
  userEstates = [];
  state = 'not_loaded';
  details = null;
  detailsId = null;
  detailsVisible = false;
  loading = false;
  query = '';

  fetchEstates(query, onlyMyProperties = false, authStore) {
    this.loading = true;
    this.detailsVisible = false;
    this.state = 'not_loaded';
    query = !!onlyMyProperties ? '' : query;
    let userId = authStore && authStore.userAuth ? authStore.userAuth.code : '';
    let apiSelection = !!onlyMyProperties ? api.myEstates(userId) : api.estates(query);
    this.resetDetails();
    fetch(`${window.location.origin}/${apiSelection}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          this.estates = [];
          this.state = 'loaded';
        } else if (!onlyMyProperties) {
          this.estates = data.sort((a, b) => a.id - b.id);
          this.state = 'loaded';
        } else {
          this.userEstates = data.sort((a, b) => a.id - b.id);
          this.state = 'loaded';
        }

        this.loading = false;
      })
      .catch(() => (this.loading = false));
  }

  fetchEstateDetails(id, showModal = true) {
    if (id === this.detailsId) {
      this.detailsVisible = showModal;
      return;
    }
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

  get userDataAvailable() {
    return this.state === 'loaded' && this.userEstates.length > 0;
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

  resetData() {
    this.estates = [];
    this.query = '';
    this.state = 'not_loaded';
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
  userDataAvailable: computed,
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
  resetData: action,
  resetDetails: action,
  setQuery: action,
  state: observable,
  userEstates: observable,
});

export const realEstateStore = new RealEstateStore();
