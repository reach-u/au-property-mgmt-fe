import React, {Component, Fragment} from 'react';

import './navigation.scss';
import './registry/registry.scss';
import './registry/results.css';
import './payments.scss';
import {observer} from 'mobx-react';
import {Classes, NonIdealState, ProgressBar} from "@blueprintjs/core";
import PaymentsOfMonth from "./PaymentsOfMonth";

class PaymentsList extends Component {

  componentDidMount() {
    this.props.authstore.fetchUserTransactionsAndPayments();
  }

  render() {
    const {authstore} = this.props;
    let allPayments = authstore.userPayments;

    if (allPayments.length > 0) {
      return (
        <Fragment>
          <div className="payment-container">
            <div className="payment-table-container">
              <table className={[Classes.HTML_TABLE_STRIPED, Classes.HTML_TABLE].join(' ')}>
                {this.renderTableHeader()}
                {this.renderTableContent(allPayments)}
                {this.renderTableFooter(allPayments)}
              </table>
            </div>
          </div>
        </Fragment>
      )
    } else if (authstore.loading) {
      return (
        <div style={{position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 2000}}>
          <ProgressBar intent="primary"/>
        </div>
      );
    } else {
      return (
        <NonIdealState
          icon="swap-horizontal"
          title="No payments"
          description="You have no payments at this point of time."
        />
      );
    }
  }

  renderTableContent(allPayments) {
    return allPayments.map((month, key) =>
      <PaymentsOfMonth
        month={month}
        {...this.props}
        key={key}
      />);
  }

  renderTableFooter = (allPayments) => {
    let listOfAllPayments = [].concat.apply([], allPayments.map(item => item.payments));
    let unpaidPayments = listOfAllPayments.filter(payment => !payment.paid);
    let sumOfAllPayments = this.calculateSumOfPayments(listOfAllPayments);
    let sumOfAllUnpaidPayments = this.calculateSumOfPayments(unpaidPayments);

    return (
      <tbody key="total-row">
      <tr className="total-row">
        <td className="color-to-white"/>
        <td title="Total" className="text-row bold color-to-white">Total</td>
        <td title="Planned amount" className="bold color-to-white">{sumOfAllPayments.toLocaleString('en-US')}</td>
        <td title="Paid amount" className="bold color-to-white">{(sumOfAllPayments - sumOfAllUnpaidPayments).toLocaleString('en-US')}</td>
        <td title="Missing amount" className="bold color-to-white">{sumOfAllUnpaidPayments.toLocaleString('en-US')}</td>
        <td className="color-to-white"/>
      </tr>
      </tbody>
    );
  };

  calculateSumOfPayments = (payments) => {
    return payments.map(payment => payment.payable).reduce((a, b) => a + b, 0);
  };

  renderTableHeader = () => {
    return (
      <thead>
      <tr>
        <th className="text-row"/>
        <th className="text-row">Month</th>
        <th>Amount planned ($)</th>
        <th>Amount paid ($)</th>
        <th>Amount missing ($)</th>
        <th/>
      </tr>
      </thead>
    );
  };
}

export default observer(PaymentsList);
