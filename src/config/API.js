export default {
  estates: query => `au-property-mgmt-rest/api/1/address?q=${query}`,
  details: id => `au-property-mgmt-rest/api/1/address/${id}`,
};
