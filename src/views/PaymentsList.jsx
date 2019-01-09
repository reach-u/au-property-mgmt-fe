import React, {Component, Fragment} from 'react';

import './navigation.scss';
import './registry/registry.scss';
import './registry/results.css';
import './payments.scss';
import {observer} from 'mobx-react';
import {Classes} from "@blueprintjs/core";
import PaymentsOfOneMonth from "./PaymentsOfOneMonth";

class PaymentsList extends Component {
  componentDidMount() {
    this.props.authstore.fetchUserTransactionsAndPayments();
  }

  render() {
    const {authstore} = this.props;
    let allPayments = authstore.userPayments;

    return (
      <Fragment>
        <div className="monthly-tax-container">
          <div className="monthly-tax-table-container">
            <table
              className={[Classes.HTML_TABLE_STRIPED, Classes.HTML_TABLE].join(' ')}>
              {this.renderTableHeader()}
              {this.renderTableContent(allPayments)}
              {this.renderTableFooter(allPayments)}
            </table>
          </div>
        </div>
      </Fragment>
    )
  }

  renderTableContent(allPayments) {
    return allPayments.map((month, index) =>
      <PaymentsOfOneMonth
        month={month}
        key={index}
        {...this.props}
      />);
  }

  renderTableFooter = (allPayments) => {
    let listOfAllPayments = allPayments.map(month => month.payments);
    let unpaidPayments = allPayments.filter(payment => payment.paid);
    let sumOfAllPayments = listOfAllPayments.map(payment => payment.payable).reduce((a, b) => a + b, 0);
    let sumOfAllUnpaidPayments = unpaidPayments.map(payment => payment.payable).reduce((a, b) => a + b, 0);

    return (
      <tbody key="total-row">
      <tr className="total-row">
        <td/>
        <td title="Total" className="text-row">Total</td>
        <td title="planned amount">{sumOfAllPayments.toLocaleString('en-US')}</td>
        <td title="paid amount">{(sumOfAllPayments - sumOfAllUnpaidPayments).toLocaleString('en-US')}</td>
        <td title="missing amount">{sumOfAllUnpaidPayments.toLocaleString('en-US')}</td>
      </tr>
      </tbody>
    );
  };

  renderTableHeader = () => {
    return (
      <thead>
      <tr>
        <th className="text-row"/>
        <th className="text-row">Month</th>
        <th>Amount (planned)</th>
        <th>Amount paid</th>
        <th>Amount missing</th>
      </tr>
      </thead>
    );
  };
}

export default observer(PaymentsList);
