/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import GoogleMapsLoader from 'google-maps';
import _get from 'lodash.get';
import _isEqual from 'lodash.isequal';
import MarkerClusterer from '@google/markerclusterer';
import memoizeOne from 'memoize-one';

import PhyloCanvasTooltip from '../../ui/PhyloCanvasTooltip';
import MapStyle from './MapStyle';

import styles from './ExperimentGeographicMap.scss';

export const DEFAULT_LAT = 51.5074;
export const DEFAULT_LNG = 0.1278;

export const COLOR_RED = '#c30042';
export const COLOR_BLUE = '#0f82d0';

export const makeSvgMarker = memoizeOne(
  ({
    color = COLOR_RED,
    diameter = 32,
    strokeWidth = 4,
  }: {
    color?: string,
    diameter?: number,
    strokeWidth?: number,
  }) => {
    const radiusMinusStroke = 0.5 * diameter - 0.5 * strokeWidth;
    const radius = 0.5 * diameter;
    const svg = `\
<svg viewBox="-${radius} -${radius} ${diameter} ${diameter}" xmlns="http://www.w3.org/2000/svg">
  <circle fill="${color}" stroke="white" stroke-width="4" cx="0" cy="0" r="${radiusMinusStroke}"/>
</svg>`;
    const svgEncoded = window.btoa(svg);
    const dataBase64 = `data:image/svg+xml;base64,${svgEncoded}`;
    return dataBase64;
  }
);

/*
 var getGoogleClusterInlineSvg = function (color) {
        var encoded = window.btoa('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-100 -100 200 200"><defs><g id="a" transform="rotate(45)"><path d="M0 47A47 47 0 0 0 47 0L62 0A62 62 0 0 1 0 62Z" fill-opacity="0.7"/><path d="M0 67A67 67 0 0 0 67 0L81 0A81 81 0 0 1 0 81Z" fill-opacity="0.5"/><path d="M0 86A86 86 0 0 0 86 0L100 0A100 100 0 0 1 0 100Z" fill-opacity="0.3"/></g></defs><g fill="' + color + '"><circle r="42"/><use xlink:href="#a"/><g transform="rotate(120)"><use xlink:href="#a"/></g><g transform="rotate(240)"><use xlink:href="#a"/></g></g></svg>');

        return ('data:image/svg+xml;base64,' + encoded);
    };
*/

class ExperimentGeographicMap extends React.Component<*> {
  _google: Object;
  _map: Object;
  _mapDiv: Object;
  _markers: Object;
  _markerClusterer: MarkerClusterer;
  _phyloCanvasTooltip: PhyloCanvasTooltip;

  constructor(props: any) {
    super(props);
    GoogleMapsLoader.KEY = process.env.GOOGLE_MAPS_API_KEY;
    GoogleMapsLoader.REGION = 'GB';
    GoogleMapsLoader.VERSION = '3.38'; // https://developers.google.com/maps/documentation/javascript/versions#choosing-a-version-number
    GoogleMapsLoader.load(this.onGoogleMapsLoaded);
  }

  onGoogleMapsLoaded = (google: any) => {
    this._google = google;
    this.initMap();
  };

  initMap = () => {
    if (!this._google || !this._mapDiv) {
      return;
    }
    const options = {
      center: { lat: DEFAULT_LAT, lng: DEFAULT_LNG },
      maxZoom: 5,
      zoom: 3,
      backgroundColor: '#e2e1dc',
      styles: MapStyle,
    };
    this._map = new this._google.maps.Map(this._mapDiv, options);
    // https://googlemaps.github.io/js-marker-clusterer/docs/reference.html
    this._markerClusterer = new MarkerClusterer(this._map, [], {
      minimumClusterSize: 2,
      styles: [
        {
          textColor: 'white',
          textSize: 16,
          width: 48,
          height: 48,
          url: makeSvgMarker({ diameter: 48 }),
        },
      ],
    });
    this.updateMarkers();
    // wait for getProjection() to be usable
    this._google.maps.event.addListenerOnce(
      this._map,
      'projection_changed',
      () => {
        this.updateHighlighted();
      }
    );
    this._google.maps.event.addListener(this._map, 'bounds_changed', () => {
      this.updateHighlighted();
    });
  };

  getExperimentWithId = (nodeId: string) => {
    const { experiments } = this.props;
    for (let i = 0; i < experiments.length; i++) {
      const experiment = experiments[i];
      if (experiment.id === nodeId) {
        const isMain = i === 0;
        return {
          experiment,
          isMain,
        };
      }
    }
  };

  markerForNodeId = (nodeId: string) => {
    return this._markers[nodeId] || null;
  };

  fromLatLngToPoint = (latLng: any) => {
    const projection = this._map.getProjection();
    const bounds = this._map.getBounds();
    if (!projection) {
      return {
        x: 0,
        y: 0,
      };
    }
    const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
    const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
    const scale = Math.pow(2, this._map.getZoom());
    const worldPoint = projection.fromLatLngToPoint(latLng);
    const x = (worldPoint.x - bottomLeft.x) * scale;
    const y = (worldPoint.y - topRight.y) * scale;
    return { x, y };
  };

  setMapRef = (ref: any) => {
    this._mapDiv = ref;
    this.initMap();
  };

  setPhyloCanvasTooltipRef = (ref: any) => {
    this._phyloCanvasTooltip = ref;
  };

  updateMarkers = () => {
    const { setNodeHighlighted, experiments } = this.props;
    if (this._markers) {
      for (let markerKey in this._markers) {
        const marker = this._markers[markerKey];
        marker.setMap(null);
      }
    }
    this._markerClusterer.clearMarkers();
    this._markers = {};
    experiments.forEach((experiment, index) => {
      const longitudeIsolate = _get(
        experiment,
        'metadata.sample.longitudeIsolate'
      );
      const latitudeIsolate = _get(
        experiment,
        'metadata.sample.latitudeIsolate'
      );
      if (longitudeIsolate && latitudeIsolate) {
        const lat = parseFloat(latitudeIsolate);
        const lng = parseFloat(longitudeIsolate);
        console.log(`experiment id ${experiment.id} lat ${lat} lat ${lng}`);
        const marker = new this._google.maps.Marker({
          icon: {
            url: makeSvgMarker({
              diameter: 24,
              color: index === 0 ? COLOR_RED : COLOR_BLUE,
            }),
            size: new this._google.maps.Size(24, 24),
            scaledSize: new this._google.maps.Size(24, 24),
          },
          position: { lat, lng },
          map: this._map,
        });
        marker.addListener('mouseover', () => {
          setNodeHighlighted(experiment.id, true);
        });
        marker.addListener('mouseout', () => {
          setNodeHighlighted(experiment.id, false);
        });
        this._markers[experiment.id] = marker;
      } else {
        console.log(`experiment id ${experiment.id} has no lat/lng`);
      }
    });
    this._markerClusterer.addMarkers(this._markers);
    this.zoomToMarkers();
  };

  zoomToMarkers = () => {
    let bounds = new this._google.maps.LatLngBounds();
    for (let id in this._markers) {
      bounds.extend(this._markers[id].getPosition());
    }
    this._map.fitBounds(bounds);
  };

  updateHighlighted = () => {
    const { highlighted } = this.props;
    if (highlighted && highlighted.length) {
      const nodeId = highlighted[0];
      const marker = this.markerForNodeId(nodeId);
      if (marker) {
        const markerLocation = marker.getPosition();
        const screenPosition = this.fromLatLngToPoint(markerLocation);
        const boundingClientRect = this._mapDiv.getBoundingClientRect();
        const { experiment, isMain } = this.getExperimentWithId(nodeId);
        if (experiment) {
          this._phyloCanvasTooltip.setNode(experiment, isMain);
          this._phyloCanvasTooltip.setVisible(
            true,
            boundingClientRect.left + screenPosition.x,
            boundingClientRect.top + screenPosition.y
          );
        }
      }
    } else {
      this._phyloCanvasTooltip && this._phyloCanvasTooltip.setVisible(false);
    }
  };

  componentDidUpdate = (prevProps: any) => {
    const { highlighted, experiments } = this.props;
    if (!_isEqual(experiments, prevProps.experiments)) {
      this.updateMarkers();
    }
    if (!_isEqual(highlighted, prevProps.highlighted)) {
      this.updateHighlighted();
    }
  };

  render() {
    return (
      <div className={styles.mapContainer}>
        <div ref={this.setMapRef} className={styles.map} />
        <PhyloCanvasTooltip ref={this.setPhyloCanvasTooltipRef} />
      </div>
    );
  }
}

ExperimentGeographicMap.propTypes = {
  setNodeHighlighted: PropTypes.func,
  experiments: PropTypes.array,
  highlighted: PropTypes.array,
  isBusyWithCurrentRoute: PropTypes.bool,
};

export default ExperimentGeographicMap;
