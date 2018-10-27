import React from 'react';
import {humanReadable} from '../../utils/string';
import MapView from '../fullDetails/map';
import {Card, Elevation, Icon} from '@blueprintjs/core';
import './details.css';
import pilt101651211 from './101651211.png' ;
var streetuImageName;


const Details = ({store}) => {
    
    function getimage() {
        
        const picname='./'+store.details.landNumber.replace(":", "").replace(":", "")+'.png';
        let imageName=require(picname);
        
        return imageName;
        }

    return (
    
   
    <div style={{minWidth: '450px', borderLeft: '2px solid #888', padding: '20px'}}>
      <h2>{store.detailedAddress}</h2>
        <p> <strong>Property number:</strong> {store.detailsId}</p>
        <p> <strong>Property type:</strong> {store.details.propertyType}</p>
        <p> <strong>Property size:</strong> {store.details.propertySize} m <sup>2</sup></p>
        <p> <strong>Land number:</strong> {store.details.landNumber}</p>
        <p> <strong>Land acreage:</strong> {store.details.landAcreage} m <sup>2</sup> </p>    
        <Card elevation={Elevation.THREE} className="main-data map-card">
               <MapView coords={store.details} />
        </Card>
            <p>  . </p>
        <Card elevation={Elevation.THREE} className="streetu-kuva" style={{padding: '0px'}} >
                <img className='streetuImage' style={{Width: '20%', Height: '20%'}} src={pilt101651211} />
        </Card>
    </div>
  );
};

export default Details;

 /*{Object.keys(store.details)
        .filter(key => store.details[key])
        .map(key => (
          <p key={key}>
            <strong>{humanReadable(key)}:</strong> {store.details[key]}
          </p>
        */