import React, { Component, PropTypes } from 'react';
import styles from './Map.css';
import GoogleMapsLoader from 'google-maps';
import Phylogeny from 'components/phylogeny/Phylogeny';
import { connect } from 'react-redux';

const TEST_DEMO_DATA = require('static/api/test_demo_data.json');
const GOOGLE_MAPS_API_KEY = 'AIzaSyAe_EWm97fTPHqzfRrhu2DVwO_iseBQkAc';

class Map extends Component {
  constructor(props) {
    super(props);
    GoogleMapsLoader.KEY = GOOGLE_MAPS_API_KEY;
    GoogleMapsLoader.REGION = 'GB';
  }

  componentDidMount() {
    this._markers = [];
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
          console.log('map mouseover', sample.id, e);
        });
        marker.addListener('mouseout', (e) => {
          console.log('map mouseout', sample.id, e);
        });
        this._markers.push(marker);
      }
    });
  }

  render() {
    const {node} = this.props;
    if ( node.highlighted.length ) {
      console.log('node.highlighted', node.highlighted);
    }
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            Showing samples :id1:, :id2: &middot; Add
          </div>
        </div>
        <div className={styles.mapAndPhylogenyContainer}>
          <div ref={(ref)=>{this._mapDiv=ref;}} className={styles.mapContainer}>
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
