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
    const {authstore, history} = this.props;
    const activeTransactions = authstore.userTransactions.length > 0;

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
                <tr key={index} className="user-properties-tr">
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
                    <p className="table-important">
                      {`${item.address.street} ${item.address.house}${
                        item.address.apartment ? `-${item.address.apartment}` : ''
                      }`}
                    </p>
                  </td>
                  <td>
                    <p className="transaction-parties">
                      {authstore.getUsernameById(item.sellerIdCode)}{' '}
                      <Icon
                        icon="chevron-right"
                        style={{verticalAlign: 'text-bottom', color: '#888'}}
                      />{' '}
                      {authstore.getUsernameById(item.buyerIdCode)}{' '}
                    </p>
                  </td>
                  <td style={{fontWeight: item.signedByAll ? 400 : 600}}>
                    {item.signedByAll ? 'Transaction complete' : 'Transaction in progress'}
                  </td>
                  <td>
                    <div
                      title="Transaction details"
                      style={{cursor: 'pointer'}}
                      onClick={() => {
                        const url = item.signedByAll
                          ? `/transaction/${item.transactionId}`
                          : `/owner-change/${item.address.id}`;
                        history.push(url);
                      }}>
                      <img src={info} alt="Transaction details" />
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
