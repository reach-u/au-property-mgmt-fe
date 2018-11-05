import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Button, Icon} from '@blueprintjs/core';
import './ownerChange/styles.css';

class OwnerChange extends Component {
  render() {
    const {id} = this.props.match.params;
    const {store, userStore, history} = this.props;

    return (
      <div className="owner-container">
        <div className="container-card">
          <Button
            style={{marginBottom: 30, alignSelf: 'flex-start'}}
            minimal
            icon="arrow-left"
            onClick={() => history.goBack()}>
            Back
          </Button>
          <h3>Ownership change for property no. {id}</h3>
          <h3>
            {store.detailedAddress} / {store.estateDetails.propertyType},{' '}
            {store.estateDetails.propertySize} m<sup>2</sup>{' '}
            <Button minimal intent="primary" rightIcon="share" onClick={this.handleDetailsClick}>
              See all details
            </Button>
          </h3>

          {this.renderPaymentButton()}

          <div className="actions">
            <div className="owners">
              <h5>Current owner</h5>
              <h1>{store.ownerName}</h1>
              {this.renderCurrentOwnerAction()}
            </div>

            <Icon icon="arrow-right" iconSize={24} />

            <div className="owners">
              <h5>New owner</h5>
              <h1>{userStore.userName}</h1>
              {this.renderNewOwnerAction()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const {
      store,
      match: {params},
      userStore,
      transactionStore,
    } = this.props;
    if (!store.details) {
      store.fetchEstateDetails(params.id);
    }
    if (!userStore.userAuth) {
      userStore.initAndLoginUsers();
    }
    if (!transactionStore.transactionId) {
      transactionStore.fetchPropertyTransactions(params.id);
    }
  }

  handleDetailsClick = () => {
    this.props.history.push(`/details/${this.props.match.params.id}`);
  };

  renderCurrentOwnerAction = () => {
    const {estateDetails} = this.props.store;
    const {currentUser} = this.props.userStore;
    const {transactionDetails, signTransaction} = this.props.transactionStore;
    if (estateDetails.currentOwner === parseInt(currentUser.code, 10)) {
      if (!transactionDetails.signedBySeller) {
        return (
          <Button intent={'success'} onClick={() => signTransaction('seller')}>
            Sign contract
          </Button>
        );
      } else {
        return <p>Signed</p>;
      }
    } else if (!transactionDetails.signedBySeller) {
      return <p>Waiting for signature</p>;
    } else {
      return <p>Signed</p>;
    }
  };

  renderNewOwnerAction = () => {
    const {currentUser} = this.props.userStore;
    const {transactionDetails, signTransaction} = this.props.transactionStore;
    if (transactionDetails.buyerIdCode === parseInt(currentUser.code, 10)) {
      if (!transactionDetails.signedByBuyer) {
        return (
          <Button intent={'success'} onClick={() => signTransaction('buyer')}>
            Sign contract
          </Button>
        );
      } else {
        return <p>Signed</p>;
      }
    } else if (!transactionDetails.signedByBuyer) {
      return <p>Waiting for signature</p>;
    } else {
      return <p>Signed</p>;
    }
  };

  renderPaymentButton = () => {
    const {
      transactionStore: {transactionId, transactionStatus, payTax, loading, startTransaction},
      userStore: {userAuth},
      match: {params},
    } = this.props;
    if (transactionId) {
      return (
        <Button
          intent={
            transactionStatus === 'unpaid'
              ? 'primary'
              : transactionStatus === 'error'
                ? 'error'
                : 'success'
          }
          className="payment-button"
          large
          loading={loading}
          icon={
            transactionStatus === 'unpaid'
              ? 'dollar'
              : transactionStatus === 'error'
                ? 'error'
                : 'tick-circle'
          }
          minimal={transactionStatus === 'paid'}
          disabled={transactionStatus === 'paid'}
          onClick={() => payTax()}>
          {transactionStatus === 'unpaid'
            ? 'Pay state tax'
            : transactionStatus === 'error'
              ? 'Payment failed, try again'
              : 'State tax paid'}
        </Button>
      );
    } else {
      return (
        <Button
          className="payment-button"
          large
          intent="primary"
          onClick={() => startTransaction(userAuth.code, params.id)}>
          Begin ownership change
        </Button>
      );
    }
  };
}

export default observer(OwnerChange);
