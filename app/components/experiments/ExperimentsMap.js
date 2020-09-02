/* @flow */

import * as React from 'react';

import Loading from 'makeandship-js-common/src/components/ui/loading';

import ExperimentGeographicMap from '../experiment/analysis/ExperimentGeographicMap';
import withExperimentsHighlighted from '../../hoc/withExperimentsHighlighted';
import { filterExperimentsWithGeolocation } from '../../modules/experiments/util/experiments';

import useExperimentsSummary from './hooks/useExperimentsSummary';

const ExperimentsMap = (
  props: React.ElementProps<*>
): React.Element<*> | null => {
  const { experiments, isFetching } = useExperimentsSummary();

  const experimentsWithGeolocation = React.useMemo(
    () => filterExperimentsWithGeolocation(experiments, true),
    [experiments]
  );

  const experimentsWithoutGeolocation = React.useMemo(
    () => filterExperimentsWithGeolocation(experiments, false),
    [experiments]
  );

  if (!experiments.length && isFetching) {
    return <Loading delayed />;
  }

  return (
    <React.Fragment>
      <ExperimentGeographicMap
        experiments={experiments}
        experimentsWithGeolocation={experimentsWithGeolocation}
        experimentsWithoutGeolocation={experimentsWithoutGeolocation}
        {...props}
      />
      {isFetching && <Loading overlay delayed />}
    </React.Fragment>
  );
};

export default withExperimentsHighlighted(ExperimentsMap);
