/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './ResistanceSpecies.css';
import Panel from '../ui/Panel';

class ResistanceSpecies extends Component {
  render() {
    const { analyser } = this.props;
    const { speciesPretty } = analyser.transformed;

    return (
      <div className={styles.container}>
        <Panel title="Species" columns={8}>
          <div
            className={styles.species}
            dangerouslySetInnerHTML={{ __html: speciesPretty }}
          />
        </Panel>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
  };
}

ResistanceSpecies.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default connect(mapStateToProps)(ResistanceSpecies);
