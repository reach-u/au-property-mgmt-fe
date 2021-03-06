import React, {Component} from 'react';
import {Map, TileLayer, Marker, Polygon} from 'react-leaflet';
import './styles.css';
import {Icon} from '@blueprintjs/core';

class MapView extends Component {
  constructor(props) {
    super(props);
    this.map = React.createRef();
  }

  state = {
    lat: this.props.coords ? this.props.coords.lat || -4.04569 : -4.04569,
    lon: this.props.coords ? this.props.coords.lon || 39.66366 : 39.66366,
    cadastry: this.props.cadastry ? this.props.cadastry : [],
    zoom: this.props.zoom || 17,
  };

  componentDidUpdate(prevProps) {
    const {
      coords: {lat, lon},
    } = this.props;
    const {
      coords: {lat: prevLat, lon: prevLon},
    } = prevProps;
    if (lat && lon && (prevLat !== lat || prevLon !== lon)) {
      this.setState({lat, lon});
    }
    if (this.props.cadastry && prevProps.cadastry !== this.props.cadastry) {
      this.setState({cadastry: this.props.cadastry});
    }
  }

  render() {
    const {isLargeMap = false, shouldMapRender} = this.props;

    return (
      <div style={{position: 'relative', zIndex: 1, height: 'inherit'}}>
        {shouldMapRender && this.renderMap()}
        {isLargeMap && (
          <button className="map-button" title="Back to property" onClick={this.handleClick}>
            Recenter
          </button>
        )}
        {isLargeMap && (
          <button
            className="map-button close-button"
            title="Hide map"
            onClick={this.props.handleClose}>
            <Icon icon="cross" />
          </button>
        )}
      </div>
    );
  }

  renderMap = () => {
    const position = [this.state.lat, this.state.lon];
    const {isLargeMap = false, showMarker = true} = this.props;
    return (
      <Map
        center={position}
        zoom={this.state.zoom}
        zoomControl={isLargeMap}
        attributionControl={isLargeMap}
        scrollWheelZoom={false}
        ref={this.map}
        className="map">
        <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
        <Polygon positions={this.state.cadastry} color="blue" />
        {showMarker && <Marker position={position} />}
      </Map>
    );
  };

  handleClick = () => {
    const {lat, lon, zoom} = this.state;
    this.map.current.leafletElement.flyTo([lat, lon], zoom);
  };
}

MapView.defaultProps = {
  coords: {lat: -4.04569, lon: 39.66366},
};

export default MapView;
