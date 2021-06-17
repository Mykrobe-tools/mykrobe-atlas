/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash.get';
import { Link } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import _orderBy from 'lodash.orderby';

import styles from './ExperimentsList.module.scss';

const ExperimentsListItem = ({
  highlighted,
  id,
  distance,
  metadata,
}: React.ElementProps<*>): React.Element<*> => {
  const isolateId = _get(metadata, 'sample.isolateId') || 'No isolate Id';
  const countryIsolate = _get(metadata, 'sample.countryIsolate');
  // const cityIsolate = _get(metadata, 'sample.cityIsolate') || '–';
  const elements = [isolateId];
  distance !== undefined && elements.push(`${distance} SNPs`);
  countryIsolate && elements.push(countryIsolate);
  return (
    <div
      key={id}
      className={highlighted ? styles.experimentHighlighted : styles.experiment}
    >
      <Link to={`/experiments/${id}/analysis`}>
        <i className="fa fa-chevron-circle-right" /> {elements.join(` · `)}
      </Link>
    </div>
  );
};

const ExperimentsList = ({
  experiment,
  experiments = [],
  expandable = false,
}: React.ElementProps<*>): React.Element<*> | null => {
  const [collapse, setCollapse] = React.useState(false);
  const toggleCollapse = React.useCallback(() => {
    setCollapse(!collapse);
  }, [setCollapse]);

  if (!experiments || !experiments.length) {
    return null;
  }

  if (expandable && experiments.length > 6) {
    const visibleExperiments = experiments.slice(0, 5).map(ExperimentsListItem);
    const hiddenExperiments = experiments.slice(5).map(ExperimentsListItem);

    return (
      <React.Fragment>
        {visibleExperiments}
        <Collapse isOpen={collapse}>{hiddenExperiments}</Collapse>
        {collapse ? (
          <a href="#" color="primary" onClick={toggleCollapse}>
            <i className="fa fa-minus-circle" /> Less
          </a>
        ) : (
          <a href="#" color="primary" onClick={toggleCollapse}>
            <i className="fa fa-plus-circle" /> {experiments.length - 5} more
          </a>
        )}
      </React.Fragment>
    );
  }

  const sortedExperiments = _orderBy(experiments, 'distance');

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

  return sortedExperiments.map((experimentItem) => {
    const highlighted = experimentItem?.id === experiment?.id;
    if (!experimentItem.id) {
      return null;
    }
    return (
      <ExperimentsListItem
        key={experimentItem.id}
        highlighted={highlighted}
        {...experimentItem}
      />
    );
  });
};

ExperimentsList.propTypes = {
  experiment: PropTypes.any,
  experiments: PropTypes.array,
  expandable: PropTypes.bool,
};

export default ExperimentsList;
