/* @flow */

// 82fa4fc2-0356-46c6-8681-7cd1e38c628c

import * as React from 'react';
import useSize from '@react-hook/size';

const Graph = require('graphology');
import forceAtlas2 from 'graphology-layout-forceatlas2';
import { render } from 'graphology-canvas';

import styles from './ExperimentCluster.module.scss';
import useAnimationFrame from '../../../hooks/useAnimationFrame';

const ExperimentCluster = ({
  experimentCluster = {},
  experimentClusterIsSearching,
}: React.ElementProps<*>) => {
  const clusterContainerRef = React.useRef();
  const canvasRef = React.useRef();
  const graphRef = React.useRef();

  const [width, height] = useSize(clusterContainerRef);
  const elapsedMilliseconds = useAnimationFrame();

  React.useEffect(() => {
    const { nodes, distance } = experimentCluster;
    if (!nodes) {
      return;
    }

    graphRef.current = new Graph();

    // https://github.com/graphology/graphology-layout-forceatlas2#pre-requisites
    // each node must have an initial x and y
    // here we arrange them in a circle

    nodes.forEach((node, index) => {
      const angle = (Math.PI * 2 * index) / nodes.length;
      const x = 50 * Math.sin(angle);
      const y = 50 * Math.cos(angle);
      graphRef.current.addNode(node.id, { x, y, ...node });
    });

    distance.forEach((distance) => {
      graphRef.current.addEdge(distance.start, distance.end, {
        weight: distance.distance,
      });
    });
  }, [experimentCluster]);

  React.useEffect(() => {
    if (!width || !height) {
      return;
    }
    const sensibleSettings = forceAtlas2.inferSettings(graphRef.current);

    forceAtlas2.assign(graphRef.current, {
      iterations: 1,
      settings: sensibleSettings,
    });

    // forceAtlas2.assign(graphRef.current, {
    //   iterations: 1,
    //   edgeWeightInfluence: 1,
    // });

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const scale = window?.devicePixelRatio || 1;

    context.width = width;
    context.height = height;
    context.scale = scale;

    render(graphRef.current, context, {
      width,
      height,
    });
  }, [elapsedMilliseconds, graphRef, width, height]);

  // console.log({ canvasStyle });

  return (
    <div className={styles.container}>
      {experimentClusterIsSearching ? (
        <span>Cluster searching…</span>
      ) : (
        <div ref={clusterContainerRef} className={styles.svgContainer}>
          <canvas ref={canvasRef} width={width} height={height} />
        </div>
      )}
    </div>
  );
};

export default ExperimentCluster;
