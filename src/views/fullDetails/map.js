import React, {Component} from 'react';
import {Map, TileLayer, Marker} from 'react-leaflet';
import {Icon} from '@blueprintjs/core';
import './styles.css';

class MapView extends Component {
  state = {
    lat: this.props.coords.lat || -4.04569,
    lng: this.props.coords.lng || 39.66366,
    zoom: 17,
  };

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <div style={{position: 'relative'}}>
        <Map
          center={position}
          zoom={this.state.zoom}
          ref={e => {
            this.mapInstance = e;
          }}
          className="map">
          <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
          <Marker position={position} />
        </Map>
        <button className="map-button" title="Back to property" onClick={this.handleClick}>
          Recenter
        </button>
      </div>
    );
  }

  componentDidMount() {
    this.map = this.mapInstance.leafletElement;
  }

  handleClick = () => {
    const {lat, lng, zoom} = this.state;
    this.map.flyTo([lat, lng], zoom);
  };
}

export default MapView;
