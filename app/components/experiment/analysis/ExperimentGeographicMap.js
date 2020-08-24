/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Loader, LoaderOptions } from 'google-maps';
import _get from 'lodash.get';
import _isEqual from 'lodash.isequal';
import MarkerClusterer from '@google/markerclustererplus';

import MapStyle from './MapStyle';

import styles from './ExperimentGeographicMap.module.scss';

export const DEFAULT_LAT = 51.5074;
export const DEFAULT_LNG = 0.1278;

const ExperimentGeographicMap = ({
  experiments,
  experimentsWithGeolocation,
  experimentsWithoutGeolocation,
}: React.ElementProps<*>): React.Element<*> => {
  const ref = React.useRef(null);
  const [map, setMap] = React.useState();
  React.useEffect(() => {
    const initMaps = async () => {
      const options: LoaderOptions = {
        version: '3.41', // https://developers.google.com/maps/documentation/javascript/versions#choosing-a-version-number
        region: 'GB',
      };
      const apiKey = window.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      const loader = new Loader(apiKey, options);
      const google = await loader.load();
      const googleMap = new google.maps.Map(ref.current, {
        center: { lat: DEFAULT_LAT, lng: DEFAULT_LNG },
        minZoom: 2,
        maxZoom: 10, // roughly allow you to see a city, without implying that samples came from a specific point within it
        zoom: 3,
        backgroundColor: '#e2e1dc',
        styles: MapStyle,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      });
      setMap(googleMap);
    };
    initMaps();
  }, [ref]);
  return <div ref={ref} className={styles.map} />;
};

export default ExperimentGeographicMap;
