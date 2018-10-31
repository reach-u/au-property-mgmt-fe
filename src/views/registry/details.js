import React from 'react';
import MapView from '../fullDetails/map';
import {Button, Divider} from '@blueprintjs/core';
import './details/details.css';
import pilt101651211 from './details/101651211.png';
import {withRouter} from 'react-router';
import {observer} from 'mobx-react';

const Details = ({store, history}) => {
  return (
    <div className="details-container">
      <div className="img-container">
        <img className="streetuImage" alt="street view" src={pilt101651211} />
      </div>
      <div className="details-text">
        <div className="details-header">
          <h1>{store.detailedAddress}</h1>
          <Divider />
          <Button
            minimal
            intent={'primary'}
            onClick={() => {
              history.push(`/details/${store.detailsId}`);
            }}>
            Show more
          </Button>
        </div>
        <Button
          minimal
          icon="cross"
          className="details-close"
          title="Close"
          onClick={() => store.resetDetails()}
        />
        <p>
          <strong>Property number:</strong> {store.detailsId}
        </p>
        <p>
          <strong>Property type:</strong> {store.details.detailedData.propertyType}
        </p>
        <p>
          <strong>Property size:</strong> {store.details.detailedData.propertySize} m<sup>2</sup>
        </p>
        <p>
          <strong>Land number:</strong> {store.details.detailedData.landNumber}
        </p>
        <p>
          <strong>Land acreage:</strong> {store.details.detailedData.landAcreage} m<sup>2</sup>{' '}
        </p>

        <MapView coords={store.estateData.coordinates} />
      </div>
    </div>
  );
};

export default withRouter(observer(Details));
