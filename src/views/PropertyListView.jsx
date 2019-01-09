import React, {Fragment, lazy} from 'react';
import {reaction} from 'mobx';
import './registry/registry.scss';
import L from "leaflet";
import waitAtLeast from "../utils/gracefulLoader";
import {observer} from "mobx-react";
import Control from 'react-leaflet-control';
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
                                        <div>
                                            <div className="form">
                                                <input type="checkbox" id="showTaxZones"
                                                       defaultChecked={this.state.showTaxZones}
                                                       onChange={this.handleShowTaxZonesToggle}/>
                                                <label htmlFor="showTaxZones" id="showTaxZonesLabel">
                                                    <svg viewBox="0,0,50,50">
                                                        <path d="M5 30 L 20 45 L 45 5"/>
                                                    </svg>
                                                </label>
                                                <span className="greentext">Show land tax zones</span>
                                            </div>
                                            <div className="form">
                                                <input type="checkbox" id="showLegend"
                                                       defaultChecked={this.state.showLegend}
                                                       onChange={this.handleShowLegendToggle}/>
                                                <label htmlFor="showLegend" id="showLegendLabel">
                                                    <svg viewBox="0,0,50,50">
                                                        <path d="M5 30 L 20 45 L 45 5"/>
                                                    </svg>
                                                </label>
                                                <span className="greentext">Show legend</span>
                                            </div>
                                            {this.state.showLegend &&
                                            <Fragment>
                                                <div className="greentext zoneInfo">
                                                    <p>Monthly tax rate:</p>
                                                    <p>
                                                        <span className="key-dot zone1-color"></span>
                                                        <span className="normal-text">Zone1: </span>
                                                        <b>$10 per sqm</b>
                                                    </p>
                                                    <p>
                                                        <span className="key-dot zone2-color"></span>
                                                        <span className="normal-text">Zone2: </span>
                                                        <b>$25 per sqm</b>
                                                    </p>
                                                    <p>
                                                        <span className="key-dot zone3-color"></span>
                                                        <span className="normal-text">Zone3: </span>
                                                        <b>$18 per sqm</b>
                                                    </p>
                                                </div>
                                            </Fragment>
                                            }
                                        </div>
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
            let initialColor;
            switch (pol.name) {
                case 'Zone1':
                    initialColor = '#679fda';
                    break;
                case 'Zone2':
                    initialColor = '#1574A6';
                    break;
                case 'Zone3':
                    initialColor = '#003F6E';
                    break;
                default:
                    initialColor = '#679fda';
            }
            console.log(initialColor);
            let polygonContent = L.polygon(pol.zoneCoordinates, {color: initialColor}).bindTooltip(pol.name,{sticky:true});
            switch (pol.name) {
                case 'Zone1':
                    this.createPolygonContent(polygonContent, initialColor, '#5fb5dd');
                    break;
                case 'Zone2':
                    this.createPolygonContent(polygonContent, initialColor, '#448aaf');
                    break;
                case 'Zone3':
                    this.createPolygonContent(polygonContent, initialColor, '#709be0');
                    break;
                default:
                    this.createPolygonContent(polygonContent, initialColor, '#5fb5dd');
            }
            this.state.layers.addLayer(polygonContent);

        });
        this.map.current.leafletElement._addLayers(this.state.layers);
    };

    createPolygonContent = (polygonContent, color1, color2) => {
        polygonContent.on('mouseover', function () {
            this.setStyle({
                color: color1
            })
        });
        polygonContent.on('mouseout', function () {
            this.setStyle({
                color: color2
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
