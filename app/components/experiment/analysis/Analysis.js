/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import styles from './Analysis.scss';
import Phylogeny from '../../phylogeny/Phylogeny';
import Uploading from '../../ui/Uploading';

import ExperimentGeographicMap from './ExperimentGeographicMap';

class Analysis extends React.Component<*> {
  render() {
    const {
      isBusyWithCurrentRoute,
      highlighted,
      experiment,
      setNodeHighlighted,
    } = this.props;

    let content;
    if (isBusyWithCurrentRoute) {
      content = <Uploading sectionName="Analysis" />;
    } else {
      content = (
        <div className={styles.content}>
          <div className={styles.mapAndPhylogenyContainer}>
            <ExperimentGeographicMap
              experiments={[experiment]}
              highlighted={highlighted}
              setNodeHighlighted={setNodeHighlighted}
            />
            <div className={styles.phylogenyContainer}>
              <Phylogeny />
            </div>
          </div>
        </div>
      );
    }
    return <div className={styles.container}>{content}</div>;
  }
}

Analysis.propTypes = {
  setNodeHighlighted: PropTypes.func.isRequired,
  experiment: PropTypes.object.isRequired,
  experimentTransformed: PropTypes.object.isRequired,
  highlighted: PropTypes.array.isRequired,
  isBusyWithCurrentRoute: PropTypes.bool,
  experimentsTree: PropTypes.object,
};

export default Analysis;
