import React, { Component, PropTypes } from 'react';
import styles from './Map.css';
import GoogleMapsLoader from 'google-maps';
import Phylogeny from 'components/phylogeny/Phylogeny';
import { connect } from 'react-redux';
import PhyloCanvasTooltip from 'components/ui/PhyloCanvasTooltip';
import * as NodeActions from 'actions/NodeActions';
import Key from 'components/header/Key';
import * as Colors from 'constants/Colors';

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
        maxZoom: 7,
        zoom: 3,
        backgroundColor: '#eae9e4',
        styles: mapStyle
      };
      this._google = google;
      this._map = new google.maps.Map(this._mapDiv, options);
      this.updateMarkers(this.props.analyser.transformed.samples);
    });
  }

  getSampleWithId(nodeId) {
    const {analyser} = this.props;
    const {samples} = analyser.transformed;
    for (let sampleKey in samples) {
      const sample = samples[sampleKey];
      if (sample.id === nodeId) {
        return sample;
      }
    }
  }

  getSampleIds() {
    const {analyser} = this.props;
    const {samples} = analyser.transformed;
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
      const marker = new this._google.maps.Marker({
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
    this.zoomToMarkers();
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

  zoomToMarkers() {
    let bounds = new this._google.maps.LatLngBounds();
    for (let id in this._markers) {
      console.log('this._markers[id].getPosition()', this._markers[id].getPosition());
      bounds.extend(this._markers[id].getPosition());
    }
    console.log('bounds', bounds);
    this._map.fitBounds(bounds);
  }

  componentWillReceiveProps(nextProps) {
    const {node} = nextProps;
    if (this.props.analyser.transformed.samples !== nextProps.analyser.transformed.samples) {
      this.updateMarkers(nextProps.analyser.transformed.samples);
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
    node: state.node
  };
}

Map.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Map);

const mapStyle = [
  {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#e9e9e9'
      },
      {
        'lightness': 17
      }
    ]
  },
  {
    'featureType': 'landscape',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#f5f5f5'
      },
      {
        'lightness': 20
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#ffffff'
      },
      {
        'lightness': 17
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#ffffff'
      },
      {
        'lightness': 29
      },
      {
        'weight': 0.2
      }
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#ffffff'
      },
      {
        'lightness': 18
      }
    ]
  },
  {
    'featureType': 'road.local',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#ffffff'
      },
      {
        'lightness': 16
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#f5f5f5'
      },
      {
        'lightness': 21
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#dedede'
      },
      {
        'lightness': 21
      }
    ]
  },
  {
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'visibility': 'on'
      },
      {
        'color': '#ffffff'
      },
      {
        'lightness': 16
      }
    ]
  },
  {
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'saturation': 36
      },
      {
        'color': '#333333'
      },
      {
        'lightness': 40
      }
    ]
  },
  {
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'transit',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#f2f2f2'
      },
      {
        'lightness': 19
      }
    ]
  },
  {
    'featureType': 'administrative',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#fefefe'
      },
      {
        'lightness': 20
      }
    ]
  },
  {
    'featureType': 'administrative',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#fefefe'
      },
      {
        'lightness': 17
      },
      {
        'weight': 1.2
      }
    ]
  }
];

