import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Icon, Spinner} from "@blueprintjs/core";
import PaymentOfProperty from "./PaymentOfProperty";

class PaymentsOfMonth extends Component {

  state = {
    expanded: false,
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

    return (
      <tr>
        <td className="text-row color-to-white">
          {sumOfUnpaidPayments > 0 &&
          <span className="open-debtors" onClick={this.toggleRow} title="Expand">
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
          <button className="pay-button" onClick={this.handlePayAll(unpaidPayments)}>
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
        />
      )]
    );

    return (<tbody>{rowArray}</tbody>);
  };

  toggleRow = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  };

  handlePayAll = (payments) => () => {
    this.setState({
      payAllButtonLoading: true
    }, this.handleLoader);

    console.log(payments.map(payment => payment.id));
  };

  handleLoader = () => {
    setTimeout(() => {
      this.setState({
        payAllButtonLoading: false
      })
    }, 3000)
  }
}

export default observer(PaymentsOfMonth);
