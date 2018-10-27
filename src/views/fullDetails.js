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
    const {detailedData, mortgageData, previousOwnerData} = this.props.store;
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
          <h3>
            {detailedData.buildingType}, {detailedData.areaUnderBuilding} m<sup>2</sup>
          </h3>
          <p>
            <Icon icon="endorsed" intent="success" /> Certificate of occupancy (
            {new Date(detailedData.certificateOfOccupancy).toDateString()})
          </p>
          <p>
            Total height {detailedData.height} m, {detailedData.numberOfFloors} floors
          </p>
          <p>
            {detailedData.waterSupply} water supply, {detailedData.sewerType} sewage
          </p>
        </Card>
        <Card elevation={Elevation.TWO} className="main-data">
          <h1>Land no. {detailedData.landNumber}</h1>
          <h3>
            {detailedData.landType1} area, {detailedData.landAcreage} m<sup>2</sup>
          </h3>
          <p>
            Measured by {detailedData.surveyor} on{' '}
            {new Date(detailedData.landMeasurementDate).toDateString()}
          </p>
          <p>
            {!!detailedData.landLimitations1 && <Icon icon="error" intent="danger" />}{' '}
            {detailedData.landLimitations1}
          </p>
        </Card>
        <Card elevation={Elevation.TWO} className="main-data">
          <h1>Registration</h1>
          <h3>
            Owned by {detailedData.currentOwner} since{' '}
            {new Date(detailedData.lastOwnerChangeDate).toDateString()}
          </h3>
          <p>{mortgageData}</p>
          <p>{previousOwnerData}</p>
        </Card>
      </div>
    );
  }
}

export default observer(FullDetails);
