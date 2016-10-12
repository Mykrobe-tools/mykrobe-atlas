import React, { Component, PropTypes } from 'react';
import styles from './Map.css';
import GoogleMapsLoader from 'google-maps';
import Phylogeny from 'components/phylogeny/Phylogeny';
import { connect } from 'react-redux';
import PhyloCanvasTooltip from 'components/ui/PhyloCanvasTooltip';
import * as NodeActions from 'actions/NodeActions';
import Key from 'components/header/Key';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAe_EWm97fTPHqzfRrhu2DVwO_iseBQkAc';

class Map extends Component {
  constructor(props) {
    super(props);
    GoogleMapsLoader.KEY = GOOGLE_MAPS_API_KEY;
    GoogleMapsLoader.REGION = 'GB';
  }

  componentDidMount() {
    GoogleMapsLoader.load((google) => {
      const options = {
        center: {lat: 51.5074, lng: 0.1278},
        zoom: 3
      };
      this._map = new google.maps.Map(this._mapDiv, options);
      this.updateMarkers(this.props.demo.samples);
    });
  }

  getSampleWithId(nodeId) {
    const {demo} = this.props;
    const {samples} = demo;
    for (let sampleKey in samples) {
      const sample = samples[sampleKey];
      if (sample.id === nodeId) {
        return sample;
      }
    }
  }

  getSampleIds() {
    const {demo} = this.props;
    const {samples} = demo;
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
    this._markers = [];
    for (let sampleKey in samples) {
      const sample = samples[sampleKey];
      const lat = parseFloat(sample.locationLatLngForTest.lat);
      const lng = parseFloat(sample.locationLatLngForTest.lng);
      const marker = new google.maps.Marker({
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
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
        console.log('map mouseover', sample.id);
        dispatch(NodeActions.setNodeHighlighted(sample.id, true));
      });
      marker.addListener('mouseout', (e) => {
        console.log('map mouseout', sample.id);
        dispatch(NodeActions.setNodeHighlighted(sample.id, false));
      });
      this._markers[sample.id] = marker;
    }
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

  componentWillReceiveProps(nextProps) {
    const {node} = nextProps;
    if (this.props.demo.samples !== nextProps.demo.samples) {
      this.updateMarkers(nextProps.demo.samples);
    }
    if (node.highlighted.length) {
      console.log('node.highlighted', node.highlighted);
      const nodeId = node.highlighted[0];
      const marker = this.markerForNodeId(nodeId);
      if (marker) {
        const markerLocation = marker.getPosition();
        const screenPosition = this.fromLatLngToPoint(markerLocation);
        const boundingClientRect = this._mapDiv.getBoundingClientRect();
        this._phyloCanvasTooltip.setNode(this.getSampleWithId(nodeId));
        this._phyloCanvasTooltip.setVisible(true, boundingClientRect.left + screenPosition.x, boundingClientRect.top + screenPosition.y);
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
            <div ref={(ref) => { this._mapDiv = ref; }} className={styles.map} />
            <PhyloCanvasTooltip ref={(ref) => { this._phyloCanvasTooltip = ref; }} />
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
    node: state.node,
    demo: state.demo
  };
}

Map.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  demo: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Map);
