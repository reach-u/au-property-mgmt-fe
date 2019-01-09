import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Icon} from "@blueprintjs/core";

class PaymentsOfOneMonth extends Component {
  state = {
    expanded: true
  };

  render() {
    const { month, authstore } = this.props;

    return [
      <tbody>
      {this.renderTableDataRow(month)}
      </tbody>,
      this.renderTableExpandedRows(month, authstore)
    ]
  }

  renderTableDataRow = (month) => {
    let allPayments = month.payments;
    let unpaidPayments = allPayments.filter(payment => !payment.paid);
    let sumOfAllPayments = this.sumOfPayments(allPayments);
    let sumOfUnpaidPayments = this.sumOfPayments(unpaidPayments);

    return (
      <tr>
        <td className="text-row">
          {sumOfUnpaidPayments > 0 &&
          <span className="open-debtors" onClick={() => this.handleExpandDebtorsTable(month.monthName)} title="Expand">
            <Icon icon={this.state.expanded ? "chevron-down" : "chevron-right"}/>
          </span>}
        </td>
        <td title="Month name" className="text-row">
          {month.monthName}
        </td>
        <td title="Planned amount">
          {sumOfAllPayments.toLocaleString('en-US')}
        </td>
        <td title="Paid amount">
          {(sumOfAllPayments - sumOfUnpaidPayments).toLocaleString('en-US')}
        </td>
        <td title="Missing amount">
          {sumOfUnpaidPayments.toLocaleString('en-US')}
        </td>
      </tr>);
  };

  sumOfPayments = (payments) => {
    return payments.map(payemnt => payemnt.payable).reduce((a, b) => a + b, 0);
  };

  renderTableExpandedRows = (month) => {
    let payments = month.payments;

    let rowArray = [
      <tr className={this.state.expanded ? "show-row" : "hide-row"}>
        <th className="text-row">Address</th>
        <th>Amount paid</th>
        <th>Amount missing</th>
        <th/>
      </tr>
    ];

    payments.map(payment =>
      [rowArray.push(
        <tr className={this.state.expanded ? "show-row" : "hide-row"}>
          <td className="text-row">
            {`${payment.address.street} ${payment.address.house}${
              payment.address.apartment ? `-${payment.address.apartment}` : ''
              }`}
          </td>
          <td>
            {payment.payable.toLocaleString('en-US')}
          </td>
          <td>
            {payment.payable.toLocaleString('en-US')}
          </td>
          <td>
            <button className="reminder-button" onClick={() => this.handleReminderButtonClick()}>Pay</button>
          </td>
        </tr>
      )]
    );

    return (<tbody>{rowArray}</tbody>);
  };
}

export default observer(PaymentsOfOneMonth);
