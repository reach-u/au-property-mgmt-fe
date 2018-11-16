import React, {Component, Fragment, lazy, Suspense} from 'react';
import {observer} from 'mobx-react';
import './registry/registry.scss';
import Autocomplete from '../components/AutoComplete';
import L from 'leaflet';
import {loading} from '../App';
import waitAtLeast from '../utils/gracefulLoader';

const Map = lazy(() => waitAtLeast(600, import('./fullDetails/leaflet-map')));
const TileLayer = lazy(() => waitAtLeast(600, import('./fullDetails/leaflet-tilelayer')));
const Results = lazy(() => waitAtLeast(600, import('./registry/results')));

class Registry extends Component {
  constructor(props) {
    super(props);
    this.map = React.createRef();
    this.state = {
      mapRef: null,
      mapCenter: [-4.04569, 39.66366],
      activeEstate: null,
    };
  }

  render() {
    const {realEstateStore} = this.props;
    const isDesktop = window.innerWidth > 1370;

    return (
      <Fragment>
        <div className="registry-container">
          <Autocomplete store={realEstateStore} className="registry-search" />
          <div className="content-container">
            <div className="table-container">
              <Results
                store={realEstateStore}
                onHover={this.handleTableRowHover}
                activeRow={this.state.activeEstate}
              />
            </div>
            {isDesktop &&
              realEstateStore.dataAvailable && (
                <Suspense fallback={loading}>
                  <div className="results-map-container">
                    <Map
                      ref={this.map}
                      center={this.state.mapCenter}
                      zoom={15.3}
                      className="map"
                      whenReady={() => this.setState({mapRef: 'loaded'})}>
                      <TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png" />
                    </Map>
                  </div>
                </Suspense>
              )}
          </div>
        </div>
      </Fragment>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.realEstateStore.state === 'not_loaded' && this.state.mapRef) {
      this.setState({mapRef: null});
    }
    if (!prevState.mapRef && this.state.mapRef) {
      this.createPopups();
    }
  }

  componentDidMount() {
    const query = new URL(document.location).searchParams.get('q');

    if (query) {
      this.props.realEstateStore.setQuery(query);
      this.props.realEstateStore.fetchEstates(query);
    }
  }

  componentWillUnmount() {
    this.props.realEstateStore.resetData();
  }

  handleTableRowHover = (event, rowItem) => {
    this.setState({activeEstate: event.type === 'mouseover' ? rowItem.id : null});

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
    this.props.realEstateStore.estates.map((estate, index) => {
      const popup = L.popup({
        closeButton: false,
        autoClose: false,
        closeOnEscapeKey: false,
        closeOnClick: false,
        className: estate.id,
      }).setLatLng([estate.coordinates.lat, estate.coordinates.lon]);
      const content = this.createPopupContent(estate, popup);

      popup.setContent(content);
      this.map.current.leafletElement.addLayer(popup);

      if (index === 0) {
        this.setState({mapCenter: [estate.coordinates.lat, estate.coordinates.lon]});
      }

      return estate;
    });
  };

  createPopupContent = (estate, popupLayer) => {
    const content = L.DomUtil.create('div', 'popup-click-content');
    content.innerHTML = `<div class="${estate.id}">${estate.street} ${estate.house}${
      estate.apartment ? `-${estate.apartment}` : ''
    }</div>`;
    content.title = 'Click for details';
    content.addEventListener('click', e => {
      this.props.realEstateStore.fetchEstateDetails(e.target.className);
    });
    content.addEventListener('mouseover', () => {
      popupLayer.bringToFront();
      this.setState({activeEstate: estate.id});
    });
    content.addEventListener('mouseout', () => {
      this.setState({activeEstate: null});
    });

    return content;
  };
}

export default observer(Registry);
