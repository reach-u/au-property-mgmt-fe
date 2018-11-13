import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Icon, Overlay, Spinner} from '@blueprintjs/core';
import './ownerChange/styles.css';
import info from '../assets/info.png';
import * as Classes from '@blueprintjs/core/lib/esm/common/classes';
import check from '../assets/check.png';

const newOwnerPlaceholder = 'Not selected';

class OwnerChange extends Component {
  state = {
    newOwner: newOwnerPlaceholder,
    displayMenu: false,
  };

  render() {
    const {id} = this.props.match.params;
    const {store, userStore, history, transactionStore} = this.props;
    const {newOwner, displayMenu} = this.state;
    /*const isOwner =
      (parseInt(store.estateDetails.currentOwner, 10) === userStore.userId &&
        (transactionStore.currentTransaction &&
          !transactionStore.currentTransaction.buyerIdCode)) ||
      !transactionStore.currentTransaction;*/

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

          {this.renderUserAction()}

          <div className="actions">
            <div className="owners">
              <h5>Current owner</h5>
              <h3 className="owner-name">
                {this.props.userStore.getUsernameById(store.estateDetails.currentOwner)}
              </h3>
            </div>

            <Icon icon={'chevron-right'} iconSize={30} className="action-icon" />

            <div className="owners">
              <h5>New owner</h5>
              <h3 className="owner-name">{newOwner}</h3>
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

  componentWillUnmount() {
    this.props.transactionStore.clearTransaction();
  }

  handleDetailsClick = () => {
    this.props.store.detailsVisible = true;
  };

  handleNewOwnerClick = newOwner => {
    this.setState({newOwner}, () => {
      this.setState({displayMenu: false});
    });
  };

  renderUserAction = () => {
    const {
      transactionStore,
      transactionStore: {transactionId, transactionStatus, loading, payTax, transactionDetails},
      userStore: {currentUser, getUsernameById},
    } = this.props;
    const newOwnerChosen = this.state.newOwner !== newOwnerPlaceholder;
    const userIsSeller = transactionDetails.sellerIdCode === parseInt(currentUser.code, 10);
    const userIsBuyer = transactionDetails.buyerIdCode === parseInt(currentUser.code, 10);

    if (transactionId) {
      if (transactionStatus !== 'unpaid') {
        if (
          (userIsSeller && !transactionDetails.signedBySeller) ||
          (userIsBuyer && !transactionDetails.signedByBuyer)
        ) {
          return (
            <button
              className="payment-button"
              onClick={() => transactionStore.signTransaction(userIsSeller ? 'seller' : 'buyer')}>
              SIGN CONTRACT{' '}
              {loading ? <Spinner className="loading-spinner" size={16} /> : <Icon icon="edit" />}
            </button>
          );
        } else {
          return (
            <ul className="transaction-overview">
              <li>
                <img src={check} alt="" /> State tax paid
              </li>
              <li>
                {transactionDetails.signedBySeller ? (
                  <img src={check} alt="" />
                ) : (
                  <Icon icon="delete" />
                )}{' '}
                {transactionDetails.signedBySeller ? 'Signed by' : 'Not signed by'}{' '}
                {getUsernameById(transactionDetails.sellerIdCode)}
              </li>
              <li>
                {transactionDetails.signedByBuyer ? (
                  <img src={check} alt="" />
                ) : (
                  <Icon icon="delete" />
                )}{' '}
                {transactionDetails.signedByBuyer ? 'Signed by' : 'Not signed by'}{' '}
                {getUsernameById(transactionDetails.buyerIdCode)}
              </li>
              <li>
                {transactionDetails.signedByAll ? (
                  <img src={check} alt="" />
                ) : (
                  <Icon icon="delete" />
                )}{' '}
                {transactionDetails.signedByAll
                  ? 'Transaction complete'
                  : 'Transaction not complete'}
              </li>
            </ul>
          );
        }
      } else {
        return (
          <button className="payment-button" onClick={() => payTax()}>
            {transactionStatus === 'unpaid' ? 'PAY STATE TAX' : 'RETRY'}
            {loading ? (
              <Spinner className="loading-spinner" size={18} />
            ) : (
              <Icon icon={transactionStatus === 'unpaid' ? 'dollar' : 'refresh'} />
            )}
          </button>
        );
      }
    } else if (newOwnerChosen) {
      return (
        <button className="payment-button" onClick={this.handleTransactionStart}>
          BEGIN TRANSACTION{' '}
          {loading ? (
            <Spinner className="loading-spinner" size={18} />
          ) : (
            <Icon icon="circle-arrow-right" />
          )}
        </button>
      );
    } else {
      return (
        <button className="payment-button" onClick={() => this.setState({displayMenu: true})}>
          SELECT NEW OWNER{' '}
          {loading ? <Spinner className="loading-spinner" size={18} /> : <Icon icon="plus" />}
        </button>
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
