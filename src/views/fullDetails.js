import React, {Component} from 'react';
import {observer} from 'mobx-react';
import MapView from './fullDetails/map';
import {Icon, Overlay, Classes, Divider, Button} from '@blueprintjs/core';
import './fullDetails/styles.css';
import {formatDate} from '../utils/date';

class FullDetails extends Component {
  componentDidMount() {
    const {match} = this.props;
    if (match.params.id) {
      this.props.store.fetchDetailsData(match.params.id);
    }
  }

  render() {
    const coords = this.props.store.coordinateData;
    const {
      detailedData,
      mortgageData,
      previousOwnerData,
      loading,
      details,
      ownerName,
    } = this.props.store;
    const loader = loading ? Classes.SKELETON : '';
    return (
      <Overlay isOpen className={Classes.OVERLAY_SCROLL_CONTAINER}>
        <div className="grid-container">
          <div className="data-element header">
            <div title="Close" onClick={() => console.log('close')}>
              <Icon icon="cross" className="close-button" iconSize={20} />
            </div>
            <h1 className={loader}>
              {this.props.store.addressData}{' '}
              <Icon icon="map-marker" iconSize={24} intent="primary" />
            </h1>
            <h2 className={loader}>Property no. {details.id}</h2>
            <h3 className={loader}>
              {detailedData.propertyType}, {detailedData.propertySize} m<sup>2</sup>
            </h3>
            <a
              className={loader}
              href={details.streetuUrl}
              target="_blank"
              rel="noopener noreferrer">
              View on Street U
            </a>
            <Button intent="success" large className="buy-button">
              Buy property
            </Button>
          </div>

          <div className="data-element map-card">
            <MapView coords={coords} />
          </div>

          <div className="data-element building">
            <Divider />
            <h1>Building</h1>
            <h3 className={loader}>
              {detailedData.buildingType}, {detailedData.areaUnderBuilding} m<sup>2</sup>
            </h3>
            <p className={loader}>
              <Icon icon="small-tick" className="centered-icon" /> Certificate of occupancy (
              {formatDate(detailedData.certificateOfOccupancy)})
            </p>
            <p className={loader}>
              <Icon icon="small-tick" className="centered-icon" /> Total height{' '}
              {detailedData.height} m, {detailedData.numberOfFloors} floors
            </p>
            <p className={loader}>
              <Icon icon="small-tick" className="centered-icon" /> {detailedData.waterSupply} water
              supply, {detailedData.sewerType} sewage
            </p>
          </div>

          <div className="data-element land">
            <Divider />
            <h1 className={loader}>Land no. {detailedData.landNumber}</h1>
            <h3 className={loader}>
              {detailedData.landType1} area, {detailedData.landAcreage} m<sup>2</sup>
            </h3>
            <p className={loader}>
              <Icon icon="small-tick" className="centered-icon" /> Measured by{' '}
              {detailedData.surveyor} on {formatDate(detailedData.landMeasurementDate)}
            </p>
            <p className={loader}>
              {!!detailedData.landLimitations1 && (
                <Icon icon="warning-sign" intent="danger" className="centered-icon" />
              )}{' '}
              {detailedData.landLimitations1}
            </p>
          </div>

          <div className="data-element property">
            <Divider />
            <h1 className={loader}>Registration</h1>
            <h3 className={loader}>
              Owned by {ownerName} since {formatDate(detailedData.lastOwnerChangeDate)}
            </h3>
            <p className={loader}>
              <Icon icon="small-tick" className="centered-icon" /> {mortgageData}
            </p>
            <p className={loader}>
              <Icon icon="small-tick" className="centered-icon" /> {previousOwnerData}
            </p>
          </div>
        </div>
      </Overlay>
    );
  }
}

export default observer(FullDetails);
