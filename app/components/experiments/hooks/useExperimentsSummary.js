/* @flow */

import * as React from 'react';
import qs from 'qs';
import { useSelector } from 'react-redux';

import { useQuery } from 'makeandship-js-common/src/modules/query';

import { getExperimentsDataFilters } from '../../../modules/experiments/experimentsFilters';

// experiments summary stored against a shared common key
// using the current data filters
// with stale time of 30s

const useExperimentsSummary = () => {
  const filters = useSelector(getExperimentsDataFilters);
  const query = React.useMemo(() => qs.stringify(filters), [filters]);
  const { data: experiments = [], isFetching } = useQuery(
    {
      queryKey: 'ExperimentsSummary',
      url: () => `/experiments/summary?${query}`,
      staleTime: 30000,
    },
    [query]
  );
  return { experiments, isFetching };
};

export default useExperimentsSummary;
