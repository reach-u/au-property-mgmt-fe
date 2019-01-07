import React, { Component, Fragment } from 'react';

import '../navigation.scss';
import '../registry/registry.scss';
import './monthlystats.scss';
import { observer } from 'mobx-react';
import api from '../../config/API';
import { Classes } from "@blueprintjs/core";
import { BarChart, d3 } from 'react-d3-components';

class MonthStats extends Component {

    constructor(props) {
        super(props);
        this.state = {
            taxInfoList: []
        };
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
                this.setState({ taxInfoList: data })
            })
            .catch(error => {
                console.error(error);
            });
    }

    render() {
        let total = this.calculateTotal();
        return (
            <Fragment>
                <div className="monthly-tax-container">
                    <div className="monthly-tax-table-container">
                        <table
                            className={[Classes.HTML_TABLE_STRIPED, Classes.HTML_TABLE].join(' ')}>
                            <thead>
                                <tr>
                                    <th>
                                        Month name
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
                            <tbody>
                                {this.state.taxInfoList.map((taxInfo, index) => (
                                    <tr key={index}>
                                        <td title="Month name">
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
                                    </tr>
                                ))}
                                <tr className="total-row">
                                    <td title="Total">
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

        let paidValues = this.state.taxInfoList.map(taxInfo => ({ x: taxInfo.name, y: taxInfo.paidAmount }));
        let unPaidValues = this.state.taxInfoList.map(taxInfo => ({ x: taxInfo.name, y: taxInfo.missingAmount }));

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
            .range(["#008C8C", "#FF495B"]);

        let tooltip = function (name, previousValue, currentValue) {
            return currentValue;
        };

        return (
            <div className="chart">
                <h2>Monthly paid and missing amounts</h2>
                <BarChart
                    data={data}
                    colorScale={color}
                    width={700}
                    height={400}
                    tooltipHtml={tooltip}
                    margin={{ top: 10, bottom: 75, left: 90, right: 10 }}
                    xAxis={{ tickDirection: 'diagonal' }}
                />
                <div className="legend">
                    <p><span className="key-dot paid"></span>Paid</p>
                </div>
                <div className="legend">
                    <p><span className="key-dot unpaid"></span>Unpaid</p>
                </div>
            </div>
        );
    };
}

export default observer(MonthStats);
