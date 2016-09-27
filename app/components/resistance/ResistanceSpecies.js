import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute } from 'react-router';
import { connect } from 'react-redux';
import styles from './ResistanceSpecies.css';
import Panel from  'components/ui/Panel';

class ResistanceSpecies extends Component {
  render() {
    const {analyser} = this.props;
    const {speciesPretty} = analyser.transformed;

    return (
      <div className={styles.container}>
        <Panel title="Species" columns={8}>
          <div className={styles.species}>
            {speciesPretty}
          </div>
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

ResistanceSpecies.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.object
};

export default connect(mapStateToProps)(ResistanceSpecies);
