/* @flow */

// 82fa4fc2-0356-46c6-8681-7cd1e38c628c

import * as React from 'react';
import useSize from '@react-hook/size';

const Graph = require('graphology');
import forceAtlas2 from 'graphology-layout-forceatlas2';

import useAnimationFrame from '../../../hooks/useAnimationFrame';
import useBoundingClientRect from '../../../hooks/useBoundingClientRect';

import styles from './ExperimentCluster.module.scss';
import ExperimentsTooltip from '../../ui/ExperimentsTooltip';
import * as Colors from '../../../constants/Colors';

const CAMERA_DEFAULT = {
  x: 0,
  y: 0,
  s: 1,
};

const CANVAS_MARGIN = 50;
const MIN_RADIUS = 5;
const MAX_RADIUS = 15;

const ExperimentCluster = ({
  experimentCluster = {},
  experimentClusterIsSearching,
  experiment,
  experimentsHighlighted,
  setExperimentsHighlighted,
  resetExperimentsHighlighted,
}: React.ElementProps<*>) => {
  const clusterContainerRef = React.useRef();
  const canvasRef = React.useRef();
  const boundingClientRect = useBoundingClientRect(canvasRef);
  const graphRef = React.useRef();
  const mapEntityIdToClusterNodeId = React.useRef({});

  const [camera, setCamera] = React.useState({ ...CAMERA_DEFAULT });
  const [renderAttributes, setRenderAttributes] = React.useState();

  const [width, height] = useSize(clusterContainerRef);
  const elapsedMilliseconds = useAnimationFrame();

  React.useEffect(() => {
    const { nodes, distance } = experimentCluster;
    if (!nodes) {
      return;
    }

    graphRef.current = new Graph();
    mapEntityIdToClusterNodeId.current = {};

    // https://github.com/graphology/graphology-layout-forceatlas2#pre-requisites
    // each node must have an initial x and y
    // here we arrange them in a circle

    nodes.forEach((node, index) => {
      const angle = (Math.PI * 2 * index) / nodes.length;
      const x = 50 * Math.sin(angle);
      const y = 50 * Math.cos(angle);
      const includesCurrentExperiment = false;
      const attributes = {
        x,
        y,
        size: getRadiusForExperiments(node.experiments),
        includesCurrentExperiment,
        ...node,
      };
      node.experiments.forEach((nodeExperiment) => {
        mapEntityIdToClusterNodeId.current[nodeExperiment.id] = node.id;
        if (nodeExperiment.id === experiment.id) {
          attributes.includesCurrentExperiment = true;
        }
      });
      graphRef.current.addNode(node.id, attributes);
      // console.log({ mapIdToNode: mapEntityIdToClusterNodeId.current });
    });

    distance.forEach((distance) => {
      graphRef.current.addEdge(distance.start, distance.end, {
        ...distance,
        weight: 1 / distance.distance,
      });
    });
  }, [experimentCluster]);

  React.useEffect(() => {
    if (!graphRef.current) {
      return;
    }
    const sensibleSettings = forceAtlas2.inferSettings(graphRef.current);

    // forceAtlas2.assign(graphRef.current, {
    //   iterations: 1,
    //   settings: sensibleSettings,
    // });

    forceAtlas2.assign(graphRef.current, {
      iterations: 1,
      settings: {
        ...sensibleSettings,
        // adjustSizes: true, // needs investigation
        edgeWeightInfluence: 2,
      },
    });

    updateRenderAttributes();
  }, [elapsedMilliseconds]);

  // console.log({ canvasStyle });

  // __________________________________________________________________________________________ draw to convas

  const updateRenderAttributes = React.useCallback(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const canvasWidth = context.width - 2 * CANVAS_MARGIN;
    const canvasHeight = context.height - 2 * CANVAS_MARGIN;

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

    setRenderAttributes({
      scaleGraphToCanvas,
      canvasWidth,
      canvasHeight,
      graphCenterX,
      graphCenterY,
    });
  });

  const mapGraphToCanvas = React.useCallback(
    ({ x, y }) => {
      const {
        scaleGraphToCanvas,
        canvasWidth,
        canvasHeight,
        graphCenterX,
        graphCenterY,
      } = renderAttributes;
      const canvasX =
        CANVAS_MARGIN +
        canvasWidth * 0.5 +
        (x - graphCenterX) * scaleGraphToCanvas;
      const canvasY =
        CANVAS_MARGIN +
        canvasHeight * 0.5 -
        (y - graphCenterY) * scaleGraphToCanvas;
      return { x: canvasX, y: canvasY };
    },
    [renderAttributes]
  );

  const findNodeForCanvasCoordinates = React.useCallback(
    ({ x, y }) => {
      const nodes = graphRef.current.nodes();
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const attributes = graphRef.current.getNodeAttributes(node);
        const canvasXY = mapGraphToCanvas({ x: attributes.x, y: attributes.y });
        const vx = x - canvasXY.x;
        const vy = y - canvasXY.y;
        const d = Math.sqrt(vx * vx + vy * vy);
        if (d <= 10) {
          return { node, attributes };
        }
      }
    },
    [renderAttributes]
  );

  const getRadiusForExperiments = React.useCallback((experiments) => {
    const area = experiments.length;
    const radius = Math.sqrt(area / Math.PI);
    return Math.min(MAX_RADIUS, MIN_RADIUS + radius * 5);
  });

  React.useEffect(() => {
    if (!canvasRef.current || !renderAttributes) {
      return;
    }
    const context = canvasRef.current.getContext('2d');

    context.clearRect(0, 0, context.width, context.height);

    context.strokeStyle = Colors.COLOR_RULE;

    graphRef.current.forEachEdge(
      (
        edge,
        attributes,
        source,
        target,
        sourceAttributes,
        targetAttributes
      ) => {
        const sourceXY = mapGraphToCanvas(sourceAttributes);
        const targetXY = mapGraphToCanvas(targetAttributes);
        context.beginPath();
        context.moveTo(sourceXY.x, sourceXY.y);
        context.lineTo(targetXY.x, targetXY.y);
        context.stroke();

        context.fillText(
          `${attributes.distance}`,
          0.5 * (sourceXY.x + targetXY.x),
          0.5 * (sourceXY.y + targetXY.y)
        );
      }
    );

    graphRef.current.forEachNode((node, attributes) => {
      const { x, y } = mapGraphToCanvas(attributes);
      const r = getRadiusForExperiments(attributes.experiments);

      context.fillStyle = attributes.includesCurrentExperiment
        ? Colors.COLOR_HIGHLIGHT_EXPERIMENT_FIRST
        : Colors.COLOR_HIGHLIGHT_EXPERIMENT;

      context.beginPath();
      context.arc(x, y, r, 0, 2 * Math.PI, true);

      context.closePath();
      context.fill();
    });
  }, [mapGraphToCanvas, elapsedMilliseconds]);

  // __________________________________________________________________________________________ mouse events

  const onClick = React.useCallback((e) => {
    console.log('onClick', e);
  });

  const onMouseMove = React.useCallback(
    (e) => {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      const result = findNodeForCanvasCoordinates({ x, y });
      if (result) {
        const { node, attributes } = result;
        // console.log({ node, attributes });
        setExperimentsHighlighted(attributes.experiments);
      }
    },
    [findNodeForCanvasCoordinates, setExperimentsHighlighted]
  );

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

  // __________________________________________________________________________________________ canvas attributes

  const setCanvasRef = React.useCallback((ref) => {
    console.log('setCanvasRef', ref);
    if (canvasRef.current) {
      canvasRef.current.removeEventListener('DOMMouseScroll', mouseWheel);
      canvasRef.current.removeEventListener('mousewheel', mouseWheel);
    }
    canvasRef.current = ref;
    if (canvasRef.current) {
      const scale = window?.devicePixelRatio || 1;
      const context = canvasRef.current.getContext('2d');
      context.scale = scale;
      canvasRef.current.addEventListener('DOMMouseScroll', mouseWheel);
      canvasRef.current.addEventListener('mousewheel', mouseWheel);
    }
  }, []);

  React.useEffect(() => {
    if (!width || !height || !canvasRef.current) {
      return;
    }
    const context = canvasRef.current.getContext('2d');
    context.width = width;
    context.height = height;
  }, [width, height]);

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
          {experimentsHighlighted &&
            experimentsHighlighted.map((experimentHighlighted) => {
              const nodeId =
                mapEntityIdToClusterNodeId.current[experimentHighlighted.id];
              if (nodeId) {
                // console.log(nodeId);
                const attributes = graphRef.current.getNodeAttributes(nodeId);
                // console.log({ nodeId, attributes });
                const experimentsTooltipLocation = mapGraphToCanvas({
                  x: attributes.x,
                  y: attributes.y,
                });
                const screenPosition = {
                  x: boundingClientRect.left + experimentsTooltipLocation.x,
                  y: boundingClientRect.top + experimentsTooltipLocation.y,
                };
                return (
                  <ExperimentsTooltip
                    key={experimentHighlighted.id}
                    experiment={experiment}
                    experiments={attributes.experiments}
                    x={screenPosition.x}
                    y={screenPosition.y}
                    onClickOutside={resetExperimentsHighlighted}
                  />
                );
              } else {
                console.log(
                  'Could not find MST experiment with id ',
                  experimentHighlighted.id
                );
                // console.log({
                //   experimentsHighlighted,
                //   mapIdToNode: mapEntityIdToClusterNodeId.current,
                // });
                // debugger;
                return null;
              }
              // const experimentsTooltipLocation = this.screenPositionForNodeId(
              //   leafId
              // );
              // return (
              //   <ExperimentsTooltip
              //     key={leafId}
              //     experiment={experiment}
              //     experiments={experiments}
              //     x={experimentsTooltipLocation.x}
              //     y={experimentsTooltipLocation.y}
              //     onClickOutside={this.onExperimentsTooltipClickOutside}
              //   />
              // );
            })}
        </div>
      )}
    </div>
  );
};

export default ExperimentCluster;
