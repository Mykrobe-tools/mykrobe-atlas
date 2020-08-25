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
  experimentsHighlightedWithGeolocation,
  experimentsWithGeolocation,
  experimentsWithoutGeolocation,
  setExperimentsHighlighted,
}: React.ElementProps<*>): React.Element<*> => {
  const ref = React.useRef(null);
  const googleRef = React.useRef(null);
  const markersRef = React.useRef([]);
  const mapRef = React.useRef(null);

  const [markerClusterer, setMarkerClusterer] = React.useState(null);
  const [projection, setProjection] = React.useState(null);
  const [bounds, setBounds] = React.useState(null);

  const fromLatLngToPoint = React.useCallback((latLng: any) => {
    if (!mapRef.current) {
      return { x: 0, y: 0 };
    }
    const TILE_SIZE = 256;
    const projection = mapRef.current.getProjection();
    const bounds = mapRef.current.getBounds();
    if (!projection) {
      return {
        x: 0,
        y: 0,
      };
    }
    const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
    const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
    const scale = Math.pow(2, mapRef.current.getZoom());
    const worldPoint = projection.fromLatLngToPoint(latLng);
    let x = worldPoint.x - bottomLeft.x;
    // FIXME: ugly fix for wrapping
    while (x < 0) {
      x += TILE_SIZE;
    }
    x *= scale;
    const y = (worldPoint.y - topRight.y) * scale;
    return { x, y };
  });

  const screenPositionFromLatLng = React.useCallback((latLng) => {
    if (!ref.current || !mapRef.current) {
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

  const onMarkerClusterMouseOver = React.useCallback(
    (markerCluster) => {
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
    },
    [setExperimentsHighlighted]
  );

  const onMarkerMouseOver = React.useCallback(
    (marker) => {
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
    },
    [setExperimentsHighlighted]
  );

  React.useEffect(() => {
    console.log('Updating markers');
    if (!mapRef.current || !markerClusterer || !googleRef.current) {
      console.log('Bailed');
      return;
    }
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markerClusterer.clearMarkers();
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
        map: mapRef.current,
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
    markerClusterer.addMarkers(markersRef.current);
    console.log('markersRef.current', markersRef.current);
    console.log('markerClusterer', markerClusterer);
    // this.zoomToMarkers();
  }, [markerClusterer, experimentsWithGeolocation]);

  const onProjectionChanged = React.useCallback(() => {
    const projection = mapRef.current.getProjection();
    setProjection(projection);
  }, [setProjection]);

  const onBoundsChanged = React.useCallback(() => {
    const bounds = mapRef.current.getBounds();
    setBounds(bounds);
  }, [setBounds]);

  const setGoogleRef = React.useCallback((google) => {
    if (googleRef.current) {
      googleRef.current.maps.event.removeListener(onMarkerClusterMouseOver);
      googleRef.current.maps.event.removeListener(onProjectionChanged);
      googleRef.current.maps.event.removeListener(onBoundsChanged);
    }
    googleRef.current = google;

    if (!google) {
      return;
    }

    const googleMap = new googleRef.current.maps.Map(ref.current, {
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
    mapRef.current = googleMap;

    const clusterer = new MarkerClusterer(mapRef.current, [], {
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

    googleRef.current.maps.event.addListener(
      clusterer,
      'mouseover',
      onMarkerClusterMouseOver
    );

    googleRef.current.maps.event.addListenerOnce(
      mapRef.current,
      'projection_changed',
      onProjectionChanged
    );

    googleRef.current.maps.event.addListener(
      mapRef.current,
      'bounds_changed',
      onBoundsChanged
    );

    setMarkerClusterer(clusterer);

    console.log('markerClusterer', markerClusterer);

    // updateMarkers();
  });

  // React.useEffect(() => {
  //   updateMarkers();
  // }, [experimentsWithGeolocation]);

  React.useEffect(() => {
    const initMaps = async () => {
      const options: LoaderOptions = {
        version: '3.41', // https://developers.google.com/maps/documentation/javascript/versions#choosing-a-version-number
        region: 'GB',
      };
      const apiKey = window.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      const loader = new Loader(apiKey, options);
      const google = await loader.load();
      setGoogleRef(google);
    };
    if (ref.current) {
      initMaps();
    }
  }, [ref]);

  const tooltips = React.useMemo(() => {
    console.log('Here we go');
    if (markerClusterer && experimentsHighlightedWithGeolocation) {
      const markerClusters = markerClusterer.getClusters();
      console.log({ markerClusters });
      experimentsHighlightedWithGeolocation.forEach((experimentHighlighted) => {
        markerClusters.forEach((markerCluster) => {
          const markers = markerCluster.getMarkers();
          const experiments = markers.map((marker) => marker.get('experiment'));
          if (experiments.includes(experimentHighlighted)) {
            console.log('Within cluster:', experimentHighlighted);
          }
        });
      });

      // experimentsHighlightedWithGeolocation.forEach((experiment) => {
      //   // is it within a marker?
      // });
    } else {
      console.log('Nope');
    }
  }, [
    markerClusterer,
    experimentsHighlightedWithGeolocation,
    bounds,
    projection,
  ]);

  return (
    <div className={styles.mapContainer}>
      <div ref={ref} className={styles.map} />
      <pre>{JSON.stringify(tooltips, null, 2)}</pre>
    </div>
  );
};

export default ExperimentGeographicMap;
