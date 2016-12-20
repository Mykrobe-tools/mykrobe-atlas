/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './ResistanceAll.css';
import ResistanceProfile from '../resistance/ResistanceProfile';
import Panel from '../ui/Panel';
import Phylogeny from '../phylogeny/Phylogeny';

class ResistanceAll extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Panel title="Resistance Profile" columns={3}>
          <ResistanceProfile />
        </Panel>
        <Panel title="Phylogeny" columns={5}>
          <Phylogeny controlsInset={0} />
        </Panel>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

ResistanceAll.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(ResistanceAll);
