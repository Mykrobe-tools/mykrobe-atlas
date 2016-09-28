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
      this._map = new google.maps.Map(this._mapDiv, options);

      const london = {lat: 51.5074, lng: 0.1278};
      new google.maps.Marker({
        position: london,
        map: this._map
      });

      const bangalore = { lat: 12.97, lng: 77.59 };
      new google.maps.Marker({
        position: bangalore,
        map: this._map
      });
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div calssName={styles.headerTitle}>
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

export default Map;
