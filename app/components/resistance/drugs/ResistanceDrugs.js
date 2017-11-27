/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './ResistanceDrugs.css';
import Panel from '../../ui/Panel';

const firstLineDrugs = [
  'Isoniazid',
  'Rifampicin',
  'Ethambutol',
  'Pyrazinamide',
];

const secondLineDrugs = [
  'Quinolones',
  'Streptomycin',
  'Amikacin',
  'Capreomycin',
  'Kanamycin',
];

class ResistanceDrugs extends React.Component {
  renderDrugResistance() {
    const { analyser } = this.props;
    const { drugsResistance: { xdr, mdr } } = analyser.transformed;
    if (mdr || xdr) {
      return (
        <Panel title="Resistance" columns={4}>
          <div className={styles.drugs}>
            {xdr && <div>Extensively Drug Resistant (XDR)</div>}
            {mdr && <div>Multi-Drug Resistant (MDR)</div>}
          </div>
        </Panel>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className={styles.container} data-tid="component-resistance-drugs">
        <Panel title="First line drugs">
          {this.listDrugsWithIndicators(firstLineDrugs)}
        </Panel>
        <Panel title="Second line drugs">
          {this.listDrugsWithIndicators(secondLineDrugs)}
        </Panel>
        {this.renderDrugResistance()}
      </div>
    );
  }

  listDrugsWithIndicators(drugs) {
    const { analyser } = this.props;
    const { resistant, susceptible, inconclusive } = analyser.transformed;
    let elements = [];
    drugs.forEach((drug, index) => {
      let indicators = [];
      if (resistant.indexOf(drug) !== -1) {
        indicators.push(
          <div key={'resistant'} className={styles.resistant}>
            Resistant
          </div>
        );
      }
      if (susceptible.indexOf(drug) !== -1) {
        indicators.push(
          <div key={'susceptible'} className={styles.susceptible}>
            Susceptible
          </div>
        );
      }
      if (inconclusive.indexOf(drug) !== -1) {
        indicators.push(
          <div key={'inconclusive'} className={styles.inconclusive}>
            Inconclusive
          </div>
        );
      }
      elements.push(
        <div key={`ELEMENT_${index}`}>
          {drug} {indicators}
        </div>
      );
    });

    return <div className={styles.drugs}>{elements}</div>;
  }
}

ResistanceDrugs.propTypes = {
  analyser: PropTypes.object.isRequired,
};

export default ResistanceDrugs;
