import React, {Component, Fragment} from 'react';
import MapView from '../fullDetails/map';
import {Button, Card, Elevation, Divider, Overlay} from '@blueprintjs/core';
import './details/details.css';
import {withRouter} from 'react-router';
import {observer} from 'mobx-react';
import pic from './details/101651211.png';
import check from '../../assets/check.png';
import warning from '../../assets/warning.png';
import {formatDate} from '../../utils/date';

class Details extends Component {
  state = {
    overlayOpen: false,
  };

  render() {
    const {
      estateDetails,
      estateData: {house, street, county, country, coordinates},
      ownerName,
      mortgageData,
      previousOwnerData,
      detailedAddress,
      resetDetails,
      detailsId,
    } = this.props.store;

    return (
      <Fragment>
        <Card elevation={Elevation.THREE} className="details-card">
          <div className="details-text">
            <div className="details-header">
              <p className="details-main">{detailedAddress}</p>
              <p className="details-secondary-address">
                {house}, {street}, {county}, {country}
              </p>
            </div>
            <Button
              minimal
              icon="cross"
              className="details-close"
              title="Close"
              onClick={() => resetDetails()}
            />
            <div className="overview-grid">
              <p className="property-detail-number">
                <strong>Property number:</strong>
              </p>
              <p className="property-detail-number-value">{detailsId}</p>
              <p className="property-detail-type">
                <strong>Property type:</strong>
              </p>
              <p className="property-detail-type-value"> {estateDetails.propertyType}</p>
              <p className="property-detail-size">
                <strong>Property size:</strong>
              </p>
              <p className="property-detail-size-value">
                {' '}
                {estateDetails.propertySize} m<sup>2</sup>
              </p>
              <img src={pic} alt="" className="property-image" />
            </div>
            <Divider />
            <div className="building-container">
              <h3>Building</h3>
              <p className="details-main">
                {estateDetails.buildingType}, {estateDetails.areaUnderBuilding} m<sup>2</sup>
              </p>
              <p>
                <img src={check} alt="" className="check-icon" /> Certificate of occupancy (
                {formatDate(estateDetails.certificateOfOccupancy)})
              </p>
              <p>
                <img src={check} alt="" className="check-icon" /> Total height{' '}
                {estateDetails.height} m, {estateDetails.numberOfFloors} floors
              </p>
              <p>
                <img src={check} alt="" className="check-icon" /> {estateDetails.waterSupply} water
                supply, {estateDetails.sewerType} sewage
              </p>
              <div className="map-container">
                <div
                  className="map-overlay"
                  onClick={() => this.setState({overlayOpen: true})}
                  title="Show large map">
                  Show fullscreen
                </div>
                <MapView coords={coordinates} />
              </div>
            </div>
            <Divider />
            <h3>Registration</h3>
            <p className="details-main">
              Owned by {ownerName} since {formatDate(estateDetails.lastOwnerChangeDate)}
            </p>
            <p>
              <img src={check} alt="" className="check-icon" /> {mortgageData}
            </p>
            <p>
              <img src={check} alt="" className="check-icon" /> {previousOwnerData}
            </p>
            <Divider />
            <h3>Land number {estateDetails.landNumber}</h3>
            <p className="details-main">
              {estateDetails.landType1} area, {estateDetails.landAcreage} m<sup>2</sup>
            </p>
            <p>
              <img src={check} alt="" className="check-icon" /> Measured by {estateDetails.surveyor}{' '}
              on {formatDate(estateDetails.landMeasurementDate)}
            </p>
            <p>
              {!!estateDetails.landLimitations1 && (
                <img src={warning} alt="" className="check-icon" />
              )}{' '}
              {estateDetails.landLimitations1}
            </p>
          </div>
          <Overlay isOpen={this.state.overlayOpen} onClose={this.closeMap}>
            <div className="map-in-overlay">
              <MapView coords={coordinates} isLargeMap={true} handleClose={this.closeMap} />
            </div>
          </Overlay>
        </Card>
      </Fragment>
    );
  }

  closeMap = () => {
    this.setState({overlayOpen: false});
  };
}

export default withRouter(observer(Details));
