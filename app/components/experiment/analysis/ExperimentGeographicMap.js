/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import GoogleMapsLoader from 'google-maps';
import _get from 'lodash.get';
import _isEqual from 'lodash.isequal';
import MarkerClusterer from '@google/markerclustererplus';
import memoizeOne from 'memoize-one';

import PhyloCanvasTooltip from '../../ui/PhyloCanvasTooltip';
import ExperimentsTooltip from '../../ui/ExperimentsTooltip';

import MapStyle from './MapStyle';

import { withExperimentsHighlightedPropTypes } from '../../../hoc/withExperimentsHighlighted';

import * as Colors from '../../../constants/Colors';

import styles from './ExperimentGeographicMap.scss';

export const DEFAULT_LAT = 51.5074;
export const DEFAULT_LNG = 0.1278;

export const makeSvgMarker = memoizeOne(
  ({
    color = Colors.COLOR_HIGHLIGHT_EXPERIMENT,
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

type State = {
  experimentsTooltipLocation: {
    x: number,
    y: number,
  },
  trackingCluster: MarkerClusterer,
  trackingMarker: Marker,
};

class ExperimentGeographicMap extends React.Component<*, State> {
  _google: Object;
  _map: Object;
  _mapDiv: Object;
  _markers: Object;
  _markerClusterer: MarkerClusterer;
  _phyloCanvasTooltip: PhyloCanvasTooltip;

  state = {
    experimentsTooltipLocation: {
      x: 0,
      y: 0,
    },
  };

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
    const {
      setExperimentsHighlighted,
      resetExperimentsHighlighted,
    } = this.props;
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
      averageCenter: true,
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
    this._google.maps.event.addListener(this._markerClusterer, 'click', c => {
      const markers = c.getMarkers();
      const experiments = markers.map(marker => marker.get('experiment'));
      setExperimentsHighlighted(experiments);
    });
    this._google.maps.event.addListener(
      this._markerClusterer,
      'mouseover',
      c => {
        //
        const experimentsTooltipLocation = this.screenPositionFromLatLng(
          c.getCenter()
        );
        const markers = c.getMarkers();
        const experiments = markers.map(marker => marker.get('experiment'));
        setExperimentsHighlighted(experiments);
        this.setState({
          experimentsTooltipLocation,
          trackingCluster: c,
        });
      }
    );
    this._google.maps.event.addListener(
      this._markerClusterer,
      'mouseout',
      () => {
        // resetExperimentsHighlighted();
      }
    );
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
    if (!this._map) {
      return;
    }
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
              color:
                index === 0
                  ? Colors.COLOR_HIGHLIGHT_EXPERIMENT_FIRST
                  : Colors.COLOR_HIGHLIGHT_EXPERIMENT,
            }),
            anchor: new this._google.maps.Point(12, 12),
            size: new this._google.maps.Size(24, 24),
            scaledSize: new this._google.maps.Size(24, 24),
          },
          position: { lat, lng },
          map: this._map,
        });
        marker.setValues({ experiment });
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

  screenPositionFromLatLng = latLng => {
    const divPosition = this.fromLatLngToPoint(latLng);
    const boundingClientRect = this._mapDiv.getBoundingClientRect();
    const screenPosition = {
      x: boundingClientRect.left + divPosition.x,
      y: boundingClientRect.top + divPosition.y,
    };
    return screenPosition;
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

    // TODO: add marker support
    const { trackingCluster } = this.state;
    if (trackingCluster) {
      const experimentsTooltipLocation = this.screenPositionFromLatLng(
        trackingCluster.getCenter()
      );
      this.setState({
        experimentsTooltipLocation,
      });
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
    const { experimentsHighlighted } = this.props;
    const { experimentsTooltipLocation } = this.state;
    return (
      <div className={styles.mapContainer}>
        <div ref={this.setMapRef} className={styles.map} />
        <PhyloCanvasTooltip ref={this.setPhyloCanvasTooltipRef} />
        <ExperimentsTooltip
          experiments={experimentsHighlighted}
          x={experimentsTooltipLocation.x}
          y={experimentsTooltipLocation.y}
        />
      </div>
    );
  }
}

ExperimentGeographicMap.propTypes = {
  ...withExperimentsHighlightedPropTypes,
  setNodeHighlighted: PropTypes.func,
  experiments: PropTypes.array,
  highlighted: PropTypes.array,
  isBusyWithCurrentRoute: PropTypes.bool,
};

export default ExperimentGeographicMap;
