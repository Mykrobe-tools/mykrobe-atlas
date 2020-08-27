/* @flow */

import * as React from 'react';
import qs from 'qs';
import { useSelector } from 'react-redux';

import { useQuery } from 'makeandship-js-common/src/modules/query';

import ExperimentGeographicMap from '../experiment/analysis/ExperimentGeographicMap';
import { getExperimentsFilters } from '../../modules/experiments/experimentsFilters';
import withExperimentsHighlighted from '../../hoc/withExperimentsHighlighted';
import { filterExperimentsWithGeolocation } from '../../modules/experiments/util/experiments';
import Loading from 'makeandship-js-common/src/components/ui/loading';

const ExperimentsMap = (
  props: React.ElementProps<*>
): React.Element<*> | null => {
  const filters = useSelector(getExperimentsFilters);
  const query = React.useMemo(() => qs.stringify(filters), [filters]);

  // use same query key - only store a single response to help reduce memory usage

  const { data = [], isFetching } = useQuery({
    queryKey: 'ExperimentsMap',
    url: () => `/experiments/summary?${query}`,
  });

  const experimentsWithGeolocation = React.useMemo(
    () => filterExperimentsWithGeolocation(data, true),
    [data]
  );

  const experimentsWithoutGeolocation = React.useMemo(
    () => filterExperimentsWithGeolocation(data, false),
    [data]
  );

  if (isFetching) {
    return <Loading delayed />;
  }

  return (
    <ExperimentGeographicMap
      experiments={data}
      experimentsWithGeolocation={experimentsWithGeolocation}
      experimentsWithoutGeolocation={experimentsWithoutGeolocation}
      {...props}
    />
  );
};

export default withExperimentsHighlighted(ExperimentsMap);
