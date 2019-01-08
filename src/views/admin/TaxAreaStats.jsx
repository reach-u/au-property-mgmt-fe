import React, {Component, Fragment} from 'react';

import '../navigation.scss';
import '../registry/results.css';
import './taxareastats.scss';
import api from '../../config/API';
import {observer} from 'mobx-react';
import {Classes} from "@blueprintjs/core";
import {BarChart, d3, PieChart} from 'react-d3-components';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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
                                    m<sup>2</sup>
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
                        {/*{showBarChart && this.renderBarChart()}*/}
                        {this.state.taxInfoList.length > 0 && this.renderCircles()}
                        {this.state.taxInfoList.length > 0 && this.renderPieChart()}
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
            .range(["#95B1B0", "#CF5467"]);

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

    renderCircles = () => {
        let zone1 = this.state.taxInfoList.find(taxInfo => {
            return taxInfo.name === 'Zone1'
        });
        let zone2 = this.state.taxInfoList.find(taxInfo => {
            return taxInfo.name === 'Zone2'
        });
        let zone3 = this.state.taxInfoList.find(taxInfo => {
            return taxInfo.name === 'Zone3'
        });

        const zone1Percentage = (zone1.paidAmount / zone1.plannedAmount * 100).toFixed(1);
        const zone2Percentage = (zone2.paidAmount / zone2.plannedAmount * 100).toFixed(1);
        const zone3Percentage = (zone3.paidAmount / zone3.plannedAmount * 100).toFixed(1);

        return (
            <div className="circle-wrapper chart">
                <div className="zone-tax-header">
                    <h2>Paid tax amount 2018</h2>
                </div>
                <div className="circle-container">
                {this.drawCircle(zone1.name, zone1Percentage)}
                {this.drawCircle(zone2.name, zone2Percentage)}
                {this.drawCircle(zone3.name, zone3Percentage)}
                </div>
            </div>
        );
    };

    drawCircle(name, percentage) {
        return (
            <div className="zone">
                <h3>{name}</h3>
                <CircularProgressbar
                    percentage={percentage}
                    text={`${percentage}%`}
                    strokeWidth={3}
                />
            </div>
        );
    }

    renderPieChart = () => {
        const dataValues = this.state.taxInfoList.map(taxInfo => ({x: taxInfo.name, y: taxInfo.plannedAmount}));
        const total = this.calculateTotal();

        const colorScale = d3.scale.ordinal()
            .domain(['Zone1', 'Zone2', 'Zone3'])
            .range(["#9DD2EA", "#61C0F2", "#098BBA"]);

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
                    innerRadius={90}
                    outerRadius={60}
                    colorScale={colorScale}
                    hideLabels={true}
                    tooltipHtml={tooltip}
                    width={250}
                    height={250}
                    sort={null}
                    margin={{top: 30, bottom: 30, left: 100, right: 100}}
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