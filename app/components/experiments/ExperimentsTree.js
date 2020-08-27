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
import { getExperimentsTreeNewick } from '../../modules/experiments';

const ExperimentsTree = (
  props: React.ElementProps<*>
): React.Element<*> | null => {
  const experimentsTreeNewick = useSelector(getExperimentsTreeNewick);
  const filters = useSelector(getExperimentsFilters);
  const query = React.useMemo(() => qs.stringify(filters), [filters]);

  const { data: experiments = [], isFetching } = useQuery(
    () => `/experiments/summary?${query}`
  );

  const experimentsInTree = React.useMemo(
    () => filterExperimentsInTree(experimentsTreeNewick, experiments, true),
    [experimentsTreeNewick, experiments]
  );

  const experimentsNotInTree = React.useMemo(
    () => filterExperimentsInTree(experimentsTreeNewick, experiments, false),
    [experimentsTreeNewick, experiments]
  );

  if (!experiments.length && isFetching) {
    return <Loading />;
  }

  return (
    <Phylogeny
      experimentsTreeNewick={experimentsTreeNewick}
      experiments={experiments}
      experimentsInTree={experimentsInTree}
      experimentsNotInTree={experimentsNotInTree}
      {...props}
    />
  );
};

export default withExperimentsHighlighted(ExperimentsTree);
