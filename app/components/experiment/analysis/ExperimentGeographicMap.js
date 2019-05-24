/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import GoogleMapsLoader from 'google-maps';
import _ from 'lodash';

import PhyloCanvasTooltip from '../../ui/PhyloCanvasTooltip';
import MapStyle from './MapStyle';

import styles from './ExperimentGeographicMap.scss';

export const DEFAULT_LAT = 51.5074;
export const DEFAULT_LNG = 0.1278;

class ExperimentGeographicMap extends React.Component<*> {
  _google: Object;
  _map: Object;
  _mapDiv: Object;
  _markers: Object;
  _phyloCanvasTooltip: PhyloCanvasTooltip;

  constructor(props: any) {
    super(props);
    GoogleMapsLoader.KEY = process.env.GOOGLE_MAPS_API_KEY;
    GoogleMapsLoader.REGION = 'GB';
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
    this._markers = {};
    experiments.forEach((experiment, index) => {
      const longitudeIsolate = _.get(
        experiment,
        'metadata.sample.longitudeIsolate'
      );
      const latitudeIsolate = _.get(
        experiment,
        'metadata.sample.latitudeIsolate'
      );
      if (longitudeIsolate && latitudeIsolate) {
        const lat = parseFloat(latitudeIsolate);
        const lng = parseFloat(longitudeIsolate);
        const marker = new this._google.maps.Marker({
          icon: {
            path: this._google.maps.SymbolPath.CIRCLE,
            scale: 10,
            strokeWeight: 4,
            fillColor: index === 0 ? '#c30042' : '#0f82d0',
            strokeColor: '#fff',
            fillOpacity: 1,
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
      }
    });
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
    if (!_.isEqual(experiments, prevProps.experiments)) {
      this.updateMarkers();
    }
    if (!_.isEqual(highlighted, prevProps.highlighted)) {
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
