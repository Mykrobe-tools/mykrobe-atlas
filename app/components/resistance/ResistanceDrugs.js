/* @flow */

import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute } from 'react-router';
import { connect } from 'react-redux';
import styles from './ResistanceDrugs.css';
import Panel from 'components/ui/Panel';
import * as AnalyserActions from 'actions/AnalyserActions';

const firstLineDrugs = [
  'Isoniazid',
  'Rifampicin',
  'Ethambutol',
  'Pyrazinamide'
];

const secondLineDrugs = [
  'Quinolones',
  'Streptomycin',
  'Amikacin',
  'Capreomycin',
  'Kanamycin'
];

class ResistanceDrugs extends Component {
  render() {
    // TODO: need to display XDR / MDR status here?
    return (
      <div className={styles.container}>
        <Panel title="First line drugs" columns={4}>
          {this.listDrugsWithIndicators(firstLineDrugs)}
        </Panel>
        <Panel title="Second line drugs" columns={4}>
          {this.listDrugsWithIndicators(secondLineDrugs)}
        </Panel>
      </div>
    );
  }

  listDrugsWithIndicators(drugs) {
    const {analyser} = this.props;
    const {resistant, susceptible, inconclusive} = analyser.transformed;
    let elements = [];
    drugs.forEach((drug, index) => {
      let indicators = [];
      if (resistant.indexOf(drug) !== -1) {
        indicators.push(
          <div key={'resistant'} className={styles.resistant}>Resistant</div>
        );
      }
      if (susceptible.indexOf(drug) !== -1) {
        indicators.push(
          <div key={'susceptible'} className={styles.susceptible}>Susceptible</div>
        );
      }
      if (inconclusive.indexOf(drug) !== -1) {
        indicators.push(
          <div key={'inconclusive'} className={styles.inconclusive}>Inconclusive</div>
        );
      }
      elements.push(
        <div key={`ELEMENT_${index}`}>{drug} {indicators}</div>
      );
    });

    return (
      <div className={styles.drugs}>
        {elements}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

ResistanceDrugs.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.object
};

export default connect(mapStateToProps)(ResistanceDrugs);
