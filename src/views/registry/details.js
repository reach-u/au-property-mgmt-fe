import React from 'react';
import MapView from '../fullDetails/map';
import {Button, Card, Elevation, Divider, Icon} from '@blueprintjs/core';
import './details/details.css';
import {withRouter} from 'react-router';
import {observer} from 'mobx-react';
import pic from './details/101651211.png';
import {formatDate} from '../../utils/date';

const Details = ({store, history}) => {
  const {
    estateDetails,
    estateData: {house, street, county, country},
    ownerName,
    mortgageData,
    previousOwnerData,
  } = store;

  return (
    <Card elevation={Elevation.THREE} className="details-card">
      <div className="details-text">
        <div className="details-header">
          <p className="details-main">{store.detailedAddress}</p>
          <p className="details-secondary-address">
            {house}, {street}, {county}, {country}
          </p>
        </div>
        <Button
          minimal
          icon="cross"
          className="details-close"
          title="Close"
          onClick={() => store.resetDetails()}
        />
        <div className="overview-grid">
          <p className="property-detail-number">
            <strong>Property number:</strong>
          </p>
          <p className="property-detail-number-value">{store.detailsId}</p>
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
        <h3>Building</h3>
        <p className="details-main">
          {estateDetails.buildingType}, {estateDetails.areaUnderBuilding} m<sup>2</sup>
        </p>
        <p>
          <Icon icon="tick-circle" className="detail-icon" /> Certificate of occupancy (
          {formatDate(estateDetails.certificateOfOccupancy)})
        </p>
        <p>
          <Icon icon="tick-circle" className="detail-icon" /> Total height {estateDetails.height} m,{' '}
          {estateDetails.numberOfFloors} floors
        </p>
        <p>
          <Icon icon="tick-circle" className="detail-icon" /> {estateDetails.waterSupply} water
          supply, {estateDetails.sewerType} sewage
        </p>
        <Divider />
        <h3>Registration</h3>
        <p className="details-main">
          Owned by {ownerName} since {formatDate(estateDetails.lastOwnerChangeDate)}
        </p>
        <p>
          <Icon icon="tick-circle" className="detail-icon" /> {mortgageData}
        </p>
        <p>
          <Icon icon="tick-circle" className="detail-icon" /> {previousOwnerData}
        </p>
        <Divider />
        <h3>Land number {estateDetails.landNumber}</h3>
        <p className="details-main">
          {estateDetails.landType1} area, {estateDetails.landAcreage} m<sup>2</sup>
        </p>
        <p>
          <Icon icon="tick-circle" className="detail-icon" /> Measured by {estateDetails.surveyor}{' '}
          on {formatDate(estateDetails.landMeasurementDate)}
        </p>
        <p>
          {!!estateDetails.landLimitations1 && (
            <Icon icon="warning-sign" intent="danger" className="detail-icon" />
          )}{' '}
          {estateDetails.landLimitations1}
        </p>
        {/*<MapView coords={store.estateData.coordinates} /> */}
      </div>
    </Card>
  );
};

export default withRouter(observer(Details));
