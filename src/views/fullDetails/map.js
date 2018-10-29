import React, {Component} from 'react';
import {Map, TileLayer, Marker} from 'react-leaflet';
import './styles.css';

class MapView extends Component {
  constructor(props) {
    super(props);
    this.map = React.createRef();
  }

  state = {
    lat: this.props.coords ? this.props.coords.lat || -4.04569 : -4.04569,
    lon: this.props.coords ? this.props.coords.lon || 39.66366 : 39.66366,
    zoom: 17,
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
  }

  render() {
    const position = [this.state.lat, this.state.lon];
    return (
      <div style={{position: 'relative'}}>
        <Map
          center={position}
          zoom={this.state.zoom}
          scrollWheelZoom={false}
          ref={this.map}
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

  handleClick = () => {
    const {lat, lon, zoom} = this.state;
    this.map.current.leafletElement.flyTo([lat, lon], zoom);
  };
}

export default MapView;
