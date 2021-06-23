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
  const toggleExpanded = React.useCallback(
    (e) => {
      e.preventDefault();
      setExpanded(!expanded);
    },
    [expanded, setExpanded]
  );

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

  return (
    <React.Fragment>
      {filteredAndSortedExperiments.map(({ id, ...rest }) => {
        return <ExperimentsListItem key={id} {...rest} />;
      })}
      {isExpandable &&
        (expanded ? (
          <a href="#" color="primary" onClick={toggleExpanded}>
            <i className="fa fa-minus-circle" /> Show less
          </a>
        ) : (
          <a href="#" color="primary" onClick={toggleExpanded}>
            <i className="fa fa-plus-circle" /> Show all (
            {experiments.length + 1})
          </a>
        ))}
    </React.Fragment>
  );
};

ExperimentsList.propTypes = {
  experiment: PropTypes.any,
  experiments: PropTypes.array,
  expandable: PropTypes.bool,
};

export default ExperimentsList;
