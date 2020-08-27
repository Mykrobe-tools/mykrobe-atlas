/* @flow */

import * as React from 'react';
import qs from 'qs';
import { useSelector } from 'react-redux';

import { useQuery } from 'makeandship-js-common/src/modules/query';
import Loading from 'makeandship-js-common/src/components/ui/loading';

import { getExperimentsFilters } from '../../modules/experiments/experimentsFilters';
import withExperimentsHighlighted from '../../hoc/withExperimentsHighlighted';
import { filterExperimentsInTree } from '../../modules/experiments/util/experiments';
import Phylogeny from '../phylogeny/Phylogeny';

const ExperimentsTree = (
  props: React.ElementProps<*>
): React.Element<*> | null => {
  const filters = useSelector(getExperimentsFilters);
  const query = React.useMemo(() => qs.stringify(filters), [filters]);

  const {
    data: experimentsTree,
    isFetching: experimentsTreeIsFetching,
  } = useQuery(`/experiments/tree`);

  // use same query key - only store a single response to help reduce memory usage

  const {
    data: experiments = [],
    isFetching: experimentsIsFetching,
  } = useQuery({
    queryKey: 'ExperimentsSummary',
    url: () => `/experiments/summary?${query}`,
  });

  const experimentsHighlighted = experiments;

  const experimentsTreeNewick = React.useMemo(() => experimentsTree?.tree, [
    experimentsTree,
  ]);

  const experimentsInTree = React.useMemo(
    () => filterExperimentsInTree(experimentsTreeNewick, experiments, true),
    [experimentsTreeNewick, experiments]
  );

  const experimentsNotInTree = React.useMemo(
    () => filterExperimentsInTree(experimentsTreeNewick, experiments, false),
    [experimentsTreeNewick, experiments]
  );

  const experimentsHighlightedInTree = React.useMemo(
    () =>
      filterExperimentsInTree(
        experimentsTreeNewick,
        experimentsHighlighted,
        true
      ),
    [experimentsTreeNewick, experiments]
  );

  const experimentsHighlightedNotInTree = React.useMemo(
    () =>
      filterExperimentsInTree(
        experimentsTreeNewick,
        experimentsHighlighted,
        false
      ),
    [experimentsTreeNewick, experiments]
  );

  if (experimentsIsFetching || experimentsTreeIsFetching) {
    return <Loading delayed />;
  }

  console.log({ experimentsTreeNewick });

  return (
    <Phylogeny
      experimentsTreeNewick={experimentsTreeNewick}
      experiments={experiments}
      experimentsInTree={experimentsInTree}
      experimentsNotInTree={experimentsNotInTree}
      experimentsHighlighted={experiments}
      experimentsHighlightedInTree={experimentsHighlightedInTree}
      experimentsHighlightedNotInTree={experimentsHighlightedNotInTree}
      {...props}
    />
  );
};

export default withExperimentsHighlighted(ExperimentsTree);
