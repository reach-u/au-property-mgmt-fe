import {observable, computed, action, decorate} from 'mobx';
import api from '../config/API';

class RealEstateStore {
  estates = [];
  state = 'not_loaded';
  details = null;

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

  resetDetails() {
    this.details = null;
  }

  fetchEstates(query) {
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
    fetch(api.details(id))
      .then(response => response.json())
      .then(data => (this.details = data.detailedData));
  }
}

decorate(RealEstateStore, {
  details: observable,
  estates: observable,
  estateCount: computed,
  dataAvailable: computed,
  detailsAvailable: computed,
  noResults: computed,
  fetchEstateDetails: action,
  fetchEstates: action,
  resetDetails: action,
  state: observable,
});

export const realEstateStore = new RealEstateStore();
