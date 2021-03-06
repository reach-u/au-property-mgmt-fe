import React, {Component} from 'react';
import MapView from '../fullDetails/map';
import {Button, Card, Elevation, Divider, Overlay} from '@blueprintjs/core';
import './details/details.css';
import {withRouter} from 'react-router';
import {observer} from 'mobx-react';
import check from '../../assets/check.png';
import warning from '../../assets/warning.png';
import {formatDate} from '../../utils/date';

class Details extends Component {
  state = {
    overlayOpen: false,
    loaded: false,
  };

  render() {
    const {
      estateDetails,
      estateData: {house, street, county, country, coordinates, streetuUrl},
      detailedAddress,
      detailsId,
    } = this.props.store;
    const {userId} = this.props.authstore;
    const isDesktop = window.innerWidth > 1370;
    const mortgageData = estateDetails.mortgageSize
      ? `Mortgage ${estateDetails.mortgageSize}$ (${this.props.authstore.getUsernameById(
          estateDetails.mortgageSubject || 0
        )})`
      : 'No mortgage';
    const previousOwnerData = estateDetails.previousOwner
      ? `Previously owned by ${this.props.authstore.getUsernameById(estateDetails.previousOwner)}`
      : 'No previous owner';

    return (
      <div className="card-backdrop">
        <Card elevation={isDesktop ? Elevation.THREE : Elevation.ZERO} className="details-card">
          <div className="details-text">
            <div className="details-header">
              <p className="details-header">{detailedAddress}</p>
              <p className="details-secondary-address">
                {house}, {street}, {county}, {country}
              </p>
            </div>
            <Button
              minimal
              icon="cross"
              className="details-close"
              title="Close"
              onClick={() => this.props.store.closeDetailsModal()}
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
            </div>
            <Divider />
            <div className="building-container">
              <h3>Building</h3>
              <p className="details-main">
                {estateDetails.buildingType}, {estateDetails.areaUnderBuilding} m<sup>2</sup>
              </p>
              <p>
                <img src={check} alt="" className="check-icon" /> Certificate of occupancy (
                {formatDate(estateDetails.certificateOfOccupancy || new Date())})
              </p>
              <p>
                <img src={check} alt="" className="check-icon" /> Total height{' '}
                {estateDetails.height} m, {estateDetails.numberOfFloors} floors
              </p>
              <p>
                <img src={check} alt="" className="check-icon" /> {estateDetails.waterSupply} water
                supply, {estateDetails.sewerType} sewage
              </p>
            </div>
            <Divider />
            <h3>Registration</h3>
            <p className="details-main">
              Owned by {this.props.authstore.getUsernameById(estateDetails.currentOwner)} since{' '}
              {formatDate(estateDetails.lastOwnerChangeDate || new Date())}
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
              on {formatDate(estateDetails.landMeasurementDate || new Date())}
            </p>
            <p>
              {!!estateDetails.landLimitations1 && (
                <img src={warning} alt="" className="check-icon" />
              )}{' '}
              {estateDetails.landLimitations1}
            </p>
            <p>
              Tax zone {estateDetails.taxZone.name}, ${estateDetails.taxZone.squareMeterPrice} / m<sup>2</sup> / mth
            </p>
            <p>
              Monthly tax amount ${estateDetails.landTaxValue}
            </p>
            <div className="button-container">
              {userId === estateDetails.currentOwner && (
                <button className="owner-change-button" onClick={this.handleOwnershipClick}>
                  Change ownership
                </button>
              )}
            </div>
          </div>
          <div className="media-container">
            <div className="map-container">
              <div
                className="map-overlay"
                onClick={() => this.setState({overlayOpen: true})}
                title="Show large map">
                Click to show fullscreen
              </div>
              <MapView
                zoom={isDesktop ? 16.5 : 14.4}
                coords={coordinates}
                cadastry={estateDetails.cadastre}
                showMarker={isDesktop}
                shouldMapRender={this.state.loaded}
              />
            </div>

            {!!streetuUrl && (
              <div className="iframe-container">
                <a href={streetuUrl} target="_blank" rel="noopener noreferrer">
                  <div title="EyeVi street view" className="iframe-overlay">
                    Click to open in new tab
                  </div>
                </a>
                <img
                  src={`${
                    window.location.origin
                  }/au-property-mgmt-rest/api/1/priv/thumbnail/${detailsId || 0}`}
                  alt="Property street view"
                />
              </div>
            )}
          </div>
          <Overlay isOpen={this.state.overlayOpen} onClose={this.closeMap}>
            <div className="map-in-overlay">
              <MapView
                coords={coordinates}
                cadastry={estateDetails.cadastre}
                isLargeMap={true}
                handleClose={this.closeMap}
                shouldMapRender={this.state.loaded}
              />
            </div>
          </Overlay>
        </Card>
      </div>
    );
  }

  componentDidMount() {
    setTimeout(() => this.setState({loaded: true}), 1);
  }

  closeMap = () => {
    this.setState({overlayOpen: false});
  };

  handleOwnershipClick = () => {
    const {
      store: {detailsId},
      history,
    } = this.props;
    this.props.store.closeDetailsModal();
    history.push(`/owner-change/${detailsId}`);
  };
}

export default withRouter(observer(Details));
