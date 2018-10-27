export default {
  estates: query => `au-property-mgmt-rest/api/1/address?q=${query}`,
  details: id => `au-property-mgmt-rest/api/1/address/${id}`,
  buyProperty: (buyerId, addressId) =>
    `au-property-mgmt-rest/api/1/priv/re/buy/${buyerId}/${addressId}`,
  signBuyer: transactionId => `au-property-mgmt-rest/api/1/priv/re/sign_by_buyer/${transactionId}`,
  signSeller: transactionId =>
    `au-property-mgmt-rest/api/1/priv/re/sign_by_seller/${transactionId}`,
  transactionStatus: transactionId =>
    `au-property-mgmt-rest/api/1/priv/re/details/${transactionId}`,
  person: id => `http://139.59.148.64/coco-api/persons/${id}`,
};
