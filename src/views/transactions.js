import React, {Component} from 'react';
import {observer} from 'mobx-react';
import * as Classes from '@blueprintjs/core/lib/esm/common/classes';
import school from '../assets/baseline-school-24px.svg';
import {Icon, NonIdealState, ProgressBar} from '@blueprintjs/core';
import info from '../assets/info.png';
import './registry/results.css';
import './registry/registry.scss';

class Transactions extends Component {
  render() {
    const {authstore, history, store} = this.props;
    const activeTransactions = authstore.userTransactions.length > 0;
    const isDesktop = window.innerWidth > 1200;
    const completeText = isDesktop ? 'Transaction complete' : 'Complete';
    const pendingText = isDesktop ? 'Transaction in progress' : 'In progress';

    if (activeTransactions) {
      return (
        <div className="registry-container user-properties">
          <table
            className={[
              Classes.HTML_TABLE_STRIPED,
              Classes.HTML_TABLE,
              'results-table',
              'transaction-table',
            ].join(' ')}>
            <tbody>
              {authstore.userTransactions.map((item, index) => (
                <tr
                  key={index}
                  className="user-properties-tr"
                  onClick={() => {
                    if (isDesktop) {
                      return;
                    }
                    const url = item.signedByAll
                      ? `/transaction/${item.transactionId}`
                      : `/owner-change/${item.address.id}`;
                    history.push(url);
                  }}>
                  <td title={item.address.detailedData.buildingType}>
                    {item.address.detailedData.buildingType === 'School' ? (
                      <img src={school} alt="School" />
                    ) : item.address.detailedData.buildingType === 'Apartment building' ? (
                      <Icon icon="office" iconSize={20} className="table-icon" />
                    ) : (
                      <Icon icon="home" iconSize={20} className="table-icon" />
                    )}
                  </td>
                  <td>
                    <div style={{display: 'flex'}}>
                      <p className="table-important">
                        {`${item.address.street} ${item.address.house}${
                          item.address.apartment ? `-${item.address.apartment}` : ''
                        }`}
                      </p>
                      <div
                        title="Property details"
                        style={{cursor: 'pointer', margin: '2px 0 0 8px'}}
                        onClick={() => store.fetchEstateDetails(item.address.id)}>
                        <img src={info} alt="Transaction details" />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="main-details">
                      <p className="transaction-parties">
                        {authstore.getUsernameById(item.sellerIdCode)}{' '}
                        <Icon
                          icon="chevron-right"
                          style={{verticalAlign: 'text-bottom', color: '#888'}}
                        />{' '}
                        {authstore.getUsernameById(item.buyerIdCode)}{' '}
                      </p>
                      <p
                        style={{
                          fontWeight: item.signedByAll ? 400 : 600,
                          alignSelf: 'center',
                          margin: 0,
                        }}>
                        {item.signedByAll ? completeText : pendingText}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div
                      title="Transaction details"
                      className="details-link"
                      onClick={() => {
                        const url = item.signedByAll
                          ? `/transaction/${item.transactionId}`
                          : `/owner-change/${item.address.id}`;
                        history.push(url);
                      }}>
                      Details
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (authstore.loading) {
      return (
        <div style={{position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 2000}}>
          <ProgressBar intent="primary" />
        </div>
      );
    } else {
      return (
        <NonIdealState
          icon="swap-horizontal"
          title="No transactions"
          description="You have no pending or completed transactions."
        />
      );
    }
  }

  componentDidMount() {
    this.props.authstore.fetchUserTransactions();
  }
}

export default observer(Transactions);
