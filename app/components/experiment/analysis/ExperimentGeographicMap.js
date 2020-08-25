/* @flow */

import * as React from 'react';
import { Loader, LoaderOptions } from 'google-maps';
import _get from 'lodash.get';
import MarkerClusterer from '@google/markerclustererplus';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

import { IconButton } from 'makeandship-js-common/src/components/ui/buttons';

import MapStyle from './MapStyle';
import makeSvgMarker from './makeSvgMarker';

import ExperimentsTooltip from '../../ui/ExperimentsTooltip';
import ExperimentsList from '../../ui/ExperimentsList';
import Empty from '../../ui/Empty';

import * as Colors from '../../../constants/Colors';

import styles from './ExperimentGeographicMap.module.scss';

export const DEFAULT_LAT = 51.5074;
export const DEFAULT_LNG = 0.1278;

const ExperimentGeographicMap = ({
  experiment,
  experimentIsolateId,
  experimentsHighlightedWithGeolocation,
  experimentsWithGeolocation,
  experimentsWithoutGeolocation,
  setExperimentsHighlighted,
}: React.ElementProps<*>): React.Element<*> => {
  const hasExperimentsWithGeolocation = !!(
    experimentsWithGeolocation && experimentsWithGeolocation.length
  );
  const hasExperimentsWithoutGeolocation = !!(
    experimentsWithoutGeolocation && experimentsWithoutGeolocation.length
  );

  const ref: { current: null | HTMLDivElement } = React.useRef(null);
  const googleRef = React.useRef(null);
  const markersRef = React.useRef([]);
  const mapRef = React.useRef(null);
  const overlayRef = React.useRef(null);

  const [markerClusterer, setMarkerClusterer] = React.useState(null);
  const [projection, setProjection] = React.useState(null);
  const [bounds, setBounds] = React.useState(null);

  const fromLatLngToPoint = React.useCallback(
    (latLng: any) => {
      if (!mapRef.current || !overlayRef.current || !projection || !bounds) {
        return { x: 0, y: 0 };
      }
      const overlayProjection = overlayRef.current.getProjection();
      if (!overlayProjection) {
        return { x: 0, y: 0 };
      }
      const point = overlayProjection.fromLatLngToContainerPixel(latLng);
      return point;
    },
    [projection, bounds]
  );

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

  const zoomToMarkers = React.useCallback(() => {
    if (!mapRef.current || !googleRef.current) {
      return;
    }
    let bounds = new googleRef.current.maps.LatLngBounds();
    markersRef.current.forEach((marker) => {
      bounds.extend(marker.getPosition());
    });
    mapRef.current.fitBounds(bounds);
  });

  const onMarkerClusterMouseOver = React.useCallback(
    (markerCluster) => {
      const markers = markerCluster.getMarkers();
      const experiments = markers.map((marker) => marker.get('experiment'));
      setExperimentsHighlighted(experiments);
    },
    [setExperimentsHighlighted]
  );

  const onMarkerMouseOver = React.useCallback(
    (marker) => {
      const experiments = [marker.get('experiment')];
      setExperimentsHighlighted(experiments);
    },
    [setExperimentsHighlighted]
  );

  React.useEffect(() => {
    if (!mapRef.current || !markerClusterer || !googleRef.current) {
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
      marker.addListener('mouseover', () => {
        onMarkerMouseOver(marker);
      });
      markersRef.current.push(marker);
    });
    markerClusterer.addMarkers(markersRef.current);
    zoomToMarkers();
  }, [markerClusterer, experimentsWithGeolocation]);

  const onProjectionChanged = React.useCallback(() => {
    if (!mapRef.current) {
      return;
    }
    const projection = mapRef.current.getProjection();
    setProjection(projection);
  }, [setProjection]);

  const onBoundsChanged = React.useCallback(() => {
    if (!mapRef.current) {
      return;
    }
    const bounds = mapRef.current.getBounds();
    setBounds(bounds);
  }, [setBounds]);

  const onIdle = React.useCallback(() => {
    if (!mapRef.current) {
      return;
    }
    const bounds = mapRef.current.getBounds();
    const projection = mapRef.current.getProjection();
    setBounds(bounds);
    setProjection(projection);
  }, [setBounds]);

  const onClick = React.useCallback(() => {
    setExperimentsHighlighted([]);
  }, [setExperimentsHighlighted]);

  const markerClustererCalculator = React.useCallback(
    (markers, numStyles) => {
      const text = `${markers.length}`;
      let highlighted = false;
      markers.some((marker) => {
        const markerExperiment = marker.get('experiment');
        if (experiment.id === markerExperiment.id) {
          highlighted = true;
        }
        return highlighted;
      });
      const index = highlighted ? 2 : 1;
      console.log(numStyles);
      return { text, index };
    },
    [experiment]
  );

  const setGoogleRef = React.useCallback((google) => {
    if (googleRef.current) {
      googleRef.current.maps.event.removeListener(onMarkerClusterMouseOver);
      googleRef.current.maps.event.removeListener(onProjectionChanged);
      googleRef.current.maps.event.removeListener(onBoundsChanged);
      googleRef.current.maps.event.removeListener(onIdle);
      googleRef.current.maps.event.removeListener(onClick);
    }
    googleRef.current = google;

    if (!googleRef.current) {
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

    const overlay = new googleRef.current.maps.OverlayView();
    overlay.setMap(mapRef.current);
    overlayRef.current = overlay;

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
        MarkerClusterer.withDefaultStyle({
          textColor: 'white',
          textSize: 16,
          width: 48,
          height: 48,
          url: makeSvgMarker({
            diameter: 48,
            color: Colors.COLOR_HIGHLIGHT_EXPERIMENT_FIRST,
          }),
        }),
      ],
      calculator: markerClustererCalculator,
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

    googleRef.current.maps.event.addListener(mapRef.current, 'idle', onIdle);

    googleRef.current.maps.event.addListener(mapRef.current, 'click', onClick);

    setMarkerClusterer(clusterer);
  });

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
    let experimentsByLatLng = {};
    if (
      !markerClusterer ||
      !experimentsHighlightedWithGeolocation ||
      !googleRef.current
    ) {
      return null;
    }
    const markerClusters = markerClusterer.getClusters();
    experimentsHighlightedWithGeolocation.forEach((experimentHighlighted) => {
      let handled = false;
      markerClusters.some((markerCluster) => {
        const center = markerCluster.getCenter();
        const markers = markerCluster.getMarkers();
        if (markers) {
          const experiments = markers.map((marker) => marker.get('experiment'));
          if (experiments.includes(experimentHighlighted)) {
            // show from cluster
            const key = JSON.stringify(center);
            if (!experimentsByLatLng[key]) {
              experimentsByLatLng[key] = [];
            }
            experimentsByLatLng[key].push(experimentHighlighted);
            handled = true;
          }
          return handled;
        }
      });
      if (!handled) {
        // show individually
        const markers = markerClusterer.getMarkers();
        const marker = markers.find((marker) => {
          const experiment = marker.get('experiment');
          return experiment === experimentHighlighted;
        });
        if (marker) {
          const position = marker.getPosition();
          const key = JSON.stringify(position);
          if (!experimentsByLatLng[key]) {
            experimentsByLatLng[key] = [];
          }
          experimentsByLatLng[key].push(experimentHighlighted);
        } else {
          console.log(
            'Could not find marker for experiment',
            experimentHighlighted
          );
        }
      }
    });

    const tooltips = [];

    Object.entries(experimentsByLatLng).forEach(([key, experiments]) => {
      const { lat, lng } = JSON.parse(key);
      const latLng = new googleRef.current.maps.LatLng(lat, lng);
      const tooltipLocation = screenPositionFromLatLng(latLng);
      tooltips.push(
        <ExperimentsTooltip
          key={key}
          experiment={experiment}
          experiments={experiments}
          x={tooltipLocation.x}
          y={tooltipLocation.y}
        />
      );
    });

    return tooltips;
  }, [
    markerClusterer,
    experimentsHighlightedWithGeolocation,
    bounds,
    projection,
  ]);

  return (
    <div className={styles.mapContainer}>
      {hasExperimentsWithGeolocation ? (
        <div ref={ref} className={styles.map} />
      ) : (
        <Empty
          icon={'globe'}
          title={'No geolocation'}
          subtitle={
            experimentsWithoutGeolocation.length > 1
              ? `No geolocation data for ${experimentIsolateId} or any of its nearest neighbours`
              : `No geolocation data for ${experimentIsolateId}`
          }
        />
      )}
      {hasExperimentsWithoutGeolocation && (
        <div className={styles.controlsContainerTop}>
          <UncontrolledDropdown>
            <DropdownToggle color="mid" outline size={'sm'}>
              {experimentsWithoutGeolocation.length} no location{' '}
              <i className="fa fa-caret-down" />
            </DropdownToggle>
            <DropdownMenu>
              <div className={styles.dropdownContent}>
                <ExperimentsList experiments={experimentsWithoutGeolocation} />
              </div>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      )}
      {hasExperimentsWithGeolocation && (
        <div className={styles.controlsContainerBottomLeft}>
          <IconButton
            size="sm"
            icon="search"
            onClick={zoomToMarkers}
            outline
            color="mid"
          >
            Zoom to fit
          </IconButton>
        </div>
      )}
      {tooltips}
    </div>
  );
};

export default ExperimentGeographicMap;
