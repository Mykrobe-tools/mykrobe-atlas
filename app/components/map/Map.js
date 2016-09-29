import React, { Component, PropTypes } from 'react';
import styles from './Map.css';
import GoogleMapsLoader from 'google-maps';
import Phylogeny from 'components/phylogeny/Phylogeny';
import { connect } from 'react-redux';
import PhyloCanvasTooltip from 'components/ui/PhyloCanvasTooltip';
import * as NodeActions from 'actions/NodeActions';

const TEST_DEMO_DATA = require('static/api/test_demo_data.json');
const GOOGLE_MAPS_API_KEY = 'AIzaSyAe_EWm97fTPHqzfRrhu2DVwO_iseBQkAc';

class Map extends Component {
  constructor(props) {
    super(props);
    GoogleMapsLoader.KEY = GOOGLE_MAPS_API_KEY;
    GoogleMapsLoader.REGION = 'GB';
  }

  componentDidMount() {
    const {dispatch} = this.props;
    this._markers = {};
    this._samples = {};
    GoogleMapsLoader.load((google) => {
      const options = {
        center: {lat: 51.5074, lng: 0.1278},
        zoom: 3
      }
      this._map = new google.maps.Map(this._mapDiv, options);

      for (let sampleKey in TEST_DEMO_DATA) {
        const sample = TEST_DEMO_DATA[sampleKey];
        const lat = parseFloat(sample.locationLatLngForTest.lat);
        const lng = parseFloat(sample.locationLatLngForTest.lng);
        const marker = new google.maps.Marker({
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
        this._samples[sample.id] = sample;
      }
    });
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
    const y =  (worldPoint.y - topRight.y) * scale;
    return {x, y};
  }

  componentWillReceiveProps(nextProps) {
    const {node} = nextProps;
    if ( node.highlighted.length ) {
      console.log('node.highlighted', node.highlighted);
      const nodeId = node.highlighted[0];
      const marker = this.markerForNodeId(nodeId);
      if ( marker ) {
        const markerLocation = marker.getPosition();
        const screenPosition = this.fromLatLngToPoint(markerLocation);
        const boundingClientRect = this._mapDiv.getBoundingClientRect();
        this._phyloCanvasTooltip.setNode(this._samples[nodeId]);
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
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            Showing samples :id1:, :id2: &middot; Add
          </div>
        </div>
        <div className={styles.mapAndPhylogenyContainer}>
          <div className={styles.mapContainer}>
            <div ref={(ref)=>{this._mapDiv=ref;}} className={styles.map} />
            <PhyloCanvasTooltip ref={(ref) => {this._phyloCanvasTooltip = ref;}} />
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
