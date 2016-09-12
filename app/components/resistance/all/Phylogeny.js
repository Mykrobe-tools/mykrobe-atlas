import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Phylogeny.css';

import PhyloCanvasComponent from 'components/ui/PhyloCanvasComponent';

class Phylogeny extends Component {
  render() {
    const {analyser} = this.props;
    const everything = JSON.stringify(analyser.transformed, null, 2);
    return (
      <div className={styles.container}>
        <div>
          <PhyloCanvasComponent style={styles.container} treeType="circular" data="((B:0.2,(C:0.3,D:0.4)E:0.5)F:0.1)A;" />
        </div>
        <div>
          Phylogeny - TODO: show on tree
        </div>
        <pre>
          Transformed JSON model:
          {everything}
        </pre>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

Phylogeny.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Phylogeny);
