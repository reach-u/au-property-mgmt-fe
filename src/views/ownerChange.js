import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Button, Icon, Overlay} from '@blueprintjs/core';
import './ownerChange/styles.css';
import info from '../assets/info.png';
import * as Classes from '@blueprintjs/core/lib/esm/common/classes';

class OwnerChange extends Component {
  state = {
    newOwner: 'Choose new owner',
    displayMenu: false,
  };

  render() {
    const {id} = this.props.match.params;
    const {store, userStore, history} = this.props;
    const {newOwner, displayMenu} = this.state;

    return (
      <div className="owner-container">
        <div className="container-card">
          <h3>Ownership change for property no. {id}</h3>
          <div className="main-address">
            {store.detailedAddress}
            <div title="Show details" onClick={this.handleDetailsClick}>
              <img src={info} alt="show details" className="icon-img" />
            </div>
          </div>
          <div className="secondary-address">
            {store.estateDetails.propertyType}, {store.estateDetails.propertySize} m<sup>2</sup>
          </div>

          {this.renderPaymentButton()}

          <div className="actions">
            <div className="owners">
              <h5>Current owner</h5>
              <h3 className="owner-name">
                {this.props.userStore.getUsernameById(store.estateDetails.currentOwner)}
              </h3>
              {this.renderCurrentOwnerAction()}
            </div>

            <Icon icon="chevron-right" iconSize={28} className="action-icon" />

            <div className="owners">
              <h5>New owner</h5>
              <h3
                className="owner-name"
                style={{cursor: 'pointer'}}
                title="Click to choose new owner"
                onClick={() => this.setState({displayMenu: true})}>
                {newOwner}
              </h3>
              {this.renderNewOwnerAction()}
            </div>
          </div>
          <button className="cancel-transaction" onClick={() => history.goBack()}>
            Cancel
          </button>
        </div>
        <Overlay isOpen={displayMenu} className={Classes.OVERLAY_SCROLL_CONTAINER}>
          <div className="overlay-content">
            <span className="overlay-close">
              <Icon
                icon="cross"
                iconSize={25}
                onClick={() => this.setState({displayMenu: false})}
              />
            </span>
            <ul className="user-list">
              {userStore.users
                .filter(
                  user => parseInt(user.code, 10) !== parseInt(userStore.currentUser.code, 10)
                )
                .map((object, i) => (
                  <li
                    key={i}
                    className={
                      object.givenName + ' ' + object.familyName === newOwner
                        ? 'current-user list-item'
                        : 'list-item'
                    }
                    onClick={() =>
                      this.handleNewOwnerClick(`${object.givenName} ${object.familyName}`)
                    }>
                    <p
                      onClick={() =>
                        this.handleNewOwnerClick(`${object.givenName} ${object.familyName}`)
                      }
                      style={{margin: 0}}>
                      {object.givenName + ' ' + object.familyName}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        </Overlay>
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
    this.props.store.detailsVisible = true;
  };

  handleNewOwnerClick = newOwner => {
    this.setState({newOwner}, () => {
      this.setState({displayMenu: false});
    });
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
      userStore: {users},
      match: {params},
    } = this.props;
    const newOwnerChosen = this.state.newOwner !== 'Choose new owner';

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
          minimal={!newOwnerChosen}
          disabled={!newOwnerChosen}
          onClick={() =>
            startTransaction(
              users.find(user => `${user.givenName} ${user.familyName}` === this.state.newOwner)
                .code,
              params.id
            )
          }>
          {newOwnerChosen ? 'Begin ownership change' : 'Choose new owner to start transaction'}
        </Button>
      );
    }
  };
}

export default observer(OwnerChange);
