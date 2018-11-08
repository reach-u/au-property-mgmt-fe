import React, {Component, Fragment} from 'react';
import {observer} from 'mobx-react';
import Results from './registry/results';
import {ProgressBar} from '@blueprintjs/core';
import './registry/registry.scss';
import Autocomplete from '../components/AutoComplete';
import {Map, TileLayer} from 'react-leaflet';
import L from 'leaflet';

class Registry extends Component {
  constructor(props) {
    super(props);
    this.map = React.createRef();
    this.state = {
      mapRef: null,
    };
  }

  render() {
    const {realEstateStore} = this.props;
    const isDesktop = window.innerWidth > 1200;

    return (
      <Fragment>
        <div className="registry-container">
          <Autocomplete store={realEstateStore} className="registry-search" />
          <div className="content-container">
            <div className="table-container">
              <Results store={realEstateStore} onHover={this.handleTableRowHover} />
            </div>
            {isDesktop &&
              realEstateStore.dataAvailable && (
                <div className="results-map-container">
                  <Map ref={this.map} center={[-4.04569, 39.66366]} zoom={15.3} className="map">
                    <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
                  </Map>
                </div>
              )}
          </div>

          {realEstateStore.loading && (
            <div style={{position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 2000}}>
              <ProgressBar intent="primary" />
            </div>
          )}
        </div>
      </Fragment>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.map.current && !prevState.mapRef) {
      this.setState({mapRef: 'loaded'});
    }
    if (!prevState.mapRef && this.state.mapRef) {
      this.createPopups();
    }
  }

  handleTableRowHover = (event, rowItem) => {
    if (this.state.mapRef) {
      this.map.current.leafletElement.eachLayer(layer => {
        if (layer instanceof L.Popup) {
          const element = layer.getElement();
          const id = element.className.split(' ')[1];

          if (event.type === 'mouseover' && rowItem.id.toString() === id) {
            layer.bringToFront();
            element.children[0].style.background = '#008C8C';
            element.children[0].style.color = 'white';
            element.children[1].children[0].style.background = '#008C8C';
          }
          if (event.type === 'mouseout' && rowItem.id.toString() === id) {
            element.children[0].style.background = 'white';
            element.children[0].style.color = '#333';
            element.children[1].children[0].style.background = 'white';
          }
        }
      });
    }
  };

  createPopups = () => {
    this.props.realEstateStore.estates.map(estate => {
      const content = this.createPopupContent(estate);
      const popup = L.popup({
        closeButton: false,
        autoClose: false,
        closeOnEscapeKey: false,
        closeOnClick: false,
        className: estate.id,
      })
        .setLatLng([estate.coordinates.lat, estate.coordinates.lon])
        .setContent(content);
      this.map.current.leafletElement.addLayer(popup);

      return estate;
    });
  };

  createPopupContent = estate => {
    const content = L.DomUtil.create('div', 'popup-click-content');
    content.innerHTML = `<div class="${estate.id}">${estate.street} ${estate.house}${
      estate.apartment ? `-${estate.apartment}` : ''
    }</div>`;
    content.title = 'Click for details';
    content.addEventListener('click', e => {
      this.props.realEstateStore.fetchEstateDetails(e.target.className);
    });

    return content;
  };
}

export default observer(Registry);
