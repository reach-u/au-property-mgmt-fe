export default {
  estates: query => `au-property-mgmt-rest/api/1/address?q=${query}`,
  myEstates: query => `au-property-mgmt-rest/api/1/find_by_owner/${query}`,
  details: id => `au-property-mgmt-rest/api/1/address/${id}`,
  getAllPersons: function () {
    return 'http://africa.nortal.com/person-registry/persons?dateFrom=1900-10-27T08%3A56%3A24.315Z&dateTo=2018-10-27T08%3A56%3A24.315Z';
  },
};
