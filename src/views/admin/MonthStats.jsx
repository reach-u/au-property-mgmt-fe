import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';

import '../navigation.scss';
import '../registry/registry.scss';
import '../registry/results.css';
import './monthlystats.scss';
import school from '../../assets/baseline-school-24px.svg';
import {observer} from 'mobx-react';
import api from '../../config/API';
import {Classes, Icon} from "@blueprintjs/core";
import {BarChart, d3} from 'react-d3-components';
import {ReminderButton} from "../../components/ReminderButton";

class MonthStats extends Component {

  state = {
    taxInfoList: []
  };

  handleResize() {
    let elem = ReactDOM.findDOMNode(this);
    let width = elem.offsetWidth;

    this.setState({
      parentWidth: width
    });
  }

  componentDidMount() {
    fetch(`${window.location.origin}/${api.getLandTaxMonthlyStats()}`)
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json()
        })
        .then(data => {
          data.forEach(function (monthlyTaxData) {
            monthlyTaxData.expanded = false;
            monthlyTaxData.indebtedOwners.forEach(
                function (debtorMonthlyData) {
                  debtorMonthlyData.isAddressesExpanded = false;
                }
            );
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
                {this.renderTableHeader()}
                {this.state.taxInfoList.map((taxInfo, index) => (
                    [
                      <tbody key={index}>
                      {this.renderTableDataRow(taxInfo)}
                      </tbody>,
                      this.renderTableExpandedRows(taxInfo, authstore)
                    ]
                ))}
                {this.renderTableFooter(total)}
              </table>
            </div>
            <div className="monthly-charts-container">
              {this.renderBarChart()}
            </div>
          </div>
        </Fragment>
    )
  }

  renderTableFooter = (total) => {
    return (
        <tbody key="total-row">
        <tr className="total-row main-table-row">
          <td className="main-table-row"/>
          <td title="Total" className="text-row main-table-row">
            Total
          </td>
          <td title="Total amount" className="main-table-row">
            {total.plannedAmount.toLocaleString()}
          </td>
          <td title="Amount paid" className="main-table-row">
            {total.paidAmount.toLocaleString()}
          </td>
          <td title="Amount due" className="main-table-row">
            {total.missingAmount.toLocaleString()}
          </td>
        </tr>
        </tbody>
    );
  };


  renderTableHeader = () => {
    return (
        <thead>
        <tr>
          <th className="text-row">
            Debtors
          </th>
          <th className="text-row">
            Month
          </th>
          <th>
            Total amount (USD)
          </th>
          <th>
            Amount paid (USD)
          </th>
          <th>
            Amount due (USD)
          </th>
        </tr>
        </thead>
    );
  };

  renderTableDataRow = (taxInfo) => {
    return (
        <tr key={taxInfo.name} className="main-table-row">
          <td className="text-row main-table-row">
            {taxInfo.missingAmount > 0 &&
            <span className="open-debtors" onClick={() => this.handleExpandDebtorsTable(taxInfo)}
                  title="Expand">
                            <Icon icon={taxInfo.expanded ? "chevron-down" : "chevron-right"}/>
                        </span>
            }
          </td>
          <td title="Month" className="text-row main-table-row">
            {taxInfo.name}
          </td>
          <td title="Total amount" className="main-table-row">
            {taxInfo.plannedAmount.toLocaleString()}
          </td>
          <td title="Amount paid" className="main-table-row">
            {taxInfo.paidAmount.toLocaleString()}
          </td>
          <td title="Amount due" className="main-table-row">
            {taxInfo.missingAmount.toLocaleString()}
          </td>
        </tr>);
  };

  renderTableExpandedRows = (taxInfo, authstore) => {
    let indebtedOwners = taxInfo.indebtedOwners;
    let debtorAddresses = taxInfo.debtorAddresses;

    let rowArray = [
      this.renderExpandedOwnersHeader(taxInfo)
    ];

    indebtedOwners.map(owner =>
        [rowArray.push(
            this.renderExpandedOwnersContent(authstore, taxInfo, owner)
        ),
          rowArray.push(
              this.renderExpandedPropertiesHeader(owner)
          ),
          rowArray.push(debtorAddresses[owner.name].map(address =>
              this.renderExpandedPropertiesContent(owner, address)
          ))
        ]
    );

    return (<tbody key={taxInfo.name + '_tbody'}>{rowArray}</tbody>)
  };

  renderExpandedPropertiesContent = (owner, address) => {
    return (
        <tr key={address.id} className={owner.isAddressesExpanded ? "show-row" : "hide-row"}>
          <td>
          </td>
          <td className="text-row">
            {address.detailedData.buildingType === 'School' ? (
                <img src={school} alt="School"/>
            ) : address.detailedData.buildingType === 'Apartment building' ? (
                <Icon icon="office" iconSize={20} className="table-icon"/>
            ) : (
                <Icon icon="home" iconSize={20} className="table-icon"/>
            )} {address.street} {address.house}{address.apartment ? `-${address.apartment}` : ''}
          </td>
          <td className="text-row">
            {address.house}, {address.street}, {address.county}, {address.country}
          </td>
          <td>{address.detailedData.landTaxValue.toLocaleString()}</td>
          <td/>
        </tr>);
  };

  renderExpandedPropertiesHeader = (owner) => {
    return (<tr key={owner.name + '_properties'}
                className={owner.isAddressesExpanded ? "show-row" : "hide-row"}>
      <th/>
      <th className="text-row">
        Property
      </th>
      <th className="text-row">
        Address
      </th>
      <th>Amount due (USD)</th>
      <th/>
    </tr>);
  };

  renderExpandedOwnersHeader = (taxInfo) => {
    return (<tr key={taxInfo.name + '_expanded'} className={taxInfo.expanded ? "show-row" : "hide-row"}>
      <th className="text-row main-table-row">
      </th>
      <th className="text-row main-table-row">
        Owner name
      </th>
      <th className="main-table-row">
        Amount paid (USD)
      </th>
      <th className="main-table-row">
        Amount due (USD)
      </th>
      <th className="main-table-row">
        Send reminder
      </th>
    </tr>);
  };

  renderExpandedOwnersContent = (authstore, taxInfo, owner) => {
    return (
        <tr key={owner.name + '_owner'} className={taxInfo.expanded ? "show-row" : "hide-row"}>
          <td className="text-row main-table-row">
                        <span className="open-addresses open-debtors" onClick={() => this.handleExpandAddressesTable(taxInfo, owner)}
                              title="Expand">
                            <Icon icon={owner.isAddressesExpanded ? "chevron-down" : "chevron-right"}/>
                        </span>
          </td>
          <td className="text-row main-table-row">
            {authstore.getUsernameById(owner.name)}
          </td>
          <td className="main-table-row">
            {owner.paidAmount.toLocaleString()}
          </td>
          <td className="main-table-row">
            {owner.missingAmount.toLocaleString()}
          </td>
          <td className="main-table-row">
            <ReminderButton/>
          </td>
        </tr>
    );
  };

  handleExpandAddressesTable = (taxInfo, owner) => {
    let taxInfoIndex = this.state.taxInfoList.indexOf(taxInfo);
    if (taxInfoIndex !== -1) {
      let ownerIndex = this.state.taxInfoList[taxInfoIndex].indebtedOwners.indexOf(owner);
      owner.isAddressesExpanded = !owner.isAddressesExpanded;
      let taxInfoList = this.state.taxInfoList;
      taxInfoList[taxInfoIndex].indebtedOwners[ownerIndex] = owner;
      this.setState({taxInfoList: taxInfoList});
    }
  };

  handleExpandDebtorsTable = taxInfo => {
    let index = this.state.taxInfoList.indexOf(taxInfo);
    if (index !== -1) {
      taxInfo.expanded = !taxInfo.expanded;
      if (!taxInfo.expanded) {
        taxInfo.indebtedOwners.forEach(
            owner => {
              owner.isAddressesExpanded = false;
            }
        );
      }
      let taxInfoList = this.state.taxInfoList;
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
        .range(["#00AAAD", "#FF495B"]);

    let tooltip = function (name, previousValue, currentValue) {
      return currentValue;
    };


    let barChartWidth = this.state.parentWidth > 1380 ? 700 : this.state.parentWidth - 40;

    return (
      <Fragment>
        <h2>Monthly paid and missing amounts</h2>
        <div className="chart">
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
              <p><span className="key-dot paid"/>Paid</p>
            </div>
            <div className="legend">
              <p><span className="key-dot unpaid"/>Unpaid</p>
            </div>
          </div>
        </div>
      </Fragment>
    );
  };
}

export default observer(MonthStats);
