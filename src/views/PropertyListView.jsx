import React, {Fragment, lazy} from 'react';
import {reaction} from 'mobx';
import './registry/registry.scss';
import L from "leaflet";
import waitAtLeast from "../utils/gracefulLoader";
import {observer} from "mobx-react";
import Control from 'react-leaflet-control';
import api from "../config/API";
import Legend from "./Legend";

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
            showTaxZones: false,
            showLegend: false,
            layers: L.layerGroup()
        };
        reaction(
            () => this.props.realEstateStore.dataAvailable,
            data => {
                if (data && this.state.mapRef) {
                    this.createPopups();
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
                                    <Control className="info">
                                        <Legend
                                            showTaxZones={this.state.showTaxZones}
                                            showLegend={this.state.showLegend}
                                            handleShowTaxZonesToggle={this.handleShowTaxZonesToggle}
                                            handleShowLegendToggle={this.handleShowLegendToggle}
                                        />
                                    </Control>
                                </Map>
                            </div>
                        )}
                    </div>
                )}
            </Fragment>
        );
    }

    componentDidMount() {
        this.fetchTaxZones();
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.mapRef && this.state.mapRef) {
            this.createPopups();
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
        if (this.state.showTaxZones) {
            this.createTaxLayers();
        }
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
        this.removeTaxLayers();
        this.state.taxZones.forEach((pol) => {
            let defaultColor;
            let hoverColor;
            switch (pol.name) {
                case 'Zone1':
                    defaultColor = '#E2DC95';
                    hoverColor = '#938a28';
                    break;
                case 'Zone2':
                    defaultColor = '#95B1B0';
                    hoverColor = '#455d5d';
                    break;
                case 'Zone3':
                    defaultColor = '#098BBA';
                    hoverColor = '#04455c';
                    break;
                default:
                    defaultColor = '#679fda';
                    hoverColor = '#5fb5dd';
            }
            let polygonContent = L.polygon(pol.zoneCoordinates, {color: defaultColor}).bindTooltip(pol.name, {sticky: true});
            this.createPolygonContent(polygonContent, defaultColor, hoverColor);
            this.state.layers.addLayer(polygonContent);

        });
        this.map.current.leafletElement._addLayers(this.state.layers);
    };

    createPolygonContent = (polygonContent, defaultColor, hoverColor) => {
        polygonContent.on('mouseover', function () {
            this.setStyle({
                color: hoverColor,
            })
        });
        polygonContent.on('mouseout', function () {
            this.setStyle({
                color: defaultColor
            })
        });
    };

    removeTaxLayers = () => {
        this.state.layers.clearLayers();
    };

    handleShowTaxZonesToggle = () => {
        if (this.state.taxZones != null && this.state.mapRef != null) {
            if (!this.state.showTaxZones) {
                this.createTaxLayers();
            } else {
                this.removeTaxLayers();
            }
        }
        this.setState({
            showTaxZones: !this.state.showTaxZones
        });
    };

    handleShowLegendToggle = () => {
        this.setState({
            showLegend: !this.state.showLegend
        });
    };
}

export default observer(PropertyListView);
