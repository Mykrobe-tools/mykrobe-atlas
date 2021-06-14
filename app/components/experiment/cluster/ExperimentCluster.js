/* @flow */

// 82fa4fc2-0356-46c6-8681-7cd1e38c628c

import * as React from 'react';
import useSize from '@react-hook/size';

const Graph = require('graphology');
import forceAtlas2 from 'graphology-layout-forceatlas2';

import styles from './ExperimentCluster.module.scss';
import useAnimationFrame from '../../../hooks/useAnimationFrame';

const CAMERA_DEFAULT = {
  x: 0,
  y: 0,
  s: 1,
};

const ExperimentCluster = ({
  experimentCluster = {},
  experimentClusterIsSearching,
}: React.ElementProps<*>) => {
  const clusterContainerRef = React.useRef();
  const canvasRef = React.useRef();
  const graphRef = React.useRef();

  const camera = React.useState({ ...CAMERA_DEFAULT });

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
    if (!width || !height || !graphRef.current) {
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

    // render(graphRef.current, context, {
    //   width,
    //   height,
    // });

    draw();
  }, [elapsedMilliseconds, width, height]);

  // console.log({ canvasStyle });

  // __________________________________________________________________________________________ draw to convas

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, context.width, context.height);

    const canvasMargin = 50;
    const canvasWidth = context.width - 2 * canvasMargin;
    const canvasHeight = context.height - 2 * canvasMargin;

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    graphRef.current.forEachNode((node, attr) => {
      const { x, y } = attr;
      minX = Math.min(x, minX);
      minY = Math.min(y, minY);
      maxX = Math.max(x, maxX);
      maxY = Math.max(y, maxY);
    });

    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;
    const graphCenterX = 0.5 * (minX + maxX);
    const graphCenterY = 0.5 * (minY + maxY);

    const canvasAspectRatio = canvasWidth / canvasHeight;
    const graphAspectRatio = graphWidth / graphHeight;

    let scaleGraphToCanvas = 1;

    if (canvasAspectRatio > graphAspectRatio) {
      // fit height
      scaleGraphToCanvas = canvasHeight / graphHeight;
    } else {
      // fit width
      scaleGraphToCanvas = canvasWidth / graphWidth;
    }

    context.fillStyle = '#00ff00';

    const mapGraphToCanvas = (attr) => {
      const x =
        canvasMargin +
        canvasWidth * 0.5 +
        (attr.x - graphCenterX) * scaleGraphToCanvas;
      const y =
        canvasMargin +
        canvasHeight * 0.5 -
        (attr.y - graphCenterY) * scaleGraphToCanvas;

      return { x, y };
    };

    graphRef.current.forEachEdge(
      (edge, attr, source, target, sourceAttributes, targetAttributes) => {
        // console.log({
        //   edge,
        //   attr,
        //   source,
        //   target,
        //   sourceAttributes,
        //   targetAttributes,
        // });
        const sourceXY = mapGraphToCanvas(sourceAttributes);
        const targetXY = mapGraphToCanvas(targetAttributes);
        context.beginPath();
        context.moveTo(sourceXY.x, sourceXY.y);
        context.lineTo(targetXY.x, targetXY.y);
        context.stroke();
      }
    );

    graphRef.current.forEachNode((node, attr) => {
      const { x, y } = mapGraphToCanvas(attr);

      context.beginPath();
      context.arc(x, y, 10, 0, 2 * Math.PI, true);

      context.closePath();
      context.fill();
    });
  });

  // __________________________________________________________________________________________ mouse events

  const onClick = React.useCallback((e) => {
    console.log('onClick', e);
  });

  const onMouseMove = React.useCallback((e) => {
    console.log('onMouseMove', e);
  });

  const onMouseDown = React.useCallback((e) => {
    console.log('onMouseDown', e);
  });

  const onMouseUp = React.useCallback((e) => {
    console.log('onMouseUp', e);
  });

  const onMouseOut = React.useCallback((e) => {
    console.log('onMouseOut', e);
  });

  const mouseWheel = React.useCallback((event) => {
    let delta = 0;

    if (event.wheelDelta) {
      /* IE/Opera. */
      delta = -(event.wheelDelta / 120);
    } else if (event.detail) {
      /* Mozilla */
      delta = event.detail / 3;
    }

    console.log({ delta });
  });

  const setCanvasRef = React.useCallback((ref) => {
    console.log('setCanvasRef', ref);
    if (canvasRef.current) {
      canvasRef.current.removeEventListener('DOMMouseScroll', mouseWheel);
      canvasRef.current.removeEventListener('mousewheel', mouseWheel);
    }
    canvasRef.current = ref;
    if (canvasRef.current) {
      canvasRef.current.addEventListener('DOMMouseScroll', mouseWheel);
      canvasRef.current.addEventListener('mousewheel', mouseWheel);
    }
  }, []);

  // __________________________________________________________________________________________ render

  return (
    <div className={styles.container}>
      {experimentClusterIsSearching ? (
        <span>Cluster searching…</span>
      ) : (
        <div ref={clusterContainerRef} className={styles.svgContainer}>
          <canvas
            ref={setCanvasRef}
            width={width}
            height={height}
            onClick={onClick}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseOut={onMouseOut}
          />
        </div>
      )}
    </div>
  );
};

export default ExperimentCluster;
