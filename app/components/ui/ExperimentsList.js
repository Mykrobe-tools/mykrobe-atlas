/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash.get';
import { Link } from 'react-router-dom';
import _orderBy from 'lodash.orderby';

import styles from './ExperimentsList.module.scss';

const ExperimentsListItem = ({
  highlighted,
  id,
  distance,
  metadata,
}: React.ElementProps<*>): React.Element<*> => {
  const displayName = React.useMemo(() => {
    const isolateId = _get(metadata, 'sample.isolateId') || 'No isolate Id';
    const countryIsolate = _get(metadata, 'sample.countryIsolate');
    const elements = [isolateId];
    distance !== undefined && elements.push(`${distance} SNPs`);
    countryIsolate && elements.push(countryIsolate);
    const displayName = elements.join(` · `);
    return displayName;
  }, [metadata, distance]);
  return (
    <div
      key={id}
      className={highlighted ? styles.experimentHighlighted : styles.experiment}
    >
      <Link to={`/experiments/${id}/analysis`}>
        <i className="fa fa-chevron-circle-right" /> {displayName}
      </Link>
    </div>
  );
};

const ExperimentsList = ({
  experiment,
  experiments = [],
  expandable = false,
  minExpandable = 5,
}: React.ElementProps<*>): React.Element<*> | null => {
  const [expanded, setExpanded] = React.useState(false);
  const toggleExpanded = React.useCallback(() => {
    setExpanded(!expanded);
  }, [expanded, setExpanded]);

  const isExpandable = React.useMemo(() => {
    return expandable && experiments.length >= minExpandable;
  }, [expandable, experiments, minExpandable]);

  const filteredAndSortedExperiments = React.useMemo(() => {
    let filteredExperiments = experiments;
    if (isExpandable && !expanded) {
      filteredExperiments = experiments.slice(0, minExpandable);
    }
    const sortedExperiments = _orderBy(filteredExperiments, 'distance');

    // ensure 'experiment' is first
    if (experiment) {
      const experimentIndex = sortedExperiments.findIndex(
        ({ id }) => id === experiment.id
      );
      if (experimentIndex > 0) {
        sortedExperiments.splice(experimentIndex, 1);
        sortedExperiments.unshift(experiment);
      }
    }
    return sortedExperiments;
  }, [experiments, isExpandable, expanded, experiment, minExpandable]);

  // if (!filteredAndSortedExperiments.length) {
  //   return null;
  // }

  return (
    <React.Fragment>
      {filteredAndSortedExperiments.map(ExperimentsListItem)}
      {isExpandable &&
        (expanded ? (
          <a href="#" color="primary" onClick={toggleExpanded}>
            <i className="fa fa-minus-circle" /> Hide all
          </a>
        ) : (
          <a href="#" color="primary" onClick={toggleExpanded}>
            <i className="fa fa-plus-circle" /> Show all{' '}
            {experiments.length + 1}
          </a>
        ))}
    </React.Fragment>
  );

  // if (expandable && experiments.length > 6) {
  //   const visibleExperiments = experiments.slice(0, 5).map(ExperimentsListItem);
  //   const hiddenExperiments = experiments.slice(5).map(ExperimentsListItem);

  //   return (
  //     <React.Fragment>
  //       {visibleExperiments}
  //       <Collapse isOpen={collapse}>{hiddenExperiments}</Collapse>
  //       {collapse ? (
  //         <a href="#" color="primary" onClick={toggleCollapse}>
  //           <i className="fa fa-minus-circle" /> Less
  //         </a>
  //       ) : (
  //         <a href="#" color="primary" onClick={toggleCollapse}>
  //           <i className="fa fa-plus-circle" /> {experiments.length - 5} more
  //         </a>
  //       )}
  //     </React.Fragment>
  //   );
  // }

  // const sortedExperiments = _orderBy(experiments, 'distance');

  // // ensure 'experiment' is first
  // if (experiment) {
  //   const experimentIndex = sortedExperiments.findIndex(
  //     ({ id }) => id === experiment.id
  //   );
  //   if (experimentIndex > 0) {
  //     sortedExperiments.splice(experimentIndex, 1);
  //     sortedExperiments.unshift(experiment);
  //   }
  // }

  // return sortedExperiments.map((experimentItem) => {
  //   const highlighted = experimentItem?.id === experiment?.id;
  //   if (!experimentItem.id) {
  //     return null;
  //   }
  //   return (
  //     <ExperimentsListItem
  //       key={experimentItem.id}
  //       highlighted={highlighted}
  //       {...experimentItem}
  //     />
  //   );
  // });
};

ExperimentsList.propTypes = {
  experiment: PropTypes.any,
  experiments: PropTypes.array,
  expandable: PropTypes.bool,
};

export default ExperimentsList;
