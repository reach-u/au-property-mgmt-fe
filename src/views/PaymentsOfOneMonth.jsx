import React, {Component} from 'react';
import {observer} from 'mobx-react';

class PaymentsOfOneMonth extends Component {
  state = {
    expanded: false
  };

  render() {
    const {authstore, store, month} = this.props;
    const {monthName, payments} = month;
    const isDesktop = window.innerWidth > 1370;
    let sumOfUnpaid = this.getSumOfUnpaidPropertiesPayables(payments);
    let numberOfUnpaidProperties = this.getNumberOfUnpaidProperties(payments);
    const isPaid = sumOfUnpaid === 0;

    return (
      <div className={`main-table-row-container ${this.state.expanded && 'expanded'}`}>
        <tr className="main-table-tr">
          <td className="collapse-button-td">
            <button className="collapse-button" onClick={this.toggleDetails}>
              {this.state.expanded ? "-" : "+"}
            </button>
          </td>
          <td className="main-table-td bold-text">
            {monthName}
          </td>
          <td className="main-table-td">
            {payments.length} properties {!isPaid && `(${numberOfUnpaidProperties} unpaid)`}
          </td>
          <td className="main-table-td bold-text align-right">
            $ {sumOfUnpaid.toLocaleString('en-US')}
          </td>
          <td className="main-table-td separate-last-td">
            {!isPaid
              ? <a href="#/" onClick={this.handlePay}>Pay all</a>
              : "Paid"}
          </td>
        </tr>
        {this.state.expanded && this.renderDetailedMonth(payments, authstore, store)}
      </div>
    )
  }

  renderDetailedMonth(payments, authstore, store) {
    return (
      <div className="detailed-month">
        <table>
          <tbody>
          {payments.map((payment, index) => this.renderSinglePayment(payment, authstore, store, index))}
          </tbody>
        </table>
      </div>
    )
  };

  renderSinglePayment(payment, authstore, store, index) {
    console.log(index);
    return (
      <tr className="single-property-row" key={index}>
        <td className="property-td">
          {index + 1}.&nbsp;&nbsp;&nbsp;
          <span className="bold-text">
            {`${payment.address.street} ${payment.address.house}${
            payment.address.apartment ? `-${payment.address.apartment}` : ''
            }`}
            </span>
        </td>
        <td className="property-align-right-td">
          $ {payment.payable.toLocaleString('en-US')}
        </td>
        <td className="property-td separate-last-td">
          <a href="#/" onClick={this.handlePay}>{!payment.paid && "Pay"}</a>
        </td>
      </tr>
    )
  }

  toggleDetails = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  };

  getSumOfUnpaidPropertiesPayables = (payments) => {
    let unpaidPayments = payments.filter(payment => !payment.paid);
    let valuesOfUnpaidPayments = unpaidPayments.map(payment => payment.payable);
    return valuesOfUnpaidPayments.reduce((a, b) => a + b, 0);
  };

  getNumberOfUnpaidProperties = (payments) => {
    return payments.filter(payment => !payment.paid).length;
  };

  handlePay = (e) => {
    e.preventDefault();
  }
}

export default observer(PaymentsOfOneMonth);
