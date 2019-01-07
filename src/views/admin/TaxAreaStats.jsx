import React, {Component, Fragment} from 'react';

import '../navigation.scss';
import '../registry/registry.scss';
import '../registry/results.css';
import './taxareastats.scss';
import api from '../../config/API';
import {observer} from 'mobx-react';
import {Classes} from "@blueprintjs/core";
import {BarChart, d3, PieChart} from 'react-d3-components';

class TaxAreaStats extends Component {

    constructor(props) {
        super(props);
        this.state = {
            taxInfoList: []
        };
    }

    componentDidMount() {
        fetch(`${window.location.origin}/${api.getLandTaxAreaStats()}`)
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json()
            })
            .then(data => {
                this.setState({taxInfoList: data})
            })
            .catch(error => {
                console.error(error);
            });
    }

    render() {
        let total = this.calculateTotal();
        return (
            <Fragment>
                <div className="tax-area-container">
                    <div className="tax-area-table-container">
                        <table
                            className={[Classes.HTML_TABLE_STRIPED, Classes.HTML_TABLE].join(' ')}>
                            <thead>
                            <tr>
                                <th>
                                    Zone Name
                                </th>
                                <th>
                                    m<sup>2</sup> plan
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
                                    <td title="Zone name">
                                        {taxInfo.name}
                                    </td>
                                    <td title="m2 plan">
                                        {taxInfo.numberOfSquareMeters}
                                    </td>
                                    <td title="planned amount">
                                        {taxInfo.plannedAmount}
                                    </td>
                                    <td title="paid amount">
                                        {taxInfo.paidAmount}
                                    </td>
                                    <td title="missing amount">
                                        {taxInfo.missingAmount}
                                    </td>
                                </tr>
                            ))}
                            <tr className="total-row">
                                <td title="Total">
                                    Total
                                </td>
                                <td title="m2 plan">
                                    {total.numberOfSquareMeters}
                                </td>
                                <td title="planned amount">
                                    {total.plannedAmount}
                                </td>
                                <td title="paid amount">
                                    {total.paidAmount}
                                </td>
                                <td title="missing amount">
                                    {total.missingAmount}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="charts-container">
                        {this.renderBarChart()}
                        {this.renderPieChart()}
                    </div>
                </div>
            </Fragment>
        )
    }

    calculateTotal = () => {
        const initialValue = {
            numberOfSquareMeters: 0,
            plannedAmount: 0,
            paidAmount: 0,
            missingAmount: 0
        };

        let total = this.state.taxInfoList.reduce((a, b) => (
            {
                numberOfSquareMeters: a.numberOfSquareMeters + b.numberOfSquareMeters,
                plannedAmount: a.plannedAmount + b.plannedAmount,
                paidAmount: a.paidAmount + b.paidAmount,
                missingAmount: a.missingAmount + b.missingAmount
            }), initialValue);
        total.name = "Total";
        return total;
    };

    renderBarChart = () => {
        let newArray = [...this.state.taxInfoList, this.calculateTotal()];
        let paidValues = newArray.map(taxInfo => ({x: taxInfo.name, y: taxInfo.paidAmount}));
        let unPaidValues = newArray.map(taxInfo => ({x: taxInfo.name, y: taxInfo.missingAmount}));

        console.log(paidValues);
        console.log(unPaidValues);

        let color = d3.scale.ordinal()
            .domain(["Paid", "Missing"])
            .range(["#00CA75", "#FF495B"]);

        let data = [{
            label: 'Paid',
            values: paidValues
        },
            {
                label: 'Missing',
                values: unPaidValues
            }];

        return (
            <div className="chart">
                <BarChart
                    data={data}
                    colorScale={color}
                    width={700}
                    height={400}
                    margin={{top: 10, bottom: 50, left: 90, right: 10}}/>
                <div className="legend">
                    <p><span className="key-dot paid"></span>Paid</p>
                </div>
                <div className="legend">
                    <p><span className="key-dot unpaid"></span>Unpaid</p>
                </div>
            </div>
        );
    };

    renderPieChart() {
        let data = {
            // label: 'somethingA',
            values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
        };

        let tooltip = function (name) {
            return name;
        };

        return (
            <div className="chart">
                <PieChart
                    data={data}
                    hideLabels={true}
                    tooltipHtml={tooltip}
                    width={400}
                    height={400}
                    margin={{top: 10, bottom: 10, left: 100, right: 100}}
                />
            </div>
        );
    };
}

export default observer(TaxAreaStats);