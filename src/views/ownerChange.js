import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Button, Icon, Overlay} from '@blueprintjs/core';
import './ownerChange/styles.css';
import info from '../assets/info.png';
import * as Classes from '@blueprintjs/core/lib/esm/common/classes';
import check from '../assets/check.png';

class OwnerChange extends Component {
  state = {
    newOwner: 'Choose owner',
    displayMenu: false,
  };

  render() {
    const {id} = this.props.match.params;
    const {store, userStore, history, transactionStore} = this.props;
    const {newOwner, displayMenu} = this.state;
    const isOwner =
      (parseInt(store.estateDetails.currentOwner, 10) === userStore.userId &&
        (transactionStore.currentTransaction &&
          !transactionStore.currentTransaction.buyerIdCode)) ||
      !transactionStore.currentTransaction;

    return (
      <div className="owner-container">
        <div className="container-card">
          <h3>Ownership change for property {id}</h3>
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

            <Icon icon={'chevron-right'} iconSize={30} className="action-icon" />

            <div className="owners">
              <h5>New owner</h5>
              <h3
                className="owner-name"
                style={{
                  cursor: isOwner ? 'pointer' : 'default',
                  textDecoration: isOwner ? 'underline' : 'none',
                }}
                title={isOwner ? 'Click to choose new owner' : null}
                onClick={() => {
                  if (!isOwner) {
                    return;
                  }
                  this.setState({displayMenu: true});
                }}>
                {newOwner}
              </h3>
              {this.renderNewOwnerAction()}
            </div>
          </div>
          <button className="cancel-transaction" onClick={() => history.goBack()}>
            Back
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
      transactionStore,
    } = this.props;

    store.fetchEstateDetails(params.id, false);
    transactionStore.fetchPropertyTransactions(params.id);
  }

  componentDidUpdate(prevProps, prevState) {
    const {transactionStore, userStore} = this.props;
    if (
      transactionStore.currentTransaction &&
      userStore.getUsernameById(transactionStore.currentTransaction.buyerIdCode) !==
        prevState.newOwner
    ) {
      this.setState({
        newOwner: userStore.getUsernameById(transactionStore.currentTransaction.buyerIdCode),
      });
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
    const {transactionStore} = this.props;
    if (estateDetails.currentOwner === parseInt(currentUser.code, 10)) {
      if (
        !transactionStore.transactionDetails.signedBySeller &&
        transactionStore.transactionDetails.paid
      ) {
        return (
          <button
            className="sign-contract-button"
            onClick={() => transactionStore.signTransaction('seller')}>
            SIGN CONTRACT
          </button>
        );
      } else if (this.state.newOwner === 'Choose owner') {
        return null;
      } else if (!transactionStore.transactionDetails.paid) {
        return <p>State tax unpaid</p>;
      } else {
        return (
          <p>
            <img src={check} alt="" className="check-icon" /> Signed
          </p>
        );
      }
    } else if (this.state.newOwner === 'Choose owner') {
      return null;
    } else if (!transactionStore.transactionDetails.signedBySeller) {
      return <p>Waiting for signature</p>;
    } else {
      return (
        <p>
          <img src={check} alt="" className="check-icon" /> Signed
        </p>
      );
    }
  };

  renderNewOwnerAction = () => {
    const {currentUser} = this.props.userStore;
    const {transactionDetails, signTransaction} = this.props.transactionStore;
    if (transactionDetails.buyerIdCode === parseInt(currentUser.code, 10)) {
      if (!transactionDetails.signedByBuyer && transactionDetails.paid) {
        return (
          <button className="sign-contract-button" onClick={() => signTransaction('buyer')}>
            SIGN CONTRACT
          </button>
        );
      } else if (!transactionDetails.paid) {
        return <p>State tax unpaid</p>;
      } else {
        return (
          <p>
            <img src={check} alt="" className="check-icon" /> Signed
          </p>
        );
      }
    } else if (this.state.newOwner === 'Choose owner') {
      return null;
    } else if (!transactionDetails.signedByBuyer) {
      return <p>Waiting for signature</p>;
    } else {
      return (
        <p>
          <img src={check} alt="" className="check-icon" /> Signed
        </p>
      );
    }
  };

  renderPaymentButton = () => {
    const {
      transactionStore: {transactionId, transactionStatus, loading, payTax},
    } = this.props;
    const newOwnerChosen = this.state.newOwner !== 'Choose owner';
    const successStatus = transactionStatus === 'paid' || transactionStatus === 'complete';

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
          minimal={successStatus}
          disabled={successStatus}
          onClick={() => payTax()}>
          {transactionStatus === 'unpaid'
            ? 'Pay state tax'
            : transactionStatus === 'error'
              ? 'Payment failed, try again'
              : transactionStatus === 'complete'
                ? 'Transaction complete'
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
          onClick={this.handleTransactionStart}>
          {newOwnerChosen ? 'Begin ownership change' : 'Choose new owner to start transaction'}
        </Button>
      );
    }
  };

  handleTransactionStart = async () => {
    const {
      transactionStore: {startTransaction},
      userStore: {users},
      match: {params},
    } = this.props;
    await startTransaction(
      users.find(user => `${user.givenName} ${user.familyName}` === this.state.newOwner).code,
      params.id
    );
    setTimeout(() => this.props.userStore.fetchUserTransactions(), 2000);
  };
}

export default observer(OwnerChange);
