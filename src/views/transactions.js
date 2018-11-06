import React from 'react';
import {observer} from 'mobx-react';
import * as Classes from '@blueprintjs/core/lib/esm/common/classes';
import school from '../assets/baseline-school-24px.svg';
import {Icon, NonIdealState, ProgressBar} from '@blueprintjs/core';
import info from '../assets/info.png';
import './registry/results.css';
import './registry/registry.scss';

const Transactions = ({authstore, history}) => {
  const activeTransactions = authstore.userTransactions.length > 0;

  if (activeTransactions) {
    return (
      <div className="registry-container">
        <table
          className={[Classes.HTML_TABLE_STRIPED, Classes.HTML_TABLE, 'results-table'].join(' ')}>
          <tbody>
            {authstore.userTransactions.map((item, index) => (
              <tr key={index}>
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
                  <p>
                    {authstore.getUsernameById(item.sellerIdCode)}{' '}
                    <Icon icon="chevron-right" style={{verticalAlign: 'text-bottom'}} />{' '}
                    {authstore.getUsernameById(item.buyerIdCode)}{' '}
                  </p>
                </td>
                <td>
                  <div
                    title="Transaction details"
                    style={{cursor: 'pointer'}}
                    onClick={() => {
                      history.push(`/owner-change/${item.address.id}`);
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
        description="You have no active transactions."
      />
    );
  }
};

export default observer(Transactions);
