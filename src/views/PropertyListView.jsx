import React, {Fragment, lazy} from 'react';
import {reaction} from 'mobx';
import './registry/registry.scss';
import L from "leaflet";
import waitAtLeast from "../utils/gracefulLoader";
import {observer} from "mobx-react";
import api from "../config/API";

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
            activeEstate: null,
            taxZones: null,
            activeTaxZoneColor: '#709be0'
        };
        reaction(
            () => this.props.realEstateStore.dataAvailable,
            data => {
                if (data && this.state.mapRef) {
                    this.createPopups();
                    this.createTaxLayers();
                }
            },
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

    componentWillMount() {
        this.fetchTaxZones();
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

    fetchTaxZones() {
        fetch(`${window.location.origin}/${api.getTaxZones()}`)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    taxZones: data
                });
            });
    }


    createTaxLayers = () => {
        this.state.taxZones.forEach((pol) => {
            const polygonContent = L.polygon(pol.zoneCoordinates, {
                color: this.state.activeTaxZoneColor,
            });
            polygonContent.on('mouseover', function() {
                this.setStyle({
                    color: '#2055aa'
                })
            });
            polygonContent.on('mouseout', function() {
                this.setStyle({
                    color: '#709be0'
                })
            });

            this.map.current.leafletElement.addLayer(polygonContent);
        });
    };
}

export default observer(PropertyListView);
