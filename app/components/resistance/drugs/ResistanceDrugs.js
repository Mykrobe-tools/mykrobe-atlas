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

class ResistanceDrugs extends React.Component<*> {
  renderDrugResistance() {
    const { analyser } = this.props;
    const { drugsResistance: { xdr, mdr } } = analyser.transformed;
    if (mdr || xdr) {
      return (
        <Panel title="Resistance" columns={4}>
          <div className={styles.drugs}>
            {xdr && (
              <div data-tid="resistance">Extensively Drug Resistant (XDR)</div>
            )}
            {mdr && <div data-tid="resistance">Multi-Drug Resistant (MDR)</div>}
          </div>
        </Panel>
      );
    } else {
      return null;
    }
  }

  render() {
    const { analyser: { transformed: { hasResistance } } } = this.props;
    if (!hasResistance) {
      return null; // TODO: show 'empty' view
    }
    return (
      <div className={styles.container} data-tid="component-resistance-drugs">
        <Panel title="First line drugs" columns={4}>
          {this.listDrugsWithIndicators(firstLineDrugs)}
        </Panel>
        <Panel title="Second line drugs" columns={4}>
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
        <div key={`ELEMENT_${index}`} data-tid="drug">
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
