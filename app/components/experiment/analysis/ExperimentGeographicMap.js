/* @flow */

import * as React from 'react';
import { Loader } from '@googlemaps/js-api-loader';
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
  resetExperimentsHighlighted,
  experimentDistanceIsSearching,
}: React.ElementProps<*>): React.Element<*> => {
  const hasExperimentsWithGeolocation = !!(
    experimentsWithGeolocation && experimentsWithGeolocation.length
  );
  const hasExperimentsWithoutGeolocation = !!(
    experimentsWithoutGeolocation && experimentsWithoutGeolocation.length
  );
  const experimentIsInExperimentsWithoutGeolocation =
    experiment &&
    experimentsWithoutGeolocation &&
    experimentsWithoutGeolocation.map(({ id }) => id).includes(experiment.id);

  // refs for instance and storage
  // ref to the div that the map will render into
  const ref: { current: null | HTMLDivElement } = React.useRef(null);
  // google class instance
  const googleRef = React.useRef(null);
  // map instance
  const mapRef = React.useRef(null);
  // map overlay instance (used to compute pixel coordinates)
  const overlayRef = React.useRef(null);
  // array of markers
  const markersRef = React.useRef([]);
  // array of listeners
  const listenersRef = React.useRef([]);

  // state values that may cause re-render
  const [markerClusterer, setMarkerClusterer] = React.useState(null);
  const [projection, setProjection] = React.useState(null);
  const [bounds, setBounds] = React.useState(null);

  // conversion from lat / lng to screen position pixels

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

  // zoom to fit markers in current viewport

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

  // marker user interaction handlers

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

  // update the markers on the map when the clusterer or experiments change

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
      // custom marker value that can be retreived
      marker.setValues({ experiment });
      marker.addListener('mouseover', () => {
        onMarkerMouseOver(marker);
      });
      markersRef.current.push(marker);
    });
    markerClusterer.addMarkers(markersRef.current);
    // when markers are updated, fit to viewport
    zoomToMarkers();
  }, [markerClusterer, experimentsWithGeolocation]);

  // map projection change should cause tooltip position re-render
  const onProjectionChanged = React.useCallback(() => {
    if (!mapRef.current) {
      return;
    }
    const projection = mapRef.current.getProjection();
    setProjection(projection);
  }, [setProjection]);

  // map bounds change should cause tooltip position re-render
  const onBoundsChanged = React.useCallback(() => {
    if (!mapRef.current) {
      return;
    }
    const bounds = mapRef.current.getBounds();
    setBounds(bounds);
  }, [setBounds]);

  // idle event after zoom animation - cause tooltip position re-render
  const onIdle = React.useCallback(() => {
    if (!mapRef.current) {
      return;
    }
    const bounds = mapRef.current.getBounds();
    const projection = mapRef.current.getProjection();
    setBounds(bounds);
    setProjection(projection);
  }, [setBounds]);

  // click on the map - unset highlight
  const onClick = React.useCallback(() => {
    resetExperimentsHighlighted();
  }, [resetExperimentsHighlighted]);

  // determine what text and which style to use for each marker cluster
  const markerClustererCalculator = React.useCallback(
    (markers) => {
      const text = `${markers.length}`;
      let highlighted = false;
      if (experiment) {
        // check if this cluser contains the current experiment
        markers.some((marker) => {
          const markerExperiment = marker.get('experiment');
          if (experiment.id === markerExperiment.id) {
            highlighted = true;
          }
          return highlighted;
        });
      }
      // if so, use the highlight style
      const index = highlighted ? 2 : 1;
      return { text, index };
    },
    [experiment]
  );

  // using a callback to set the google ref gives a way to cleanup previous events
  const setGoogleRef = React.useCallback(
    (google) => {
      if (googleRef.current) {
        // clean up listeners
        listenersRef.current.forEach((listener) => {
          googleRef.current.maps.event.removeListener(listener);
        });
        listenersRef.current = [];
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

      // overlay is used to calculate pixel positions
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

      listenersRef.current.push(
        googleRef.current.maps.event.addListener(
          clusterer,
          'mouseover',
          onMarkerClusterMouseOver
        )
      );

      listenersRef.current.push(
        googleRef.current.maps.event.addListener(
          mapRef.current,
          'projection_changed',
          onProjectionChanged
        )
      );

      listenersRef.current.push(
        googleRef.current.maps.event.addListener(
          mapRef.current,
          'bounds_changed',
          onBoundsChanged
        )
      );

      listenersRef.current.push(
        googleRef.current.maps.event.addListener(mapRef.current, 'idle', onIdle)
      );
      listenersRef.current.push(
        googleRef.current.maps.event.addListener(
          mapRef.current,
          'click',
          onClick
        )
      );

      // this will trigger the side-effect which updates markers and initialises zoom
      setMarkerClusterer(clusterer);
    },
    [setMarkerClusterer]
  );

  // initialisation once the map div ref is set
  const setRef = React.useCallback(
    (node) => {
      const initMaps = async () => {
        if (!window?.google?.maps) {
          const apiKey = window.env.REACT_APP_GOOGLE_MAPS_API_KEY;
          const options = {
            apiKey,
            version: 'weekly',
            region: 'GB',
          };
          const loader = new Loader(options);
          await loader.load();
        }
        setGoogleRef(window.google);
      };
      ref.current = node;
      if (ref.current) {
        initMaps();
      }
      return () => {
        // cleanup listeners
        setGoogleRef(null);
      };
    },
    [setGoogleRef]
  );

  // derive the tooltips and their positions
  const tooltips = React.useMemo(() => {
    let experimentsByLatLng = {};
    if (
      !markerClusterer ||
      !experimentsHighlightedWithGeolocation ||
      !googleRef.current
    ) {
      return null;
    }
    const markers = markerClusterer.getMarkers();
    if (!markers.length) {
      return null;
    }
    const markerClusters = markerClusterer.getClusters();
    experimentsHighlightedWithGeolocation.forEach((experimentHighlighted) => {
      let handled = false;
      markerClusters.some((markerCluster) => {
        const center = markerCluster.getCenter();
        const clusterMarkers = markerCluster.getMarkers();
        if (clusterMarkers) {
          const experiments = clusterMarkers.map((marker) =>
            marker.get('experiment')
          );
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
        if (markers.length) {
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
            // Not found - map, markers and data may be loading and out of sync
          }
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
        <div ref={setRef} className={styles.map} />
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
      <div className={styles.controlsContainerTop}>
        {experimentDistanceIsSearching
          ? 'Searching…'
          : hasExperimentsWithoutGeolocation && (
              <UncontrolledDropdown>
                <DropdownToggle color="mid" outline size={'sm'}>
                  {experimentIsInExperimentsWithoutGeolocation && (
                    <span className={styles.highlighted}>
                      <i className="fa fa-circle" />{' '}
                    </span>
                  )}
                  {experimentsWithoutGeolocation.length} No location{' '}
                  <i className="fa fa-caret-down" />
                </DropdownToggle>
                <DropdownMenu>
                  <div className={styles.dropdownContent}>
                    <ExperimentsList
                      experiment={experiment}
                      experiments={experimentsWithoutGeolocation}
                    />
                  </div>
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
      </div>
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
