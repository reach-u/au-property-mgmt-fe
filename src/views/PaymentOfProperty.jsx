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
        <td className="white-td"/>
        <td className="text-row address-td">
          {`${payment.address.street} ${payment.address.house}${
            payment.address.apartment ? `-${payment.address.apartment}` : ''
            }`}
        </td>
        <td>
          {formatDate(payment.dueDate)}
        </td>
        <td>
            {this.getPaidAmount(payment)}
        </td>
        <td>
          {this.getDueAmount(payment)}
        </td>
        <td className="button-row">
          {!payment.paid
            ? <button className="pay-button" onClick={this.handleSinglePay}>
              Pay
              {this.state.payButtonLoading
                ? <Spinner className="loading-spinner" size={12}/>
                : <Icon icon='dollar'/>}
            </button>
            : <span className="paid-button">Paid</span>}
        </td>
      </tr>
    )
  }

    getPaidAmount(payment) {
        return payment.paid ? payment.payable.toLocaleString('en-US') : 0;
    }

    getDueAmount(payment) {
        return !payment.paid ? payment.payable.toLocaleString('en-US') : 0;
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
