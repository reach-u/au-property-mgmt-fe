import React, {Component} from 'react';
//import L from 'leaflet';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import './ylomap.css';

//const { Map, TileLayer, Marker, Popup } = window.ReactLeaflet;

class YloMap extends React.Component {
  constructor() {
    super();
    this.state = {
      lat: -4.04569,
      lng: 39.66366,
      zoom: 17,
    };
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>
            <span>
              {' '}
              Miski übervajalik info selle maja kohta <br /> lat: -4.04569 lng: 39.66366
            </span>
          </Popup>
        </Marker>
      </Map>
    );
  }
}

export default YloMap;
