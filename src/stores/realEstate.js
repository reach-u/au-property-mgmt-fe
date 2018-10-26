import {observable, computed, action, decorate} from 'mobx';
import api from '../config/API';

class RealEstateStore {
  estates = [];

  get estateCount() {
    return this.estates.length;
  }

  fetchEstates(query) {
    this.estates = [];
    fetch(api.properties(query))
      .then(response => response.json())
      .then(data => (this.estates = data));
  }
}

decorate(RealEstateStore, {
  estates: observable,
  estateCount: computed,
  fetchEstates: action,
});

export const realEstateStore = new RealEstateStore();
