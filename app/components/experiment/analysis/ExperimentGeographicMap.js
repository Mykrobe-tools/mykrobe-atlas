/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Loader, LoaderOptions } from 'google-maps';
import _get from 'lodash.get';
import _isEqual from 'lodash.isequal';
import MarkerClusterer from '@google/markerclustererplus';

import MapStyle from './MapStyle';
import makeSvgMarker from './makeSvgMarker';

import * as Colors from '../../../constants/Colors';

import styles from './ExperimentGeographicMap.module.scss';

export const DEFAULT_LAT = 51.5074;
export const DEFAULT_LNG = 0.1278;

const ExperimentGeographicMap = ({
  experiments,
  experimentsWithGeolocation,
  experimentsWithoutGeolocation,
  setExperimentsHighlighted,
}: React.ElementProps<*>): React.Element<*> => {
  const ref = React.useRef(null);
  const googleRef = React.useRef(null);
  const markersRef = React.useRef(null);
  const markerClustererRef = React.useRef(null);

  const [map, setMap] = React.useState();

  const fromLatLngToPoint = (latLng: any) => {
    if (!map) {
      return { x: 0, y: 0 };
    }
    const TILE_SIZE = 256;
    const projection = map.getProjection();
    const bounds = map.getBounds();
    if (!projection) {
      return {
        x: 0,
        y: 0,
      };
    }
    const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
    const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
    const scale = Math.pow(2, map.getZoom());
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

  const screenPositionFromLatLng = React.useCallback((latLng) => {
    if (!ref.current || !map) {
      return { x: 0, y: 0 };
    }
    const divPosition = fromLatLngToPoint(latLng);
    const boundingClientRect = ref.current.getBoundingClientRect();
    const screenPosition = {
      x: boundingClientRect.left + divPosition.x,
      y: boundingClientRect.top + divPosition.y,
    };
    return screenPosition;
  });

  const onMarkerClusterMouseOver = React.useCallback((markerCluster) => {
    console.log('onMarkerClusterMouseOver', markerCluster);
    const experimentsTooltipLocation = screenPositionFromLatLng(
      markerCluster.getCenter()
    );
    const markers = markerCluster.getMarkers();
    const experiments = markers.map((marker) => marker.get('experiment'));
    setExperimentsHighlighted(experiments);
    console.log({ experimentsTooltipLocation });
    // this.setState({
    //   experimentsTooltipLocation,
    //   trackingMarkerCluster: markerCluster,
    //   trackingMarker: undefined,
    // });
  });

  const onMarkerMouseOver = (marker) => {
    console.log('onMarkerMouseOver', marker);
    const experimentsTooltipLocation = screenPositionFromLatLng(
      marker.getPosition()
    );
    const experiments = [marker.get('experiment')];
    setExperimentsHighlighted(experiments);
    console.log({ experimentsTooltipLocation });
    // this.setState({
    //   experimentsTooltipLocation,
    //   trackingMarkerCluster: undefined,
    //   trackingMarker: marker,
    // });
  };

  React.useEffect(() => {
    if (!map || !markerClustererRef.current || !googleRef.current) {
      return;
    }
    // if (markersRef.current) {
    //   for (let markerKey in markersRef.current) {
    //     const marker = markersRef.current[markerKey];
    //     marker.setMap(null);
    //   }
    // }
    markerClustererRef.current.clearMarkers();
    markersRef.current = [];
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

      const marker = new googleRef.current.maps.Marker({
        icon: {
          url: makeSvgMarker({
            diameter: 24,
            color:
              index === 0
                ? Colors.COLOR_HIGHLIGHT_EXPERIMENT_FIRST
                : Colors.COLOR_HIGHLIGHT_EXPERIMENT,
          }),
          anchor: new googleRef.current.maps.Point(12, 12),
          size: new googleRef.current.maps.Size(24, 24),
          scaledSize: new googleRef.current.maps.Size(24, 24),
        },
        position: new googleRef.current.maps.LatLng(lat, lng),
        map,
      });
      marker.setValues({ experiment });
      // marker.addListener('mouseover', () => {
      //   setNodeHighlighted(experiment.id, true);
      // });
      marker.addListener('mouseover', () => {
        onMarkerMouseOver(marker);
      });

      // marker.addListener('mouseout', () => {
      //   setNodeHighlighted(experiment.id, false);
      // });
      markersRef.current.push(marker);
    });
    markerClustererRef.current.addMarkers(markersRef.current);
    console.log('markersRef.current', markersRef.current);
    console.log('markerClustererRef.current', markerClustererRef.current);
    // this.zoomToMarkers();
  }, [googleRef, map, markerClustererRef, experimentsWithGeolocation]);

  React.useEffect(() => {
    const initMaps = async () => {
      const options: LoaderOptions = {
        version: '3.41', // https://developers.google.com/maps/documentation/javascript/versions#choosing-a-version-number
        region: 'GB',
      };
      const apiKey = window.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      const loader = new Loader(apiKey, options);
      const google = await loader.load();
      googleRef.current = google;

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

      const markerClusterer = new MarkerClusterer(map, [], {
        averageCenter: true,
        minimumClusterSize: 2,
        styles: [
          MarkerClusterer.withDefaultStyle({
            textColor: 'white',
            textSize: 16,
            width: 48,
            height: 48,
            url: makeSvgMarker({ diameter: 48 }),
          }),
        ],
      });
      markerClustererRef.current = markerClusterer;

      console.log('markerClusterer', markerClusterer);

      google.maps.event.addListener(
        markerClusterer,
        'mouseover',
        onMarkerClusterMouseOver
      );
    };
    if (ref.current) {
      initMaps();
    }
    return () => {
      googleRef.current?.maps.event.removeListener(onMarkerClusterMouseOver);
    };
  }, [ref]);

  return <div ref={ref} className={styles.map} />;
};

export default ExperimentGeographicMap;
