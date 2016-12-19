/* @flow */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import styles from './Phylogeny.css'
import * as NodeActions from '../../actions/NodeActions'

import PhyloCanvasComponent from '../ui/PhyloCanvasComponent'
import PhyloCanvasTooltip from '../ui/PhyloCanvasTooltip'
import type { Sample } from '../../types/Sample'

const treeTypes = ['radial', 'rectangular', 'circular', 'diagonal', 'hierarchy']
const AUTO_ZOOM_SAMPLES = true

class Phylogeny extends Component {
  state: {
    treeType: string
  }
  _phyloCanvas: PhyloCanvasComponent
  _phyloCanvasTooltip: PhyloCanvasTooltip
  _container: Element

  constructor (props) {
    super(props)
    /*
    let samplesToHighlight = []
    for (let sampleKey in SAMPLE_DATA) {
      const sample = SAMPLE_DATA[sampleKey]
      const neighbours = sample.neighbours
      for (let neighbourKey in neighbours) {
        const neighbour = neighbours[neighbourKey]
        const distance = parseInt(neighbour.distance)
        if (distance <= MAX_DISTANCE) {
          const samples = neighbour.samples
          samplesToHighlight = samplesToHighlight.concat(samples)
        }
      }
    }
    this._samplesToHighlight = samplesToHighlight
    */

    // radial, rectangular, circular, diagonal and hierarchy
    this.state = {
      treeType: 'radial'
    }
  }

  nodeIsInSamplesToHighlight (node) {
    const index = this.getSampleIds().indexOf(node.id)
    return index !== -1
  }

  onNodeMouseOver (node) {
    const {dispatch} = this.props
    if (this.nodeIsInSamplesToHighlight(node)) {
      dispatch(NodeActions.setNodeHighlighted(node.id, true))
    }
  }

  onNodeMouseOut (node) {
    const {dispatch} = this.props
    if (this.nodeIsInSamplesToHighlight(node)) {
      dispatch(NodeActions.setNodeHighlighted(node.id, false))
    }
  }

  onLoad () {
    console.log('onLoad')
  }

  componentWillReceiveProps (nextProps) {
    const {node} = nextProps
    if (this.props.analyser.transformed.samples !== nextProps.analyser.transformed.samples) {
      // new samples
      setTimeout(() => {
        this.updateHighlightedSamples(nextProps.analyser.transformed.samples)
        if (AUTO_ZOOM_SAMPLES) {
          this.zoomSamples()
        }
      }, 0)
    }
    if (node.highlighted.length) {
      console.log('node.highlighted', node.highlighted)
      const nodeId = node.highlighted[0]
      const screenPosition = this._phyloCanvas.getPositionOfNodeWithId(nodeId)
      if (screenPosition) {
        const boundingClientRect = this._container.getBoundingClientRect()
        const sample = this.getSampleWithId(nodeId)
        if (sample) {
          this._phyloCanvasTooltip.setNode(sample)
          this._phyloCanvasTooltip.setVisible(true, boundingClientRect.left + screenPosition.x, boundingClientRect.top + screenPosition.y)
        }
      }
    } else {
      this._phyloCanvasTooltip.setVisible(false)
    }
  }

  render () {
    const {analyser, controlsInset} = this.props
    const {treeType} = this.state
    const newick = analyser.transformed.tree
    const insetStyle = {margin: `${controlsInset}px`}
    return (
      <div className={styles.container}>
        <div className={styles.contentContainer} ref={(ref) => { this._container = ref }}>
          <PhyloCanvasComponent
            ref={(ref) => { this._phyloCanvas = ref }}
            treeType={treeType}
            data={newick}
            onNodeMouseOver={(node) => { this.onNodeMouseOver(node) }}
            onNodeMouseOut={(node) => { this.onNodeMouseOut(node) }}
            onLoad={() => { this.onLoad() }}
            controlsInset={controlsInset}
          />
          <div className={styles.controlsContainer} style={insetStyle}>
            <div className={styles.zoomControl} onClick={(e) => { e.preventDefault(); this.zoomSamples() }}>
              <i className="fa fa-search" />
              <div className={styles.zoomControlText}>Fit samples</div>
            </div>
          </div>
          <div className={styles.demoTreeTypeContainer} style={insetStyle}>
            {treeTypes.map((thisTreeType, index) =>
              <div className={thisTreeType === treeType ? styles.demoTreeTypeSelected : styles.demoTreeType} key={index} onClick={(e) => {
                this.setState({treeType: thisTreeType})
                setTimeout(() => {
                  this.updateHighlightedSamples(analyser.transformed.samples)
                  if (AUTO_ZOOM_SAMPLES) {
                    this.zoomSamples()
                  }
                }, 0)
              }}>{thisTreeType}</div>
            )}
          </div>
          <PhyloCanvasTooltip ref={(ref) => { this._phyloCanvasTooltip = ref }} />
        </div>
      </div>
    )
  }

  getSampleWithId (nodeId): ?Sample {
    const {analyser} = this.props
    const {samples} = analyser.transformed
    for (let sampleKey in samples) {
      const sample = samples[sampleKey]
      if (sample.id === nodeId) {
        return sample
      }
    }
  }

  getSampleIds (): Array<string> {
    const {analyser} = this.props
    const {samples} = analyser.transformed
    let nodeIds = []
    for (let sampleKey in samples) {
      const sample = samples[sampleKey]
      nodeIds.push(sample.id)
    }
    return nodeIds
  }

  zoomSamples () {
    this._phyloCanvas.zoomToNodesWithIds(this.getSampleIds())
  }

  componentDidMount () {
    const {analyser} = this.props
    const {samples} = analyser.transformed
    this.updateHighlightedSamples(samples)
    if (AUTO_ZOOM_SAMPLES) {
      this.zoomSamples()
    }
  }

  updateHighlightedSamples (samples) {
    this._phyloCanvas.resetHighlightedNodes()
    for (let sampleKey in samples) {
      const sample = samples[sampleKey]
      this._phyloCanvas.highlightNodeWithId(sample.id, sample.colorForTest)
    }
  }

  componentWillUnmount () {
    const {dispatch} = this.props
    dispatch(NodeActions.unsetNodeHighlightedAll())
  }

  static defaultProps = {
    controlsInset: 30
  }
}

function mapStateToProps (state) {
  return {
    analyser: state.analyser,
    node: state.node
  }
}

Phylogeny.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  controlsInset: PropTypes.number
}

export default connect(mapStateToProps)(Phylogeny)
