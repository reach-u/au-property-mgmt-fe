import React, {Component} from 'react';
import {observer} from 'mobx-react';
import info from '../assets/info.png';
import school from '../assets/baseline-school-24px.svg';
import './registry/results.css';
import './registry/registry.scss';
import * as Classes from "@blueprintjs/core/lib/esm/common/classes";
import {Icon} from "@blueprintjs/core/lib/cjs/components/icon/icon";

class PaymentsOfOneMonth extends Component {
  state = {
    expanded: false
  };

  render() {
    const {authstore, store, month} = this.props;
    const {monthName, payments} = month;
    let sumOfUnpaid = this.getSumOfUnpaidPropertiesPayables(payments);
    const isPaid = sumOfUnpaid === 0;

    return (
      <div className="payment-row">
        <table
          className={[
            Classes.HTML_TABLE_STRIPED,
            Classes.HTML_TABLE,
            'results-table',
          ].join(' ')}>
          <tbody>
          <tr className="user-properties-tr">
            <td className="payment-td-start" title="Payment">
              <img src={school} alt="Hammer"/>
            </td>
            <td className="payment-td" style={{fontWeight: 600}}>
              {monthName}
            </td>
            <td className="payment-td">
              <p
                style={{
                  fontWeight: 400,
                  alignSelf: 'center',
                  margin: 0,
                }}>
                {payments.length} properties (<span className="details-link" onClick={this.toggleDetails}>Show</span>)
              </p>
            </td>
            <td className="payment-td">
              <p style={{margin: 0}}>
                $ {sumOfUnpaid}
              </p>
            </td>
            <td className="payment-td">
              {!isPaid
                ? (<div
                  title="Pay tax"
                  className="details-link"
                >
                  Pay all
                </div>)
                : (<div>OK</div>)
              }
            </td>
          </tr>
          </tbody>
        </table>
        {this.state.expanded && this.renderDetailedMonth(payments, authstore, store)}
      </div>
    )
  }

  getSumOfUnpaidPropertiesPayables(payments) {
    let unpaidPayments = payments.filter(payment => !payment.paid);
    let valuesOfUnpaidPayments = unpaidPayments.map(payment => payment.payable);
    return valuesOfUnpaidPayments.reduce((a, b) => a + b, 0);
  }

  renderSinglePayment(payment, authstore, store, index) {
    return (
      <tr className="user-properties-tr" key={index}>
        <td>
          <Icon icon="office" iconSize={20} className="table-icon"/>
        </td>
        <td style={{width: "320px"}}>
          <div style={{display: 'flex'}}>
            <p className="table-important">
              {`${payment.address.street} ${payment.address.house}${
                payment.address.apartment ? `-${payment.address.apartment}` : ''
                }`}
            </p>
            <div
              title="Property details"
              style={{cursor: 'pointer', margin: '2px 0 0 8px'}}
              onClick={() => store.fetchEstateDetails(payment.address.id)}>
              <img src={info} alt="Transaction details"/>
            </div>
          </div>
        </td>
        <td>
            <p
              style={{
                fontWeight: 600,
                alignSelf: 'center',
                margin: 0,
                color: payment.paid ? "black" : "red"
              }}>
              $ {payment.payable}
            </p>
        </td>
        <td>
          {!payment.paid
            ? (<div
              title="Pay tax"
              className="details-link"
            >
              Pay
            </div>)
            : (<div/>)
          }
        </td>
      </tr>
    )
  }

  renderDetailedMonth (payments, authstore, store) {
    return (
      <table
        className={[
          Classes.HTML_TABLE_STRIPED,
          Classes.HTML_TABLE,
          'results-table',
          "detailed-month"
        ].join(' ')}>
        <tbody>
        {payments.map((payment, index) => this.renderSinglePayment(payment, authstore, store, index))}
        </tbody>
      </table>
    )
  };

  toggleDetails = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }
}

export default observer(PaymentsOfOneMonth);
