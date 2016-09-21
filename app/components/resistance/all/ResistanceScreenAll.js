import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './ResistanceScreenAll.css';
import ResistanceProfile from 'components/resistance/ResistanceProfile';
import Phylogeny from './Phylogeny';
import Panel from  'components/ui/Panel';

class ResistanceScreenAll extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Panel title="Resistance Profile" columns={3}>
          <ResistanceProfile />
        </Panel>
        <Panel title="Phylogeny" columns={5}>
          <Phylogeny />
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

ResistanceScreenAll.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(ResistanceScreenAll);
