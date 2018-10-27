import React, {Component} from 'react';
import {observer} from 'mobx-react';
import MapView from './fullDetails/map';
import {Card, Elevation, Icon} from '@blueprintjs/core';
import './fullDetails/styles.css';

class FullDetails extends Component {
  componentDidMount() {
    const {match} = this.props;
    if (match.params.id) {
      this.props.store.fetchDetailsData(match.params.id);
    }
  }

  render() {
    const coords = this.props.store.coordinateData;
    const {detailedData} = this.props.store;
    return (
      <div className="grid-container">
        <Card elevation={Elevation.TWO} className="main-data header">
          <div className="main-data-text">
            <h1>
              <Icon icon="map-marker" iconSize={24} intent="primary" />{' '}
              {this.props.store.addressData}
            </h1>
            <h3>
              {detailedData.propertyType}, {detailedData.propertySize} m<sup>2</sup>
            </h3>
          </div>
        </Card>
        <Card elevation={Elevation.TWO} className="main-data map-card">
          <MapView coords={coords} />
        </Card>
        <Card elevation={Elevation.TWO} className="main-data">
          <h1>Building</h1>
        </Card>
        <Card elevation={Elevation.TWO} className="main-data">
          <h1>Land no. {detailedData.landNumber}</h1>
          <h3>
            {detailedData.landType1}, {detailedData.landAcreage} m<sup>2</sup>
          </h3>
          <p style={{color: 'red'}}>{detailedData.landLimitations1}</p>
        </Card>
        <Card elevation={Elevation.TWO} className="main-data">
          <h1>Property registration</h1>
        </Card>
      </div>
    );
  }
}

export default observer(FullDetails);
