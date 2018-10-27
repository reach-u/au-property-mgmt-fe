import React, {Component} from 'react';
import {Map, TileLayer, Marker, ZoomControl} from 'react-leaflet';
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
      <Map center={position} zoom={this.state.zoom} className="map" zoomControl={false}>
        <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
        <Marker position={position} />
        <ZoomControl position="topright" />
      </Map>
    );
  }
}

export default MapView;
