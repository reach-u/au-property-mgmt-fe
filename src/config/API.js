const createUrl = (endpoint, parameters = []) =>
  `${process.env.REACT_APP_BASE_URL}${endpoint}${parameters.join('/')}`;

export default {
  estates: query => createUrl('/api/1/address?q=', [query]),
  myEstates: query => createUrl('/api/1/find_by_owner/', [query]),
  details: id => createUrl('/api/1/address/', [id]),
  buyProperty: (buyerId, addressId) => createUrl('/api/1/priv/re/buy/', [buyerId, addressId]),
  signBuyer: transactionId => createUrl('/api/1/priv/re/sign_by_buyer/', [transactionId]),
  signSeller: transactionId => createUrl('/api/1/priv/re/sign_by_seller/', [transactionId]),
  transactionStatus: transactionId => createUrl('/api/1/priv/re/details/', [transactionId]),
  payTax: transactionId => createUrl('/api/1/priv/re/pay_tax/', [transactionId]),
  getAllPersons: () => createUrl('/api/1/priv/proxy/persons'),
  getLandTaxAreaStats: () => createUrl('/api/1/priv/landtax/stats/area'),
  getLandTaxMonthlyStats: () => createUrl('/api/1/priv/landtax/stats/month'),
  getTransactions: addressId => createUrl('/api/1/priv/re/details_by_address/', [addressId]),
  getPersonsTransactions: personId => createUrl('/api/1/priv/re/details_by_person/', [personId]),
  getPersonsPayments: personId => createUrl('/api/1/priv/landtax/payments/', [personId]),
  payLandTax: paymentId => createUrl('/api/1/priv/landtax/pay/', [paymentId]),
  getTaxZones: () => createUrl('/api/1/priv/landtax/zones')
};
