import PhyloCanvas from 'phylocanvas';
import React, { Component, PropTypes } from 'react';
import styles from './PhyloCanvasComponent.css';

// http://phylocanvas.org/docs/api/

class PhyloCanvasComponent extends Component {

  componentDidMount() {
    this._tree = PhyloCanvas.createTree(this._phyloCanvasDiv);
    this._tree.setTreeType(this.props.treeType);
    // this._tree.on('loaded', (e) => {
    //   console.log('loaded');
    //   this._tree.setNodeColourAndShape('8e8aa6db-175f-4078-9a14-692ace90b884', 'orange', 'x');
    // });
    this._tree.load(this.props.data);
    // let leaves = this._tree.findLeaves('8e8aa6db-175f-4078-9a14-692ace90b884');
    // this._tree.updateLeaves(leaves, 'colour', 'orange');
    // this._tree.updateLeaves(leaves, 'shape', 'star');
    // this._tree.updateLeaves(leaves, 'size', '100');

    let node = this._tree.findLeaves('8e8aa6db-175f-4078-9a14-692ace90b884')[0];
    node.setDisplay({
      colour: 'blue',
      shape: 'star',
      radius: 100000,
      leafStyle: {
        lineWidth: 20,
        strokeStyle: '#ff0000',
        fillStyle: 'lightblue',
      },
    });

    //   'colour': 'blue',
    //   shape: 'square',
    //   leafStyle: {
    //     fillStyle: 'lightblue',
    //   },
    // });
    // this._tree.updateLeaves(this._tree.findLeaves('8e8aa6db-175f-4078-9a14-692ace90b884'), 'highlighted', true);
    window.addEventListener('resize', (e) => { this.resize(); });
  }

  resize() {
    console.log('resize');
    // set size to zero so the parent container can flex to natural size
    this._tree.setSize(0, 0);
    // allow re-render using setTimeout
    setTimeout(() => {
      console.log('redraw');
      this._tree.resizeToContainer();
      this._tree.fitInPanel(); // TODO - may want to check if we are zoomed before doing this?
    }, 0);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this._tree.load(this.props.data);
    }
    if (prevProps.treeType !== this.props.treeType) {
      this._tree.setTreeType(this.props.treeType);
    }
  }

  render() {
    return (
      <div id="phyloCanvasDiv" ref={(ref) => { this._phyloCanvasDiv = ref; }} className={styles.container} />
    );
  }
}

PhyloCanvasComponent.propTypes = {
  data: PropTypes.string,
  treeType: PropTypes.string
};

export default PhyloCanvasComponent;
