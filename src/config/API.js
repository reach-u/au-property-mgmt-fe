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
  person: id => `au-property-mgmt-rest/api/1/priv/proxy/persons/${id}`,
  getAllPersons: function() {
    return 'au-property-mgmt-rest/api/1/priv/proxy/persons';
  },
  getTransactions: addressId =>
    `au-property-mgmt-rest/api/1/priv/re/details_by_address/${addressId}`,
};
