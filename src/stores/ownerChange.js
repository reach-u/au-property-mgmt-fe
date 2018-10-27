import {observable, computed, action, decorate} from 'mobx';

class OwnerChangeStore {
  details = {};

  fetchDetails(buyer, address) {}
}

decorate(OwnerChangeStore, {
  details: observable,
});

export const ownerChangeStore = new OwnerChangeStore();
