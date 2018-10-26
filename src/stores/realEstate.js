import {observable, computed, action, decorate} from 'mobx';
import api from '../config/API';

class RealEstateStore {
  estates = [];
  state = 'not_loaded';
  details = null;
  detailsId = null;

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
    if (this.detailsId) {
      const estate = this.estates.find(item => item.id === this.detailsId) || {};
      return `${estate.street}, ${estate.house}${estate.apartment ? `-${estate.apartment}` : ''}, ${
        estate.county
      }, ${estate.country}`;
    }
    return null;
  }

  resetDetails() {
    this.details = null;
    this.detailsId = null;
  }

  fetchEstates(query) {
    this.resetDetails();
    fetch(api.estates(query))
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          this.estates = [];
        } else {
          this.estates = data;
        }
        this.state = 'loaded';
      });
  }

  fetchEstateDetails(id) {
    this.resetDetails();
    this.detailsId = id;
    fetch(api.details(id))
      .then(response => response.json())
      .then(data => {
        this.details = data.detailedData;
      });
  }
}

decorate(RealEstateStore, {
  details: observable,
  estates: observable,
  estateCount: computed,
  dataAvailable: computed,
  detailsAvailable: computed,
  detailsId: observable,
  detailedAddress: computed,
  noResults: computed,
  fetchEstateDetails: action,
  fetchEstates: action,
  resetDetails: action,
  state: observable,
});

export const realEstateStore = new RealEstateStore();
