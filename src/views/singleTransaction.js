import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Icon, Classes} from '@blueprintjs/core';
import './ownerChange/styles.css';
import info from '../assets/info.png';
import {formatDate} from '../utils/date';

class Transaction extends Component {
  state = {
    newOwner: 'Choose owner',
    displayMenu: false,
  };

  render() {
    const {id} = this.props.match.params;
    const {store, userStore, history, transactionStore} = this.props;
    const loading =
      store.loading || transactionStore.loading || userStore.loading ? Classes.SKELETON : '';

    return (
      <div className="owner-container">
        <div className="container-card">
          <h3>Ownership change for property {id}</h3>
          <p className={loading}>
            Started at {formatDate(transactionStore.transactionDetails.startedDate)}
          </p>
          <div className={`main-address ${loading}`} style={{marginTop: 30}}>
            {store.detailedAddress}
            <div title="Show details" onClick={this.handleDetailsClick}>
              <img src={info} alt="show details" className="icon-img" />
            </div>
          </div>
          <div className={`secondary-address ${loading}`}>
            {store.estateDetails.propertyType}, {store.estateDetails.propertySize} m<sup>2</sup>
          </div>

          <div className={`actions ${loading}`} style={{marginTop: 20}}>
            <div className="owners">
              <h5>Previous owner</h5>
              <h3 className="owner-name">
                {userStore.getUsernameById(transactionStore.transactionDetails.sellerIdCode)}
              </h3>
              Signed on {formatDate(transactionStore.transactionDetails.signedBySeller)}
            </div>

            <Icon icon={'chevron-right'} iconSize={30} className="action-icon" />

            <div className={`owners ${loading}`}>
              <h5>New owner</h5>
              <h3 className="owner-name">
                {userStore.getUsernameById(transactionStore.transactionDetails.buyerIdCode)}
              </h3>
              Signed on {formatDate(transactionStore.transactionDetails.signedByBuyer)}
            </div>
          </div>
          <button className="cancel-transaction" onClick={() => history.goBack()}>
            Back
          </button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const {
      match: {params},
      transactionStore,
    } = this.props;

    transactionStore.transactionId = params.id;
    transactionStore.fetchTransaction();
  }

  componentDidUpdate() {
    const {transactionStore, store} = this.props;
    if (transactionStore.currentTransaction && !store.detailsId) {
      store.fetchEstateDetails(transactionStore.transactionDetails.address.id, false);
    }
  }

  handleDetailsClick = () => {
    this.props.store.detailsVisible = true;
  };
}

export default observer(Transaction);
