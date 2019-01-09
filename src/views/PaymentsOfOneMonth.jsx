import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Icon} from "@blueprintjs/core";
import {formatDate} from "../utils/date";

class PaymentsOfOneMonth extends Component {

  state = {
    expanded: false
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

    return (
      <tr>
        <td className="text-row">
          {sumOfUnpaidPayments > 0 &&
          <span className="open-debtors" onClick={this.toggleRow} title="Expand">
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
        <td title="Pay all" className="button-row">
          {sumOfUnpaidPayments > 0 &&
          <button className="pay-button">PAY ALL</button>}
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
        <th/>
        <th className="text-row">Address</th>
        <th>Due date</th>
        <th/>
        <th>Amount ($)</th>
        <th/>
      </tr>
    ];

    payments.map(payment =>
      [rowArray.push(
        <tr className={this.state.expanded ? "show-row" : "hide-row"}>
          <td/>
          <td className="text-row">
            {`${payment.address.street} ${payment.address.house}${
              payment.address.apartment ? `-${payment.address.apartment}` : ''
              }`}
          </td>
          <td>
            {formatDate(payment.dueDate)}
          </td>
          <td/>
          <td>
            {payment.payable.toLocaleString('en-US')}
          </td>
          <td className="button-row">
            {!payment.paid
              ? <button className="pay-button" onClick={this.handleReminderButtonClick}>PAY</button>
              : "Paid"}
          </td>
        </tr>
      )]
    );

    return (<tbody>{rowArray}</tbody>);
  };

  toggleRow = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }
}

export default observer(PaymentsOfOneMonth);
