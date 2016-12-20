/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './Map.css';
import GoogleMapsLoader from 'google-maps';
import Phylogeny from '../phylogeny/Phylogeny';
import { connect } from 'react-redux';
import PhyloCanvasTooltip from '../ui/PhyloCanvasTooltip';
import * as NodeActions from '../../actions/NodeActions';
import Key from '../header/Key';
import MapStyle from './MapStyle';
import type { Sample } from '../../types/Sample';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAe_EWm97fTPHqzfRrhu2DVwO_iseBQkAc';

class Map extends Component {
  _google: Object;
  _map: Object;
  _mapDiv: Object;
  _markers: Object;
  _phyloCanvasTooltip: PhyloCanvasTooltip;

  constructor(props) {
    super(props);
    GoogleMapsLoader.KEY = GOOGLE_MAPS_API_KEY;
    GoogleMapsLoader.REGION = 'GB';
  }

  componentDidMount() {
    GoogleMapsLoader.load((google) => {
      const options = {
        center: {lat: 51.5074, lng: 0.1278},
        maxZoom: 7,
        zoom: 3,
        backgroundColor: '#e2e1dc',
        styles: MapStyle
      };
      this._google = google;
      this._map = new google.maps.Map(this._mapDiv, options);
      this.updateMarkers(this.props.analyser.transformed.samples);
    });
  }

  getSampleWithId(nodeId): ?Sample {
    const {analyser} = this.props;
    const {samples} = analyser.transformed;
    for (let sampleKey in samples) {
      const sample = samples[sampleKey];
      if (sample.id === nodeId) {
        return sample;
      }
    }
  }

  getSampleIds() {
    const {analyser} = this.props;
    const {samples} = analyser.transformed;
    let nodeIds = [];
    for (let sampleKey in samples) {
      const sample = samples[sampleKey];
      nodeIds.push(sample.id);
    }
    return nodeIds;
  }

  updateMarkers(samples) {
    const {dispatch} = this.props;
    if (this._markers) {
      for (let markerKey in this._markers) {
        const marker = this._markers[markerKey];
        marker.setMap(null);
      }
    }
    this._markers = {};
    for (let sampleKey in samples) {
      const sample = samples[sampleKey];
      const lat = parseFloat(sample.locationLatLngForTest.lat);
      const lng = parseFloat(sample.locationLatLngForTest.lng);
      const marker = new this._google.maps.Marker({
        icon: {
          path: this._google.maps.SymbolPath.CIRCLE,
          scale: 10,
          strokeWeight: 4,
          fillColor: sample.colorForTest,
          strokeColor: '#fff',
          fillOpacity: 1
        },
        position: {lat, lng},
        map: this._map
      });
      marker.addListener('mouseover', (e) => {
        dispatch(NodeActions.setNodeHighlighted(sample.id, true));
      });
      marker.addListener('mouseout', (e) => {
        dispatch(NodeActions.setNodeHighlighted(sample.id, false));
      });
      this._markers[sample.id] = marker;
    }
    this.zoomToMarkers();
  }

  markerForNodeId(nodeId) {
    return this._markers[nodeId] || null;
  }

  fromLatLngToPoint(latLng) {
    const topRight = this._map.getProjection().fromLatLngToPoint(this._map.getBounds().getNorthEast());
    const bottomLeft = this._map.getProjection().fromLatLngToPoint(this._map.getBounds().getSouthWest());
    const scale = Math.pow(2, this._map.getZoom());
    const worldPoint = this._map.getProjection().fromLatLngToPoint(latLng);
    const x = (worldPoint.x - bottomLeft.x) * scale;
    const y = (worldPoint.y - topRight.y) * scale;
    return {x, y};
  }

  zoomToMarkers() {
    let bounds = new this._google.maps.LatLngBounds();
    for (let id in this._markers) {
      bounds.extend(this._markers[id].getPosition());
    }
    this._map.fitBounds(bounds);
  }

  componentWillReceiveProps(nextProps) {
    const {node} = nextProps;
    if (this.props.analyser.transformed.samples !== nextProps.analyser.transformed.samples) {
      this.updateMarkers(nextProps.analyser.transformed.samples);
    }
    if (node.highlighted.length) {
      console.log('node.highlighted', node.highlighted);
      const nodeId = node.highlighted[0];
      const marker = this.markerForNodeId(nodeId);
      if (marker) {
        const markerLocation = marker.getPosition();
        const screenPosition = this.fromLatLngToPoint(markerLocation);
        const boundingClientRect = this._mapDiv.getBoundingClientRect();
        const sample = this.getSampleWithId(nodeId);
        if (sample) {
          this._phyloCanvasTooltip.setNode(sample);
          this._phyloCanvasTooltip.setVisible(true, boundingClientRect.left + screenPosition.x, boundingClientRect.top + screenPosition.y);
        }
      }
    }
    else {
      this._phyloCanvasTooltip.setVisible(false);
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <Key />
        <div className={styles.mapAndPhylogenyContainer}>
          <div className={styles.mapContainer}>
            <div ref={(ref) => {
              this._mapDiv = ref;
            }} className={styles.map} />
            <PhyloCanvasTooltip ref={(ref) => {
              this._phyloCanvasTooltip = ref;
            }} />
          </div>
          <Phylogeny className={styles.phylogenyContainer} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
    node: state.node
  };
}

Map.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Map);
