/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import GoogleMapsLoader from 'google-maps';
import _get from 'lodash.get';
import _isEqual from 'lodash.isequal';
import MarkerClusterer from '@google/markerclustererplus';
import memoizeOne from 'memoize-one';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

import { IconButton } from 'makeandship-js-common/src/components/ui/Buttons';

import ExperimentsTooltip from '../../ui/ExperimentsTooltip';
import ExperimentsList from '../../ui/ExperimentsList';
import Empty from '../../ui/Empty';

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
  trackingMarkerCluster?: MarkerClusterer,
  trackingMarker?: Marker,
};

class ExperimentGeographicMap extends React.Component<*, State> {
  _google: Object;
  _map: Object;
  _mapDiv: Object;
  _markers: Object;
  _markerClusterer: MarkerClusterer;

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
    if (!this._google || !this._mapDiv) {
      return;
    }
    const options = {
      center: { lat: DEFAULT_LAT, lng: DEFAULT_LNG },
      minZoom: 2,
      maxZoom: 10, // roughly allow you to see a city, without implying that samples came from a specific point within it
      zoom: 3,
      backgroundColor: '#e2e1dc',
      styles: MapStyle,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
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
    this._google.maps.event.addListener(
      this._markerClusterer,
      'mouseover',
      this.onMarkerClusterMouseOver
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

  onMarkerClusterMouseOver = markerCluster => {
    const { setExperimentsHighlighted } = this.props;
    const experimentsTooltipLocation = this.screenPositionFromLatLng(
      markerCluster.getCenter()
    );
    const markers = markerCluster.getMarkers();
    const experiments = markers.map(marker => marker.get('experiment'));
    setExperimentsHighlighted(experiments);
    this.setState({
      experimentsTooltipLocation,
      trackingMarkerCluster: markerCluster,
      trackingMarker: undefined,
    });
  };

  onMarkerMouseOver = marker => {
    const { setExperimentsHighlighted } = this.props;
    const experimentsTooltipLocation = this.screenPositionFromLatLng(
      marker.getPosition()
    );
    const experiments = [marker.get('experiment')];
    setExperimentsHighlighted(experiments);
    this.setState({
      experimentsTooltipLocation,
      trackingMarkerCluster: undefined,
      trackingMarker: marker,
    });
  };

  onExperimentsTooltipClickOutside = () => {
    const { resetExperimentsHighlighted } = this.props;
    resetExperimentsHighlighted();
    this.setState({
      trackingMarkerCluster: undefined,
      trackingMarker: undefined,
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
    const TILE_SIZE = 256;
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
    let x = worldPoint.x - bottomLeft.x;
    // FIXME: ugly fix for wrapping
    while (x < 0) {
      x += TILE_SIZE;
    }
    x *= scale;
    const y = (worldPoint.y - topRight.y) * scale;
    return { x, y };
  };

  setMapRef = (ref: any) => {
    this._mapDiv = ref;
    this.initMap();
  };

  updateMarkers = () => {
    if (!this._map) {
      return;
    }
    const { experimentsWithGeolocation } = this.props;
    if (this._markers) {
      for (let markerKey in this._markers) {
        const marker = this._markers[markerKey];
        marker.setMap(null);
      }
    }
    this._markerClusterer.clearMarkers();
    this._markers = {};
    experimentsWithGeolocation.forEach((experiment, index) => {
      const longitudeIsolate = _get(
        experiment,
        'metadata.sample.longitudeIsolate'
      );
      const latitudeIsolate = _get(
        experiment,
        'metadata.sample.latitudeIsolate'
      );
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
      // marker.addListener('mouseover', () => {
      //   setNodeHighlighted(experiment.id, true);
      // });
      marker.addListener('mouseover', () => {
        this.onMarkerMouseOver(marker);
      });

      // marker.addListener('mouseout', () => {
      //   setNodeHighlighted(experiment.id, false);
      // });
      this._markers[experiment.id] = marker;
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
    if (!this._mapDiv) {
      return { x: 0, y: 0 };
    }
    const divPosition = this.fromLatLngToPoint(latLng);
    const boundingClientRect = this._mapDiv.getBoundingClientRect();
    const screenPosition = {
      x: boundingClientRect.left + divPosition.x,
      y: boundingClientRect.top + divPosition.y,
    };
    return screenPosition;
  };

  updateHighlighted = () => {
    const { experimentsHighlightedWithGeolocation } = this.props;
    let { trackingMarkerCluster, trackingMarker } = this.state;
    if (trackingMarkerCluster) {
      const experimentsTooltipLocation = this.screenPositionFromLatLng(
        trackingMarkerCluster.getCenter()
      );
      this.setState({
        experimentsTooltipLocation,
      });
    } else if (
      !trackingMarker &&
      experimentsHighlightedWithGeolocation &&
      experimentsHighlightedWithGeolocation.length
    ) {
      // highlight a single experiment, likely from hover over tree
      const experiment = experimentsHighlightedWithGeolocation[0];
      trackingMarker = this._markers[experiment.id];
      this.setState({
        trackingMarker,
      });
    }
    if (trackingMarker) {
      const experimentsTooltipLocation = this.screenPositionFromLatLng(
        trackingMarker.getPosition()
      );
      this.setState({
        experimentsTooltipLocation,
      });
    }
  };

  componentDidUpdate = (prevProps: any) => {
    const {
      experiments,
      resetExperimentsHighlighted,
      experimentsHighlighted,
    } = this.props;
    if (!_isEqual(experiments, prevProps.experiments)) {
      this.updateMarkers();
      resetExperimentsHighlighted();
    }
    if (!_isEqual(experimentsHighlighted, prevProps.experimentsHighlighted)) {
      this.setState({
        trackingMarkerCluster: undefined,
        trackingMarker: undefined,
      });
      this.updateHighlighted();
    }
  };

  render() {
    const {
      experimentsHighlightedWithGeolocation,
      experimentsWithGeolocation,
      experimentsWithoutGeolocation,
      experimentIsolateId,
    } = this.props;
    const { experimentsTooltipLocation } = this.state;
    const hasExperimentsWithGeolocation = !!(
      experimentsWithGeolocation && experimentsWithGeolocation.length
    );
    const hasExperimentsWithoutGeolocation = !!(
      experimentsWithoutGeolocation && experimentsWithoutGeolocation.length
    );
    return (
      <div className={styles.mapContainer}>
        {hasExperimentsWithGeolocation ? (
          <div ref={this.setMapRef} className={styles.map} />
        ) : (
          <Empty
            icon={'globe'}
            title={'No geolocation'}
            subtitle={
              experimentsWithoutGeolocation.length > 1
                ? `No geolocation data for ${experimentIsolateId} or any of its nearest neighbours`
                : `No geolocation data for ${experimentIsolateId}`
            }
          />
        )}
        {hasExperimentsWithoutGeolocation && (
          <div className={styles.controlsContainerTop}>
            <UncontrolledDropdown>
              <DropdownToggle color="mid" outline size={'sm'}>
                {experimentsWithoutGeolocation.length} not shown{' '}
                <i className="fa fa-caret-down" />
              </DropdownToggle>
              <DropdownMenu>
                <div className={styles.dropdownContent}>
                  <ExperimentsList
                    experiments={experimentsWithoutGeolocation}
                  />
                </div>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        )}
        {hasExperimentsWithGeolocation && (
          <div className={styles.controlsContainerBottomLeft}>
            <IconButton
              size="sm"
              icon="search"
              onClick={this.zoomToMarkers}
              outline
              color="mid"
            >
              Zoom to fit
            </IconButton>
          </div>
        )}
        <ExperimentsTooltip
          experiments={experimentsHighlightedWithGeolocation}
          x={experimentsTooltipLocation.x}
          y={experimentsTooltipLocation.y}
          onClickOutside={this.onExperimentsTooltipClickOutside}
        />
      </div>
    );
  }
}

ExperimentGeographicMap.propTypes = {
  ...withExperimentsHighlightedPropTypes,
  experiments: PropTypes.array,
  experimentsWithGeolocation: PropTypes.array,
  experimentsWithoutGeolocation: PropTypes.array,
};

export default ExperimentGeographicMap;
