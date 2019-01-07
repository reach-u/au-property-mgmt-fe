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
        const showBarChart = window.innerWidth > 780;

        return (
            <Fragment>
                <div className="tax-area-container">
                    <div className="tax-area-table-container">
                        <table
                            className={[Classes.HTML_TABLE_STRIPED, Classes.HTML_TABLE].join(' ')}>
                            <thead>
                            <tr>
                                <th className="name-row">
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
                                    <td title="Zone name" className="name-row">
                                        {taxInfo.name}
                                    </td>
                                    <td title="m2 plan">
                                        {taxInfo.numberOfSquareMeters.toLocaleString()}
                                    </td>
                                    <td title="planned amount">
                                        {taxInfo.plannedAmount.toLocaleString()}
                                    </td>
                                    <td title="paid amount">
                                        {taxInfo.paidAmount.toLocaleString()}
                                    </td>
                                    <td title="missing amount">
                                        {taxInfo.missingAmount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            <tr className="total-row">
                                <td title="Total" className="name-row">
                                    Total
                                </td>
                                <td title="m2 plan">
                                    {total.numberOfSquareMeters.toLocaleString()}
                                </td>
                                <td title="planned amount">
                                    {total.plannedAmount.toLocaleString()}
                                </td>
                                <td title="paid amount">
                                    {total.paidAmount.toLocaleString()}
                                </td>
                                <td title="missing amount">
                                    {total.missingAmount.toLocaleString()}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="charts-container">
                        {showBarChart && this.renderBarChart()}
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

        let color = d3.scale.ordinal()
            .domain(["Paid", "Missing"])
            .range(["#008B8A", "#FF0A22"]);

        let data = [{
            label: 'Paid',
            values: paidValues
        },
            {
                label: 'Missing',
                values: unPaidValues
            }];

        let tooltip = function (name, previousValue, currentValue) {
            return currentValue.toLocaleString();
        };

        return (
            <div className="bar-chart chart">
                <h2>Paid amount and missing amount by zone</h2>
                <BarChart
                    data={data}
                    colorScale={color}
                    width={600}
                    height={400}
                    tooltipHtml={tooltip}
                    margin={{top: 10, bottom: 50, left: 90, right: 10}}/>
                <div className="legends">
                    <div className="legend">
                        <p><span className="key-dot paid"></span>Amount paid</p>
                    </div>
                    <div className="legend">
                        <p><span className="key-dot unpaid"></span>Amount missing</p>
                    </div>
                </div>
            </div>
        );
    };

    renderPieChart = () => {
        const dataValues = this.state.taxInfoList.map(taxInfo => ({x: taxInfo.name, y: taxInfo.plannedAmount}));
        const total = this.calculateTotal();

        const colorScale = d3.scale.ordinal()
            .domain(['Zone1', 'Zone2', 'Zone3'])
            .range(["#008B8A", "#02FDCC", "#FF0A22"]);

        const data = {
            values: dataValues
        };

        let tooltip = function (name, value) {
            return (value / total.plannedAmount * 100).toFixed(1) + "%";
        };

        return (
            <div className="pie-chart chart">
                <h2>Distribution of planned amount by zone</h2>
                <PieChart
                    data={data}
                    colorScale={colorScale}
                    hideLabels={true}
                    tooltipHtml={tooltip}
                    width={400}
                    height={400}
                    sort={null}
                    margin={{top: 10, bottom: 10, left: 100, right: 100}}
                />
                {this.renderPieChartLegend(colorScale)}
            </div>
        );
    };

    renderPieChartLegend = (color) => {
        return (
            <div className="legends">
                {this.state.taxInfoList.map((taxInfo, i) =>
                    <div className="legend" key={i}>
                        <p>
                            <span className="key-dot" style={{background: color(taxInfo.name)}}></span>
                            {taxInfo.name}
                        </p>
                    </div>)}
            </div>
        );
    }
}

export default observer(TaxAreaStats);