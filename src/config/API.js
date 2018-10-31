export default {
  estates: query => `au-property-mgmt-rest/api/1/address?q=${query}`,
  myEstates: query => `au-property-mgmt-rest/api/1/find_by_owner/${query}`,
  details: id => `au-property-mgmt-rest/api/1/address/${id}`,
  buyProperty: (buyerId, addressId) =>
    `au-property-mgmt-rest/api/1/priv/re/buy/${buyerId}/${addressId}`,
  signBuyer: transactionId => `au-property-mgmt-rest/api/1/priv/re/sign_by_buyer/${transactionId}`,
  signSeller: transactionId =>
    `au-property-mgmt-rest/api/1/priv/re/sign_by_seller/${transactionId}`,
  transactionStatus: transactionId =>
    `au-property-mgmt-rest/api/1/priv/re/details/${transactionId}`,
  payTax: transactionId => `au-property-mgmt-rest/api/1/priv/re/pay_tax/${transactionId}`,
  person: id => `http://139.59.148.64/coco-api/persons/${id}`,
  getAllPersons: function () {
    return 'https://egov-demo-ss3.westeurope.cloudapp.azure.com/restapi/GOV/M-LAND/RE-REG?xRoadInstance=EGOV-EXAMPLE&memberClass=GOV&memberCode=M-HOMEAFFAIRS&subsystemCode=POP-REG&serviceCode=persons&serviceVersion=1&dateFrom=1900-01-01T00:00:00.440Z&dateTo=2018-10-30T23:59:59.440Z';
  }
  getTransactions: addressId =>
    `au-property-mgmt-rest/api/1/priv/re/details_by_address/${addressId}`,
  getAllPersons: function() {
    return 'http://africa.nortal.com/person-registry/persons?dateFrom=1900-10-27T08%3A56%3A24.315Z&dateTo=2018-10-27T08%3A56%3A24.315Z';
  },
};