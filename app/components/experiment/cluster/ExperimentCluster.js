/* @flow */

// 82fa4fc2-0356-46c6-8681-7cd1e38c628c

import * as React from 'react';
import useSize from '@react-hook/size';
import * as Color from 'color';
import Graph from 'graphology';
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
  // refs
  const clusterContainerRef = React.useRef();
  const canvasRef = React.useRef();
  const graphRef = React.useRef();
  const mapEntityIdToClusterNodeId = React.useRef({});

  // states
  const [camera, setCamera] = React.useState({ ...CAMERA_DEFAULT });
  const [renderAttributes, setRenderAttributes] = React.useState();
  const [dragging, setDragging] = React.useState();

  // hooks
  const boundingClientRect = useBoundingClientRect(canvasRef);
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
    // here we assign a random position
    // this produces a better layout than circular from testing

    nodes.forEach((node) => {
      const x = 0.1 + Math.random();
      const y = 0.1 + Math.random();
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

    forceAtlas2.assign(graphRef.current, {
      iterations: 1,
      settings: {
        ...sensibleSettings,
        // adjustSizes: true, // needs investigation
        edgeWeightInfluence: 1,
      },
    });

    updateRenderAttributes();
  }, [elapsedMilliseconds]);

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

    const attributes = {
      scaleGraphToCanvas,
      canvasWidth,
      canvasHeight,
      graphCenterX,
      graphCenterY,
    };

    setRenderAttributes(attributes);
  }, [setRenderAttributes, graphRef, canvasRef]);

  const mapGraphToCanvas = React.useCallback(
    ({ x, y }) => {
      if (!renderAttributes) {
        return { x: 0, y: 0 };
      }
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

  const mapCanvasToGraph = React.useCallback(
    ({ x, y }) => {
      if (!renderAttributes) {
        return { x: 0, y: 0 };
      }
      const {
        scaleGraphToCanvas,
        canvasWidth,
        canvasHeight,
        graphCenterX,
        graphCenterY,
      } = renderAttributes;
      const graphX =
        (x - CANVAS_MARGIN - canvasWidth * 0.5) / scaleGraphToCanvas +
        graphCenterX;
      const graphY =
        (y - CANVAS_MARGIN - canvasHeight * 0.5) / -scaleGraphToCanvas +
        graphCenterY;
      return { x: graphX, y: graphY };
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
          return { node, attributes, vx, vy, d };
        }
      }
    },
    [renderAttributes, mapGraphToCanvas, graphRef]
  );

  const canvasXYForMouseEvent = React.useCallback((e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    return { x, y };
  });

  const findNodeForMouseEvent = React.useCallback(
    (e) => {
      const { x, y } = canvasXYForMouseEvent(e);
      const result = findNodeForCanvasCoordinates({ x, y });
      return result;
    },
    [findNodeForCanvasCoordinates]
  );

  const getRadiusForExperiments = React.useCallback((experiments) => {
    const area = experiments.length;
    const radius = Math.sqrt(area / Math.PI);
    return Math.min(MAX_RADIUS, MIN_RADIUS + radius * 5);
  });

  const experimentsHighlightedId = React.useMemo(() => {
    return experimentsHighlighted.map(({ id }) => id);
  }, [experimentsHighlighted]);

  React.useEffect(() => {
    if (!canvasRef.current || !renderAttributes) {
      return;
    }
    const context = canvasRef.current.getContext('2d');

    context.clearRect(0, 0, context.width, context.height);

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

        context.strokeStyle = Colors.COLOR_RULE;
        context.lineWidth = 1;

        context.beginPath();
        context.moveTo(sourceXY.x, sourceXY.y);
        context.lineTo(targetXY.x, targetXY.y);
        context.stroke();

        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = '12px Bryant2-Bold';

        context.strokeStyle = '#ffffff';
        context.lineWidth = 4;
        context.strokeText(
          `${attributes.distance}`,
          0.5 * (sourceXY.x + targetXY.x),
          0.5 * (sourceXY.y + targetXY.y)
        );

        context.fillStyle = Colors.COLOR_GREY_MID;
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
      const isInExperimentsHighlighted = attributes.experiments.find(({ id }) =>
        experimentsHighlightedId.includes(id)
      );

      context.fillStyle = Colors.COLOR_GREY_MID;
      context.beginPath();
      context.arc(x, y, 1.5, 0, 2 * Math.PI, true);
      context.closePath();
      context.fill();

      const color = attributes.includesCurrentExperiment
        ? Colors.COLOR_HIGHLIGHT_EXPERIMENT_FIRST
        : Colors.COLOR_HIGHLIGHT_EXPERIMENT;

      context.fillStyle = Color(color).alpha(
        isInExperimentsHighlighted ? 1 : 0.2
      );
      context.strokeStyle = color;
      context.lineWidth = 0.5;

      context.beginPath();
      context.arc(x, y, r, 0, 2 * Math.PI, true);
      context.closePath();
      context.fill();
      context.stroke();

      // context.fillStyle = Colors.COLOR_GREY_MID;
      // context.fillText(`(id ${node})`, x + r + 15, y);
    });
  }, [mapGraphToCanvas, elapsedMilliseconds, experimentsHighlightedId]);

  // __________________________________________________________________________________________ mouse events

  const onClick = React.useCallback(
    (e) => {
      const result = findNodeForMouseEvent(e);
      if (!result) {
        // clicked in space
        resetExperimentsHighlighted();
      }
    },
    [resetExperimentsHighlighted]
  );

  const onMouseMove = React.useCallback(
    (e) => {
      if (dragging) {
        const { x, y } = canvasXYForMouseEvent(e);
        const graphXY = mapCanvasToGraph({ x, y });
        const { node, vx, vy } = dragging;
        graphRef.current.updateNode(node, (attributes) => {
          return {
            ...attributes,
            x: graphXY.x - vx,
            y: graphXY.y - vy,
            fixed: true,
          };
        });
      } else {
        const result = findNodeForMouseEvent(e);
        if (result) {
          console.log(result);
          const { attributes } = result;
          setExperimentsHighlighted(attributes.experiments);
        }
      }
    },
    [
      findNodeForMouseEvent,
      setExperimentsHighlighted,
      dragging,
      canvasXYForMouseEvent,
    ]
  );

  const onMouseDown = React.useCallback(
    (e) => {
      const result = findNodeForMouseEvent(e);
      if (result) {
        const { node, vx, vy } = result;
        graphRef.current.updateNode(node, (attributes) => {
          return {
            ...attributes,
            fixed: true,
          };
        });
        setDragging({ node, vx, vy });
      }
    },
    [setDragging, findNodeForMouseEvent, graphRef]
  );

  const onMouseUp = React.useCallback(
    (e) => {
      if (dragging) {
        const { node } = dragging;
        graphRef.current.updateNode(node, (attributes) => {
          return {
            ...attributes,
            fixed: false,
          };
        });
        setDragging(null);
      }
    },
    [dragging, setDragging, graphRef]
  );

  const onMouseOut = React.useCallback((e) => {
    // console.log('onMouseOut', e);
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
                const attributes = graphRef.current.getNodeAttributes(nodeId);
                const canvasXY = mapGraphToCanvas({
                  x: attributes.x,
                  y: attributes.y,
                });
                const screenPosition = {
                  x: boundingClientRect.left + canvasXY.x,
                  y: boundingClientRect.top + canvasXY.y,
                };
                const nodeExperiments = attributes.experiments.filter(
                  ({ id }) => {
                    return experimentsHighlightedId.includes(id);
                  }
                );
                return (
                  <ExperimentsTooltip
                    key={experimentHighlighted.id}
                    experiment={experiment}
                    experiments={nodeExperiments}
                    x={screenPosition.x}
                    y={screenPosition.y}
                    onClickOutside={resetExperimentsHighlighted}
                  />
                );
              } else {
                // console.log(
                //   'Could not find MST experiment with id',
                //   experimentHighlighted.id
                // );
              }
            })}
        </div>
      )}
    </div>
  );
};

export default ExperimentCluster;
