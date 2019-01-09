import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Icon, Spinner} from "@blueprintjs/core";
import {formatDate} from "../utils/date";
import api from "../config/API";


class PaymentOfProperty extends Component {
  state = {
    payButtonLoading: false
  };

  render() {
    const { payment, expanded} = this.props;

    return (
      <tr className={expanded ? "show-row" : "hide-row"}>
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
            ? <button className="pay-button" onClick={this.handleSinglePay}>
              PAY
              {this.state.payButtonLoading
                ? <Spinner className="loading-spinner" size={12}/>
                : <Icon icon='dollar'/>}
            </button>
            : <span className="paid">Paid</span>}
        </td>
      </tr>
    )
  }

  handleSinglePay = () => {
    this.setState({
      payButtonLoading: true
    });

    let paymentId = this.props.payment.id;
    this.payLandTax(paymentId);
  };

  payLandTax = (id) => {
    fetch(`${window.location.origin}/${api.payLandTax(id)}`, {method: 'POST'})
      .then(response => response.json())
      .then(payment => {
        setTimeout(() => {
          this.props.authstore.fetchUserTransactionsAndPayments();
        }, 2000)
      });
  };
}

export default observer(PaymentOfProperty);
