/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './ResistanceDrugs.scss';
import Panel from '../../../ui/Panel';
import ResistanceEmpty from '../empty/ResistanceEmpty';

/*
Isoniazid
Rifampicin
Ethambutol
Pyrazinamide

Streptomycin
Amikacin
Capreomycin
Kanamycin

Ofloxacin
Moxifloxacin
Ciprofloxacin
*/

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
    const { experimentTransformed } = this.props;
    const {
      drugsResistance: { xdr, mdr },
    } = experimentTransformed;
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
    const { experimentTransformed } = this.props;
    const { hasResistance, error } = experimentTransformed;
    if (!hasResistance) {
      return (
        <div className={styles.empty} data-tid="component-resistance-drugs">
          <ResistanceEmpty subtitle={error} />
        </div>
      );
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

  listDrugsWithIndicators(drugs: Array<string>) {
    const { experimentTransformed } = this.props;
    const { resistant, susceptible, inconclusive } = experimentTransformed;
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
  experiment: PropTypes.object.isRequired,
  experimentTransformed: PropTypes.object.isRequired,
};

export default ResistanceDrugs;
