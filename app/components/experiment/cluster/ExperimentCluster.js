/* @flow */

// 82fa4fc2-0356-46c6-8681-7cd1e38c628c

import * as React from 'react';

import styles from './ExperimentCluster.module.scss';

const ExperimentCluster = ({
  experimentCluster,
  experimentClusterIsSearching,
}: React.ElementProps<*>) => {
  console.log({ experimentCluster, experimentClusterIsSearching });
  const { nodes, distance } = experimentCluster;
  return <div className={styles.container}>ExperimentCluster</div>;
};

export default ExperimentCluster;
