import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';

import './navigation.scss';
import './registry/registry.scss';
import './registry/results.css';
import './admin/monthlystats.scss';
import school from './../assets/baseline-school-24px.svg';
import {observer} from 'mobx-react';
import api from './../config/API';
import {Icon, Classes} from "@blueprintjs/core";
import {BarChart, d3} from 'react-d3-components';

class PaymentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taxInfoList: []
    };
  }

  handleResize(e) {
    let elem = ReactDOM.findDOMNode(this);
    let width = elem.offsetWidth;

    this.setState({
      parentWidth: width
    });
  }

  componentDidMount() {
    fetch(`${window.location.origin}/${api.getLandTaxMonthlyStats()}`)
      .then(response => response.json()
      )
      .then(data => {
        data.forEach(function (monthlyTaxData) {
          monthlyTaxData.expanded = false;
          monthlyTaxData.indebtedOwners.forEach(function (debtorMonthlyData) {
            debtorMonthlyData.isAddressesExpanded = false;
          });
        });
        this.setState({taxInfoList: data})
      })
      .catch(error => {
        console.error(error);
      });
    this.handleResize();
  }

  render() {
    let total = this.calculateTotal();
    const {authstore} = this.props;

    return (
      <Fragment>
        <div className="monthly-tax-container">
          <div className="monthly-tax-table-container">
            <table
              className={[Classes.HTML_TABLE_STRIPED, Classes.HTML_TABLE].join(' ')}>
              <thead>
              <tr>
                <th className="text-row">
                  Debtors
                </th>
                <th className="text-row">
                  Month
                </th>
                <th>
                  Amount (plan)
                </th>
                <th>
                  Amount paid
                </th>
                <th>
                  Amount missing
                </th>
              </tr>
              </thead>
              {this.state.taxInfoList.map((taxInfo, index) => (
                [<tbody key={index}>{this.getTableDataRow(taxInfo)}</tbody>,
                  this.getTableExpandedRows(taxInfo, authstore)
                ]

              ))}
              <tbody key="total-row">
              <tr className="total-row">
                <td>

                </td>
                <td title="Total" className="text-row">
                  Total
                </td>
                <td title="planned amount">
                  {total.plannedAmount.toLocaleString('en-US')}
                </td>
                <td title="paid amount">
                  {total.paidAmount.toLocaleString('en-US')}
                </td>
                <td title="missing amount">
                  {total.missingAmount.toLocaleString('en-US')}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div className="monthly-charts-container">
            {this.renderBarChart()}
          </div>
        </div>
      </Fragment>
    )
  }

  getTableDataRow = (taxInfo) => {
    return (
      <tr key={taxInfo.name}>
        <td className="text-row">
          {taxInfo.missingAmount > 0 &&
          <span className="open-debtors" onClick={() => this.handleExpandDebtorsTable(taxInfo)} title="Expand">
                            <Icon icon={taxInfo.expanded ? "chevron-down" : "chevron-right"}/>
                        </span>
          }
        </td>
        <td title="Month name" className="text-row">
          {taxInfo.name}
        </td>
        <td title="planned amount">
          {taxInfo.plannedAmount.toLocaleString('en-US')}
        </td>
        <td title="paid amount">
          {taxInfo.paidAmount.toLocaleString('en-US')}
        </td>
        <td title="missing amount">
          {taxInfo.missingAmount.toLocaleString('en-US')}
        </td>
      </tr>);
  };

  getTableExpandedRows = (taxInfo, authstore) => {
    var indebtedOwners = taxInfo.indebtedOwners;
    var debtorAddresses = taxInfo.debtorAddresses;

    var rowArray = [
      <tr key={taxInfo.name + '_expanded'} className={taxInfo.expanded ? "show-row" : "hide-row"}>
        <th className="text-row">
          Properties
        </th>
        <th className="text-row">
          Owner name
        </th>
        <th>
          Amount paid
        </th>
        <th>
          Amount missing
        </th>
        <th>
          Send reminder
        </th>
      </tr>
    ];

    indebtedOwners.map(owner =>
      [rowArray.push(
        <tr key={owner.name + '_owner'} className={taxInfo.expanded ? "show-row" : "hide-row"}>
          <td className="text-row">
                        <span className="open-addresses" onClick={() => this.handleExpandAddressesTable(taxInfo, owner)}
                              title="Expand">
                            <Icon icon={owner.isAddressesExpanded ? "chevron-down" : "chevron-right"}/>
                        </span>
          </td>
          <td className="text-row">
            {authstore.getUsernameById(owner.name)}
          </td>
          <td>
            {owner.paidAmount.toLocaleString('en-US')}
          </td>
          <td>
            {owner.missingAmount.toLocaleString('en-US')}
          </td>
          <td>
            <button className="reminder-button" onClick={() => this.handleReminderButtonClick()}>Send reminder</button>
          </td>
        </tr>
      ),
        rowArray.push(
          <tr key={owner.name + '_properties'} className={owner.isAddressesExpanded ? "show-row" : "hide-row"}>
            <th></th>
            <th className="text-row">
              Property
            </th>
            <th className="text-row">
              Address
            </th>
            <th>Amount missing</th>
            <th></th>
          </tr>
        ),
        rowArray.push(debtorAddresses[owner.name].map(address =>
          <tr key={address.id} className={owner.isAddressesExpanded ? "show-row" : "hide-row"}>
            <td>
              {address.detailedData.buildingType === 'School' ? (
                <img src={school} alt="School"/>
              ) : address.detailedData.buildingType === 'Apartment building' ? (
                <Icon icon="office" iconSize={20} className="table-icon"/>
              ) : (
                <Icon icon="home" iconSize={20} className="table-icon"/>
              )}
            </td>
            <td className="text-row">
              {address.street} {address.house}{address.apartment ? `-${address.apartment}` : ''}
            </td>
            <td className="text-row">
              {address.house}, {address.street}, {address.county}, {address.country}
            </td>
            <td>{address.detailedData.landTaxValue.toLocaleString('en-US')}</td>
            <td></td>
          </tr>
        ))
      ]
    );

    return (<tbody key={taxInfo.name + '_tbody'}>{rowArray}</tbody>)
  }

  handleExpandAddressesTable = (taxInfo, owner) => {
    var taxInfoIndex = this.state.taxInfoList.indexOf(taxInfo);
    if (taxInfoIndex !== -1) {
      var ownerIndex = this.state.taxInfoList[taxInfoIndex].indebtedOwners.indexOf(owner);
      owner.isAddressesExpanded = !owner.isAddressesExpanded;
      var taxInfoList = this.state.taxInfoList;
      taxInfoList[taxInfoIndex].indebtedOwners[ownerIndex] = owner;
      this.setState({taxInfoList: taxInfoList});
    }
  };

  handleExpandDebtorsTable = taxInfo => {
    var index = this.state.taxInfoList.indexOf(taxInfo);
    if (index !== -1) {
      taxInfo.expanded = !taxInfo.expanded;
      if (!taxInfo.expanded) {
        taxInfo.indebtedOwners.forEach(
          owner => {
            owner.isAddressesExpanded = false;
          }
        );
      }
      var taxInfoList = this.state.taxInfoList;
      taxInfoList[index] = taxInfo;
      this.setState({taxInfoList: taxInfoList});
    }
  };

  calculateTotal = () => {
    const initialValue = {
      plannedAmount: 0,
      paidAmount: 0,
      missingAmount: 0
    };

    let total = this.state.taxInfoList.reduce((a, b) => (
      {
        plannedAmount: a.plannedAmount + b.plannedAmount,
        paidAmount: a.paidAmount + b.paidAmount,
        missingAmount: a.missingAmount + b.missingAmount
      }), initialValue);
    total.name = "Total";
    return total;
  };

  renderBarChart = () => {
    if (this.state.taxInfoList === undefined || this.state.taxInfoList.length === 0) {
      return null;
    }

    let paidValues = this.state.taxInfoList.map(taxInfo => ({x: taxInfo.name, y: taxInfo.paidAmount}));
    let unPaidValues = this.state.taxInfoList.map(taxInfo => ({x: taxInfo.name, y: taxInfo.missingAmount}));

    let data = [{
      label: 'Paid',
      values: paidValues
    },
      {
        label: 'Missing',
        values: unPaidValues
      }];

    let color = d3.scale.ordinal()
      .domain(["Paid", "Missing"])
      .range(["#098BBA", "#FF495B"]);

    let tooltip = function (name, previousValue, currentValue) {
      return currentValue;
    };


    var barChartWidth = this.state.parentWidth > 1380 ? 700 : this.state.parentWidth;

    return (
      <div className="chart">
        <h2>Monthly paid and missing amounts</h2>
        <BarChart
          data={data}
          colorScale={color}
          width={barChartWidth}
          height={400}
          tooltipHtml={tooltip}
          margin={{top: 5, bottom: 75, left: 80, right: 10}}
          xAxis={{tickDirection: 'diagonal'}}
        />
        <div className="legends">
          <div className="legend">
            <p><span className="key-dot paid"></span>Paid</p>
          </div>
          <div className="legend">
            <p><span className="key-dot unpaid"></span>Unpaid</p>
          </div>
        </div>
      </div>
    );
  };
}

export default observer(PaymentsList);
