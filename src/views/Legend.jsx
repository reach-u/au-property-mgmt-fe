import React, {Fragment} from 'react';

export default class Legend extends React.Component {

    render() {
        return (
            <div>
                <div className="form">
                    <input type="checkbox" id="showTaxZones"
                           defaultChecked={this.props.showTaxZones}
                           onChange={this.props.handleShowTaxZonesToggle}/>
                    <label htmlFor="showTaxZones" id="showTaxZonesLabel">
                        <svg viewBox="0,0,50,50">
                            <path d="M5 30 L 20 45 L 45 5"/>
                        </svg>
                    </label>
                    <span className="greentext">Show land tax zones</span>
                </div>
                <div className="form">
                    <input type="checkbox" id="showLegend"
                           defaultChecked={this.props.showLegend}
                           onChange={this.props.handleShowLegendToggle}/>
                    <label htmlFor="showLegend" id="showLegendLabel">
                        <svg viewBox="0,0,50,50">
                            <path d="M5 30 L 20 45 L 45 5"/>
                        </svg>
                    </label>
                    <span className="greentext">Show legend</span>
                </div>
                {this.props.showLegend &&
                <Fragment>
                    <div className="greentext zoneInfo">
                        <p>Monthly tax rate:</p>
                        <p>
                            <span className="key-dot zone1-color"></span>
                            <span className="normal-text">Zone1: </span>
                            <b>$10 per sqm</b>
                        </p>
                        <p>
                            <span className="key-dot zone2-color"></span>
                            <span className="normal-text">Zone2: </span>
                            <b>$25 per sqm</b>
                        </p>
                        <p>
                            <span className="key-dot zone3-color"></span>
                            <span className="normal-text">Zone3: </span>
                            <b>$18 per sqm</b>
                        </p>
                    </div>
                </Fragment>
                }
            </div>
        );
    }
}