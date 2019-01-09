import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Icon, Spinner} from "@blueprintjs/core";
import PaymentOfProperty from "./PaymentOfProperty";
import api from "../config/API";

class PaymentsOfMonth extends Component {

  state = {
    expanded: this.props.authstore.openedPaymentRows.includes(this.props.month.monthName),
    payAllButtonLoading: false
  };

  render() {
    const {month} = this.props;

    return [
      <tbody>
      {this.renderTableDataRow(month)}
      </tbody>,
      this.renderTableExpandedRows(month)
    ]
  }

  renderTableDataRow = (month) => {
    let allPayments = month.payments;
    let unpaidPayments = allPayments.filter(payment => !payment.paid);
    let sumOfAllPayments = this.sumOfPayments(allPayments);
    let sumOfUnpaidPayments = this.sumOfPayments(unpaidPayments);
    let monthName = month.monthName;

    return (
      <tr>
        <td className="text-row color-to-white">
          {sumOfUnpaidPayments > 0 &&
          <span className="open-debtors" onClick={this.toggleRow(month.monthName)} title="Expand">
            <Icon icon={this.state.expanded ? "chevron-down" : "chevron-right"}/>
          </span>}
        </td>
        <td title="Month name" className="text-row color-to-white">
          {month.monthName}
        </td>
        <td title="Planned amount" className="color-to-white">
          {sumOfAllPayments.toLocaleString('en-US')}
        </td>
        <td title="Paid amount" className="color-to-white">
          {(sumOfAllPayments - sumOfUnpaidPayments).toLocaleString('en-US')}
        </td>
        <td title="Missing amount" className="color-to-white">
          {sumOfUnpaidPayments.toLocaleString('en-US')}
        </td>
        <td title="Pay all" className="button-row color-to-white">
          {sumOfUnpaidPayments > 0 &&
          <button className="pay-button" onClick={this.handlePayAll(unpaidPayments, monthName)}>
            PAY ALL
            {this.state.payAllButtonLoading
              ? <Spinner className="loading-spinner" size={12}/>
              : <Icon icon='dollar'/>}
          </button>}
        </td>
      </tr>);
  };

  sumOfPayments = (payments) => {
    return payments.map(payemnt => payemnt.payable).reduce((a, b) => a + b, 0);
  };

  renderTableExpandedRows = (month) => {
    let payments = month.payments;

    let rowArray = [
      <tr key={month.monthName} className={this.state.expanded ? "show-row" : "hide-row"}>
        <th/>
        <th className="text-row">Address</th>
        <th>Due date</th>
        <th/>
        <th>Amount ($)</th>
        <th/>
      </tr>
    ];

    payments.map((payment, index) =>
      [rowArray.push(
        <PaymentOfProperty
          payment={payment}
          expanded={this.state.expanded}
          key={index}
          {...this.props}
        />
      )]
    );

    return (<tbody>{rowArray}</tbody>);
  };

  toggleRow = (month) => () => {
    this.setState({
      expanded: !this.state.expanded
    });

    this.props.authstore.handleNewOpenedPaymentRow(month);
  };

  handlePayAll = (payments, month) => () => {
    this.setState({
      payAllButtonLoading: true
    });

    payments.forEach(payment => this.payLandTax(payment.id, month));
  };

  payLandTax = (id, month) => {
    fetch(`${window.location.origin}/${api.payLandTax(id)}`, {method: 'POST'})
      .then(response => response.json())
      .then(payment => {
        setTimeout(() => {
          this.props.authstore.fetchUserTransactionsAndPayments();
          this.props.authstore.removeFromOpenedPaymentRows(month);
        }, 2000)
      });
  }
}

export default observer(PaymentsOfMonth);
