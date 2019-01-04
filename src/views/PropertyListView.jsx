import React, {Fragment, lazy} from 'react';
import {reaction} from 'mobx';
import './registry/registry.scss';
import L from "leaflet";
import waitAtLeast from "../utils/gracefulLoader";
import {observer} from "mobx-react";

const Map = lazy(() => waitAtLeast(600, import('./fullDetails/leaflet-map')));
const TileLayer = lazy(() => waitAtLeast(600, import('./fullDetails/leaflet-tilelayer')));
const Results = lazy(() => waitAtLeast(600, import('./registry/results')));


class PropertyListView extends React.Component {

    constructor(props) {
        super(props);
        this.map = React.createRef();
        this.state = {
            mapRef: null,
            mapCenter: [-4.04569, 39.66366],
            activeEstate: null
        };
        reaction(
            () => this.props.realEstateStore.dataAvailable,
            data => {
                if (data && this.state.mapRef) {
                    this.createPopups();
                    this.createTaxLayers();
                }
            }
        );
    }

    render() {
        const {realEstateStore} = this.props;
        const isDesktop = window.innerWidth > 1370;

        return (
            <Fragment>
                {this.props.loaded && (
                    <div className="content-container">
                        <div className="table-container">
                            <Results
                                store={realEstateStore}
                                onHover={this.handleTableRowHover}
                                activeRow={this.state.activeEstate}
                                estates={this.props.estates}
                                dataAvailable={this.props.dataAvailable}
                            />
                        </div>
                        {isDesktop && (
                            <div className="results-map-container">
                                <Map
                                    ref={this.map}
                                    center={this.state.mapCenter}
                                    zoom={15.3}
                                    className="map"
                                    whenReady={() => this.setState({mapRef: 'loaded'})}>
                                    <TileLayer
                                        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"/>
                                </Map>
                            </div>
                        )}
                    </div>
                )}
            </Fragment>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.mapRef && this.state.mapRef) {
            this.createPopups();
            this.createTaxLayers();
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
        this.map.current.leafletElement.eachLayer(layer => {
            if (!layer.getTileUrl) {
                this.map.current.leafletElement.removeLayer(layer);
            }
        });
        this.props.estates.map((estate, index) => {
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


    createTaxLayers = () => {
        const polygons = [[[-4.049021, 39.663835],[-4.046981, 39.666695],[-4.045762, 39.669059],[-4.045356, 39.671112],[-4.047341, 39.673821],[-4.049509, 39.671919],[-4.047647, 39.670324],[-4.048530, 39.669342],[-4.048119, 39.669018],[-4.049710, 39.666449],[-4.051039, 39.665231]],[[-4.051039, 39.665231],[-4.049710, 39.666449],[-4.048119, 39.669018],[-4.048530, 39.669342],[-4.047647, 39.670324],[-4.049559, 39.671889],[-4.050341, 39.671296],[-4.051340, 39.669138],[-4.052256, 39.668254],[-4.054177, 39.667424]],[[-4.045754, 39.661272],[-4.043221, 39.664244],[-4.042739, 39.665446],[-4.043525, 39.668240],[-4.043139, 39.670600],[-4.044969, 39.671211],[-4.045762, 39.669059],[-4.046981, 39.666695],[-4.049021, 39.663835]],[[-4.054688, 39.655862],[-4.054627, 39.657639],[-4.051375, 39.657887],[-4.041050, 39.657441],[-4.041427, 39.655247],[-4.042594, 39.654027],[-4.043290, 39.654209],[-4.043429, 39.652579]],[[-4.041050, 39.657441],[-4.045754, 39.661272],[-4.049021, 39.663835],[-4.051394, 39.660414],[-4.051367, 39.657866]],[[-4.041050, 39.657441],[-4.045754, 39.661272],[-4.043221, 39.664244],[-4.037506, 39.660382],[-4.039037, 39.659738]],[[-4.051375, 39.657887],[-4.051446, 39.660453],[-4.052130, 39.662573],[-4.053941, 39.665262],[-4.055120, 39.664241],[-4.056211, 39.663815],[-4.056682, 39.663927],[-4.056928, 39.663200],[-4.060978, 39.662239],[-4.060879, 39.656483],[-4.054688, 39.655862],[-4.054627, 39.657639]],[[-4.047189, 39.653781],[-4.054688, 39.655862],[-4.060879, 39.656483],[-4.061296, 39.648562],[-4.050104, 39.647041],[-4.049011, 39.646694],[-4.047374, 39.648389],[-4.046732, 39.649816]],[[-4.049021, 39.663835],[-4.051039, 39.665231],[-4.054177, 39.667424],[-4.056577, 39.669055],[-4.056682, 39.663927],[-4.056211, 39.663815],[-4.055120, 39.664241],[-4.053941, 39.665262],[-4.052130, 39.662573],[-4.051446, 39.660453]]];
        polygons.map((pol) => {
            this.map.current.leafletElement.addLayer(L.polygon(pol, {color: 'red'}));
        });
    };
}

export default observer(PropertyListView);
