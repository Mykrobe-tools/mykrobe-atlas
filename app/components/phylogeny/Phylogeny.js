/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash.isequal';
import _get from 'lodash.get';

import styles from './Phylogeny.scss';

import PhyloCanvasComponent from '../ui/PhyloCanvasComponent';
import PhyloCanvasTooltip from '../ui/PhyloCanvasTooltip';
import type { SampleType } from '../../types/SampleType';

const treeTypes = [
  'radial',
  'rectangular',
  'circular',
  'diagonal',
  'hierarchy',
];
const AUTO_ZOOM_SAMPLES = true;

type State = {
  treeType: string,
};

class Phylogeny extends React.Component<*, State> {
  _phyloCanvas: ?PhyloCanvasComponent;
  _phyloCanvasTooltip: ?PhyloCanvasTooltip;
  _container: ?Element;

  constructor(props) {
    super(props);
    /*
    let samplesToHighlight = [];
    for (let sampleKey in SAMPLE_DATA) {
      const sample = SAMPLE_DATA[sampleKey];
      const neighbours = sample.neighbours;
      for (let neighbourKey in neighbours) {
        const neighbour = neighbours[neighbourKey];
        const distance = parseInt(neighbour.distance);
        if (distance <= MAX_DISTANCE) {
          const samples = neighbour.samples;
          samplesToHighlight = samplesToHighlight.concat(samples);
        }
      }
    }
    this._samplesToHighlight = samplesToHighlight;
    */

    // radial, rectangular, circular, diagonal and hierarchy
    this.state = {
      treeType: 'radial',
    };
  }

  nodeIsInSamplesToHighlight = node => {
    return this.getSampleIds().includes(node.id);
  };

  onNodeMouseOver = node => {
    const { setNodeHighlighted } = this.props;
    if (this.nodeIsInSamplesToHighlight(node)) {
      setNodeHighlighted(node.id, true);
    }
  };

  onNodeMouseOut = node => {
    const { setNodeHighlighted } = this.props;
    if (this.nodeIsInSamplesToHighlight(node)) {
      setNodeHighlighted(node.id, false);
    }
  };

  onLoad = () => {
    console.log('onLoad');
  };

  componentDidMount = () => {
    // const { experimentTransformed } = this.props;
    // const { samples } = experimentTransformed;
    // this.updateHighlightedSamples(samples);
    this.updateMarkers();
    this.updateHighlighted();
    if (AUTO_ZOOM_SAMPLES) {
      this.zoomSamples();
    }
  };

  componentDidUpdate = (prevProps: any) => {
    const { highlighted, experiments, experimentsTree } = this.props;
    const treeChanged = !_isEqual(experimentsTree, prevProps.experimentsTree);

    if (treeChanged || !_isEqual(experiments, prevProps.experiments)) {
      this.updateMarkers();
    }
    if (treeChanged || !_isEqual(highlighted, prevProps.highlighted)) {
      this.updateHighlighted();
    }
  };

  // componentDidUpdate = prevProps => {
  //   const { highlighted } = this.props;
  //   if (
  //     this.props.experimentTransformed.samples !==
  //     nextProps.experimentTransformed.samples
  //   ) {
  //     // new samples
  //     setTimeout(() => {
  //       this.updateHighlightedSamples(nextProps.experimentTransformed.samples);
  //       if (AUTO_ZOOM_SAMPLES) {
  //         this.zoomSamples();
  //       }
  //     }, 0);
  //   }
  //   if (highlighted.length) {
  //     console.log('highlighted', highlighted);
  //     const nodeId = highlighted[0];
  //     const screenPosition = this._phyloCanvas.getPositionOfNodeWithId(nodeId);
  //     if (screenPosition) {
  //       const boundingClientRect = this._container.getBoundingClientRect();
  //       const sample = this.getSampleWithId(nodeId);
  //       if (sample) {
  //         this._phyloCanvasTooltip.setNode(sample);
  //         this._phyloCanvasTooltip.setVisible(
  //           true,
  //           boundingClientRect.left + screenPosition.x,
  //           boundingClientRect.top + screenPosition.y
  //         );
  //       }
  //     }
  //   } else {
  //     this._phyloCanvasTooltip && this._phyloCanvasTooltip.setVisible(false);
  //   }
  // }

  updateMarkers = () => {
    const { experiments } = this.props;
    if (!this._phyloCanvas) {
      return;
    }
    this._phyloCanvas.resetHighlightedNodes();
    experiments.forEach(experiment => {
      const isolateId = _get(experiment, 'metadata.sample.isolateId') || '–';
      this._phyloCanvas.highlightNodeWithId(isolateId, '#0f82d0');
    });
    // for (let sampleKey in samples) {
    //   const sample = samples[sampleKey];
    //   this._phyloCanvas.highlightNodeWithId(sample.id, '#0f82d0');
    // }
  };

  updateHighlighted = () => {
    const { highlighted } = this.props;
    if (highlighted && highlighted.length) {
      const nodeId = highlighted[0];
      const screenPosition = this._phyloCanvas.getPositionOfNodeWithId(nodeId);
      if (screenPosition) {
        const boundingClientRect = this._container.getBoundingClientRect();
        const sample = this.getSampleWithId(nodeId);
        if (sample) {
          this._phyloCanvasTooltip.setNode(sample);
          this._phyloCanvasTooltip.setVisible(
            true,
            boundingClientRect.left + screenPosition.x,
            boundingClientRect.top + screenPosition.y
          );
        }
      }
    } else {
      this._phyloCanvasTooltip && this._phyloCanvasTooltip.setVisible(false);
    }
  };

  onContainerRef = (ref: any) => {
    this._container = ref;
  };

  onPhyloCanvasRef = (ref: any) => {
    this._phyloCanvas = ref;
    this.updateMarkers();
  };

  onPhyloCanvasTooltipRef = (ref: any) => {
    this._phyloCanvasTooltip = ref;
  };

  render() {
    const {
      experimentTransformed,
      controlsInset,
      experimentsTree,
    } = this.props;
    const { treeType } = this.state;
    console.log('experimentsTree', experimentsTree);
    if (!experimentsTree) {
      return null;
    }
    const newick = experimentsTree.tree;
    const insetStyle = { margin: `${controlsInset}px` };
    return (
      <div className={styles.container}>
        <div className={styles.contentContainer} ref={this.onContainerRef}>
          <PhyloCanvasComponent
            ref={this.onPhyloCanvasRef}
            treeType={treeType}
            data={newick}
            onNodeMouseOver={this.onNodeMouseOver}
            onNodeMouseOut={this.onNodeMouseOut}
            onLoad={this.onLoad}
            controlsInset={controlsInset}
          />
          <div className={styles.controlsContainer} style={insetStyle}>
            <div
              className={styles.zoomControl}
              onClick={e => {
                e.preventDefault();
                this.zoomSamples();
              }}
            >
              <i className="fa fa-search" />
              <div className={styles.zoomControlText}>Fit samples</div>
            </div>
          </div>
          <div className={styles.demoTreeTypeContainer} style={insetStyle}>
            {treeTypes.map((thisTreeType, index) => (
              <div
                className={
                  thisTreeType === treeType
                    ? styles.demoTreeTypeSelected
                    : styles.demoTreeType
                }
                key={index}
                onClick={() => {
                  this.setState({ treeType: thisTreeType });
                  setTimeout(() => {
                    this.updateHighlightedSamples(
                      experimentTransformed.samples
                    );
                    if (AUTO_ZOOM_SAMPLES) {
                      this.zoomSamples();
                    }
                  }, 0);
                }}
              >
                {thisTreeType}
              </div>
            ))}
          </div>
          <PhyloCanvasTooltip ref={this.onPhyloCanvasTooltipRef} />
        </div>
      </div>
    );
  }

  getSampleWithId = (nodeId: string): ?SampleType => {
    const { experiments } = this.props;
    return experiments.find(experiment => {
      const isolateId = _get(experiment, 'metadata.sample.isolateId');
      return isolateId === nodeId;
    });
  };

  getSampleIds = (): Array<string> => {
    const { experiments } = this.props;
    const isolateIds = experiments
      .map(experiment => {
        const isolateId = _get(experiment, 'metadata.sample.isolateId');
        return isolateId;
      })
      .filter(isolateId => !!isolateId);
    return isolateIds;
  };

  zoomSamples = () => {
    if (!this._phyloCanvas) {
      return;
    }
    this._phyloCanvas.zoomToNodesWithIds(this.getSampleIds());
  };

  // updateHighlightedSamples(samples) {
  //   if (!this._phyloCanvas) {
  //     return;
  //   }
  //   this._phyloCanvas.resetHighlightedNodes();
  //   for (let sampleKey in samples) {
  //     const sample = samples[sampleKey];
  //     this._phyloCanvas.highlightNodeWithId(sample.id, '#0f82d0');
  //   }
  // }

  componentWillUnmount() {
    const { unsetNodeHighlightedAll } = this.props;
    unsetNodeHighlightedAll();
  }

  static defaultProps = {
    controlsInset: 30,
  };
}

Phylogeny.propTypes = {
  experiment: PropTypes.object,
  experimentTransformed: PropTypes.object,
  highlighted: PropTypes.array,
  controlsInset: PropTypes.number,
  setNodeHighlighted: PropTypes.func,
  unsetNodeHighlightedAll: PropTypes.func,
  experimentsTree: PropTypes.object,
};

export default Phylogeny;
