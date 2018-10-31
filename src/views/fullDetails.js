import React, {Component} from 'react';
import {observer} from 'mobx-react';
import MapView from './fullDetails/map';
import {Icon, Classes, Divider, Button} from '@blueprintjs/core';
import './fullDetails/styles.css';
import {formatDate} from '../utils/date';
import {withRouter} from 'react-router-dom';

class FullDetails extends Component {
  render() {
    const {
      loading,
      estateData,
      detailedAddress,
      estateDetails,
      mortgageData,
      previousOwnerData,
      ownerName,
    } = this.props.estateStore;
    const loader = loading ? Classes.SKELETON : '';

    return (
      <div className="grid-container">
        <div className="data-element header">
          <Button minimal icon="arrow-left" onClick={() => this.props.history.goBack()}>
            Back
          </Button>
          <h1 className={loader}>
            {detailedAddress} <Icon icon="map-marker" iconSize={24} intent="primary" />
          </h1>
          <h2 className={loader}>Property no. {estateData.id}</h2>
          <h3 className={loader}>
            {estateDetails.propertyType}, {estateDetails.propertySize} m<sup>2</sup>
          </h3>
          <a
            className={loader}
            href={estateData.streetuUrl}
            target="_blank"
            rel="noopener noreferrer">
            View on Street U
          </a>
          <Button
            intent="success"
            large
            className={`${loader} buy-button`}
            onClick={this.handleBuyClick}>
            Buy property
          </Button>
        </div>

        <div className="data-element map-card">
          <MapView coords={estateData.coordinates || {}} />
        </div>

        <div className="data-element building">
          <Divider />
          <h1 className={loader}>Building</h1>
          <h3 className={loader}>
            {estateDetails.buildingType}, {estateDetails.areaUnderBuilding} m<sup>2</sup>
          </h3>
          <p className={loader}>
            <Icon icon="small-tick" className="centered-icon" /> Certificate of occupancy (
            {formatDate(estateDetails.certificateOfOccupancy)})
          </p>
          <p className={loader}>
            <Icon icon="small-tick" className="centered-icon" /> Total height {estateDetails.height}{' '}
            m, {estateDetails.numberOfFloors} floors
          </p>
          <p className={loader}>
            <Icon icon="small-tick" className="centered-icon" /> {estateDetails.waterSupply} water
            supply, {estateDetails.sewerType} sewage
          </p>
        </div>

        <div className="data-element property">
          <Divider />
          <h1 className={loader}>Registration</h1>
          <h3 className={loader}>
            Owned by {ownerName} since {formatDate(estateDetails.lastOwnerChangeDate)}
          </h3>
          <p className={loader}>
            <Icon icon="small-tick" className="centered-icon" /> {mortgageData}
          </p>
          <p className={loader}>
            <Icon icon="small-tick" className="centered-icon" /> {previousOwnerData}
          </p>
        </div>

        <div className="data-element land">
          <Divider />
          <h1 className={loader}>Land no. {estateDetails.landNumber}</h1>
          <h3 className={loader}>
            {estateDetails.landType1} area, {estateDetails.landAcreage} m<sup>2</sup>
          </h3>
          <p className={loader}>
            <Icon icon="small-tick" className="centered-icon" /> Measured by{' '}
            {estateDetails.surveyor} on {formatDate(estateDetails.landMeasurementDate)}
          </p>
          <p className={loader}>
            {!!estateDetails.landLimitations1 && (
              <Icon icon="warning-sign" intent="danger" className="centered-icon" />
            )}{' '}
            {estateDetails.landLimitations1}
          </p>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const {id} = this.props.match.params;
    if (id) {
      this.props.estateStore.fetchEstateDetails(id);
      this.props.transactionStore.fetchPropertyTransactions(id);
    }
  }

  handleBuyClick = () => {
    this.props.history.push(`/owner-change/${this.props.estateStore.detailsId}`);
  };
}

export default withRouter(observer(FullDetails));
