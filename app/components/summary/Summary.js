/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Summary.css';
import Uploading from '../ui/Uploading';
import ResistanceProfile from '../resistance/profile/ResistanceProfile';
import Panel from '../ui/Panel';
import SummaryMetadata from './SummaryMetadata';
import SummaryVariants from './SummaryVariants';

class Summary extends React.Component<*> {
  render() {
    const { experiment, experimentTransformed, isBusy } = this.props;
    let content;
    if (isBusy) {
      content = <Uploading sectionName="Summary" />;
    } else {
      content = (
        <div className={styles.summaryContainer}>
          <Panel title="Metadata" columns={8}>
            <SummaryMetadata
              experiment={experiment}
              experimentTransformed={experimentTransformed}
            />
          </Panel>
          <Panel title="Resistance Profile" columns={4}>
            <ResistanceProfile
              experiment={experiment}
              experimentTransformed={experimentTransformed}
            />
          </Panel>
          <Panel title="Variants Inducing Resistance" columns={4}>
            <SummaryVariants
              experiment={experiment}
              experimentTransformed={experimentTransformed}
            />
          </Panel>
        </div>
      );
    }
    return <div className={styles.container}>{content}</div>;
  }
}

Summary.propTypes = {
  experiment: PropTypes.object.isRequired,
  experimentTransformed: PropTypes.object.isRequired,
  isBusy: PropTypes.bool,
};

export default Summary;
