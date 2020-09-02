/* @flow */

import * as React from 'react';
import { useSelector } from 'react-redux';

import Loading from 'makeandship-js-common/src/components/ui/loading';

import withExperimentsHighlighted from '../../hoc/withExperimentsHighlighted';
import { filterExperimentsInTree } from '../../modules/experiments/util/experiments';
import Phylogeny from '../phylogeny/Phylogeny';
import { getExperimentsTreeNewick } from '../../modules/experiments';

import useExperimentsSummary from './hooks/useExperimentsSummary';

const ExperimentsTree = (
  props: React.ElementProps<*>
): React.Element<*> | null => {
  const experimentsTreeNewick = useSelector(getExperimentsTreeNewick);
  const { experiments, isFetching } = useExperimentsSummary();

  const experimentsInTree = React.useMemo(
    () => filterExperimentsInTree(experimentsTreeNewick, experiments, true),
    [experimentsTreeNewick, experiments]
  );

  const experimentsNotInTree = React.useMemo(
    () => filterExperimentsInTree(experimentsTreeNewick, experiments, false),
    [experimentsTreeNewick, experiments]
  );

  if (!experiments.length && isFetching) {
    return <Loading delayed />;
  }

  return (
    <React.Fragment>
      <Phylogeny
        experimentsTreeNewick={experimentsTreeNewick}
        experiments={experiments}
        experimentsInTree={experimentsInTree}
        experimentsNotInTree={experimentsNotInTree}
        {...props}
      />
      {isFetching && <Loading overlay delayed />}
    </React.Fragment>
  );
};

export default withExperimentsHighlighted(ExperimentsTree);
