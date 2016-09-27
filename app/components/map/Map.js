import React, { Component } from 'react';
import styles from './Map.css';
import GoogleMapsLoader from 'google-maps';

import Phylogeny from 'components/phylogeny/Phylogeny';

class Map extends Component {
  componentDidMount() {
    GoogleMapsLoader.KEY = 'AIzaSyAe_EWm97fTPHqzfRrhu2DVwO_iseBQkAc';
    GoogleMapsLoader.REGION = 'GB';
    GoogleMapsLoader.load((google) => {
      const options = {
        center: {lat: 51.5074, lng: 0.1278},
        zoom: 3
      }
      new google.maps.Map(this._mapDiv, options);
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <div ref={(ref)=>{this._mapDiv=ref;}} className={styles.mapContainer}>
        </div>
        <Phylogeny className={styles.phylogenyContainer} />
      </div>
    );
  }
}

export default Map;
