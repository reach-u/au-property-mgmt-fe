import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {NonIdealState, ProgressBar} from '@blueprintjs/core';
import "./payments.scss";
import PaymentsOfOneMonth from "./PaymentsOfOneMonth";

class PaymentsList extends Component {

  render() {
    const {authstore} = this.props;
    const activePayments = authstore.userPayments.length > 0;

    if (activePayments) {
      return (
        <div className="payment-table">
          <table className="table-container">
            <tr className="main-table-header">
              <th/>
              <th>Month</th>
              <th>Number of Properties</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Unpaid</th>
              <th/>
            </tr>
            {authstore.userPayments.map((item, index) =>
              <PaymentsOfOneMonth
                month={item}
                key={index}
                {...this.props}
              />
            )}
          </table>
        </div>
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
          description="You have no history of payments."
        />
      );
    }
  }

  componentDidMount() {
    this.props.authstore.fetchUserTransactionsAndPayments();
  }
}

export default observer(PaymentsList);
