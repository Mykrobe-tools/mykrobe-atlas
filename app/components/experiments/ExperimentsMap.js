/* @flow */

import * as React from 'react';
import qs from 'qs';
import { useSelector } from 'react-redux';

import { useQuery } from 'makeandship-js-common/src/modules/query';
import Loading from 'makeandship-js-common/src/components/ui/loading';

import ExperimentGeographicMap from '../experiment/analysis/ExperimentGeographicMap';
import { getExperimentsFilters } from '../../modules/experiments/experimentsFilters';
import withExperimentsHighlighted from '../../hoc/withExperimentsHighlighted';
import { filterExperimentsWithGeolocation } from '../../modules/experiments/util/experiments';

const ExperimentsMap = (
  props: React.ElementProps<*>
): React.Element<*> | null => {
  const filters = useSelector(getExperimentsFilters);
  const query = React.useMemo(() => qs.stringify(filters), [filters]);

  const { data: experiments = [], isFetching } = useQuery(
    () => `/experiments/summary?${query}`
  );

  const experimentsWithGeolocation = React.useMemo(
    () => filterExperimentsWithGeolocation(experiments, true),
    [experiments]
  );

  const experimentsWithoutGeolocation = React.useMemo(
    () => filterExperimentsWithGeolocation(experiments, false),
    [experiments]
  );

  if (!experiments.length && isFetching) {
    return <Loading />;
  }

  return (
    <ExperimentGeographicMap
      experiments={experiments}
      experimentsWithGeolocation={experimentsWithGeolocation}
      experimentsWithoutGeolocation={experimentsWithoutGeolocation}
      {...props}
    />
  );
};

export default withExperimentsHighlighted(ExperimentsMap);
