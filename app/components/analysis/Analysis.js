/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import GoogleMapsLoader from 'google-maps';

import styles from './Analysis.css';
import Phylogeny from '../phylogeny/Phylogeny';
import Uploading from '../ui/Uploading';
import PhyloCanvasTooltip from '../ui/PhyloCanvasTooltip';
import MapStyle from './MapStyle';

class Analysis extends React.Component<*> {
  _google: Object;
  _map: Object;
  _mapDiv: Object;
  _markers: Object;
  _phyloCanvasTooltip: PhyloCanvasTooltip;

  constructor(props: any) {
    super(props);
    GoogleMapsLoader.KEY = process.env.GOOGLE_MAPS_API_KEY;
    GoogleMapsLoader.REGION = 'GB';
  }

  componentDidMount() {
    const { experiment } = this.props;
    this.loadMaps(experiment);
  }

  loadMaps(experiment: Object) {
    if (!experiment.geoDistance) {
      return;
    }
    const { experiments } = experiment.geoDistance;
    GoogleMapsLoader.load(google => {
      const options = {
        center: { lat: 51.5074, lng: 0.1278 },
        maxZoom: 7,
        zoom: 3,
        backgroundColor: '#e2e1dc',
        styles: MapStyle,
      };
      this._google = google;
      this._map = new google.maps.Map(this._mapDiv, options);
      this.updateMarkers(experiment, experiments);
    });
  }

  getSampleWithId(nodeId) {
    const { experiment } = this.props;
    const { experiments } = experiment.geoDistance;
    const samples = [experiment].concat(experiments);
    let selectedSample;
    let isMain = false;
    samples.forEach((sample, index) => {
      if (sample.id === nodeId) {
        selectedSample = sample;
        if (index === 0) {
          isMain = true;
        }
      }
    });
    return { sample: selectedSample, isMain };
  }

  getSampleIds() {
    const { experiment } = this.props;
    const { experiments } = experiment.geoDistance;
    const samples = [experiment].concat(experiments);
    return samples.map(sample => {
      return sample.id;
    });
  }

  updateMarkers(sample, experiments) {
    const { setNodeHighlighted } = this.props;
    const samples = [sample].concat(experiments);
    if (this._markers) {
      for (let markerKey in this._markers) {
        const marker = this._markers[markerKey];
        marker.setMap(null);
      }
    }
    this._markers = {};
    samples.forEach((sample, index) => {
      const lat = parseFloat(sample.location.lat);
      const lng = parseFloat(sample.location.lng);
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
        setNodeHighlighted(sample.id, true);
      });
      marker.addListener('mouseout', () => {
        setNodeHighlighted(sample.id, false);
      });
      this._markers[sample.id] = marker;
    });
    this.zoomToMarkers();
  }

  markerForNodeId(nodeId) {
    return this._markers[nodeId] || null;
  }

  fromLatLngToPoint(latLng) {
    const topRight = this._map
      .getProjection()
      .fromLatLngToPoint(this._map.getBounds().getNorthEast());
    const bottomLeft = this._map
      .getProjection()
      .fromLatLngToPoint(this._map.getBounds().getSouthWest());
    const scale = Math.pow(2, this._map.getZoom());
    const worldPoint = this._map.getProjection().fromLatLngToPoint(latLng);
    const x = (worldPoint.x - bottomLeft.x) * scale;
    const y = (worldPoint.y - topRight.y) * scale;
    return { x, y };
  }

  zoomToMarkers() {
    let bounds = new this._google.maps.LatLngBounds();
    for (let id in this._markers) {
      bounds.extend(this._markers[id].getPosition());
    }
    this._map.fitBounds(bounds);
  }

  componentWillReceiveProps(nextProps) {
    const { highlighted } = nextProps;
    if (!this._map) {
      this.loadMaps(nextProps.experiment);
    } else if (
      this.props.experiment.geoDistance.experiments !==
      nextProps.experiment.geoDistance.experiments
    ) {
      this.updateMarkers(
        nextProps.experiment,
        nextProps.experiment.geoDistance.experiments
      );
    }
    if (highlighted.length) {
      const nodeId = highlighted[0];
      const marker = this.markerForNodeId(nodeId);
      if (marker) {
        const markerLocation = marker.getPosition();
        const screenPosition = this.fromLatLngToPoint(markerLocation);
        const boundingClientRect = this._mapDiv.getBoundingClientRect();
        const { sample, isMain } = this.getSampleWithId(nodeId);
        if (sample) {
          this._phyloCanvasTooltip.setNode(sample, isMain);
          this._phyloCanvasTooltip.setVisible(
            true,
            boundingClientRect.left + screenPosition.x,
            boundingClientRect.top + screenPosition.y
          );
        }
      }
    } else {
      if (this._phyloCanvasTooltip) {
        this._phyloCanvasTooltip.setVisible(false);
      }
    }
  }

  render() {
    const { isBusyWithCurrentRoute } = this.props;
    let content;
    if (isBusyWithCurrentRoute) {
      content = <Uploading sectionName="Analysis" />;
    } else {
      content = (
        <div className={styles.content}>
          <div className={styles.mapAndPhylogenyContainer}>
            <div className={styles.mapContainer}>
              <div
                ref={ref => {
                  this._mapDiv = ref;
                }}
                className={styles.map}
              />
              <PhyloCanvasTooltip
                ref={ref => {
                  this._phyloCanvasTooltip = ref;
                }}
              />
            </div>
            <div className={styles.phylogenyContainer}>
              <Phylogeny />
            </div>
          </div>
        </div>
      );
    }
    return <div className={styles.container}>{content}</div>;
  }
}

Analysis.propTypes = {
  setNodeHighlighted: PropTypes.func.isRequired,
  experiment: PropTypes.object.isRequired,
  highlighted: PropTypes.array.isRequired,
  isBusyWithCurrentRoute: PropTypes.node,
};

export default Analysis;
