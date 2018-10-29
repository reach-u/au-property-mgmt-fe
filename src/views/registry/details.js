import React from 'react';
import MapView from '../fullDetails/map';
import {Button} from '@blueprintjs/core';
import './details/details.css';
import pilt101651211 from './details/101651211.png';
import {withRouter} from 'react-router';
import {observer} from 'mobx-react';

const Details = ({store}) => {
  return (
    <div className="details-container">
      <div className="img-container">
        <img className="streetuImage" alt="street view" src={pilt101651211} />
      </div>
      <div className="details-text">
        <div className="details-header">
          <h1>{store.detailedAddress}</h1>
          <a href={`/details/${store.detailsId}`} rel="noopener noreferrer" target="_blank">
            Show more
          </a>
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
          <strong>Property type:</strong> {store.details.propertyType}
        </p>
        <p>
          <strong>Property size:</strong> {store.details.propertySize} m<sup>2</sup>
        </p>
        <p>
          <strong>Land number:</strong> {store.details.landNumber}
        </p>
        <p>
          <strong>Land acreage:</strong> {store.details.landAcreage} m<sup>2</sup>{' '}
        </p>

        <MapView coords={store.estateData.coordinates} />
      </div>
    </div>
  );
};

export default withRouter(observer(Details));
