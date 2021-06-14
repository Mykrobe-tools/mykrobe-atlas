/* @flow */

// 82fa4fc2-0356-46c6-8681-7cd1e38c628c

import * as React from 'react';
import * as d3 from 'd3';
import useSize from '@react-hook/size';

const Graph = require('graphology');
import forceAtlas2 from 'graphology-layout-forceatlas2';
import { render } from 'graphology-canvas';

import styles from './ExperimentCluster.module.scss';
import useAnimationFrame from '../../../hooks/useAnimationFrame';

const SCALE_VISUAL_DISTANCE = 40;

const drag = (simulation) => {
  const dragstarted = (event) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  };

  const dragged = (event) => {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  };

  const dragended = (event) => {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  };

  return d3
    .drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
};

const ExperimentCluster = ({
  experimentCluster = {},
  experimentClusterIsSearching,
}: React.ElementProps<*>) => {
  const svgContainerRef = React.useRef();
  const svgRef = React.useRef();
  const canvasRef = React.useRef();
  const graphRef = React.useRef();

  const [width, height] = useSize(svgContainerRef);
  const [svg, setSvg] = React.useState(null);
  const [simulation, setSimulation] = React.useState(null);
  const elapsedMilliseconds = useAnimationFrame();

  React.useEffect(() => {
    const { nodes, distance } = experimentCluster;
    if (!nodes) {
      return;
    }

    // -- new

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

    // -- end new

    // add forces to the centre of each link to help with overlapping
    // http://bl.ocks.org/couchand/7190660

    const linkNodes = [];

    const links = distance.flatMap(({ start, end, distance }) => {
      if (distance === 0) {
        return [];
      }
      return {
        source: start,
        target: end,
        distance,
        visualDistance: distance * SCALE_VISUAL_DISTANCE,
      };
    });

    links.forEach((link) => {
      linkNodes.push({
        source: nodes.find(({ id }) => id === link.source),
        target: nodes.find(({ id }) => id === link.target),
      });
    });

    const newSvg = d3
      .select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);

    newSvg.selectAll('*').remove();

    const newSimulation = d3
      .forceSimulation(nodes.concat(linkNodes))
      .force(
        'link',
        d3
          .forceLink(links)
          .distance((d) => d.visualDistance)
          .strength(1) // achieve better uniformity of distance
          .id((d) => d.id)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))
      .alpha(1)
      .alphaDecay(0.05);

    const link = newSvg
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 0.5)
      .attr('visibility', () => 'visible');

    const linkNode = newSvg
      .append('g')
      .selectAll('g')
      .data(linkNodes)
      .enter()
      .append('circle')
      .attr('r', 2)
      .attr('fill', 'gray')
      .attr('visibility', 'hidden');

    const text = newSvg
      .append('g')
      .selectAll('g')
      .data(links)
      .enter()
      .append('text')
      .text(function (d) {
        return `${d.distance}`;
      })
      .attr('x', function (d) {
        return d.source.x + (d.target.x - d.source.x) * 0.5;
      })
      .attr('y', function (d) {
        return d.source.y + (d.target.y - d.source.y) * 0.5;
      })
      .attr('dy', '.25em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#999');

    const node = newSvg
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(drag(newSimulation));

    node
      .append('circle')
      .attr('fill', 'gray')
      .attr('r', (d) => 5 * Math.sqrt(d.experiments.length));

    node
      .append('text')
      .attr('x', 8)
      .attr('y', '0.31em')
      // .text(
      //   (d) =>
      //     `Node ${d.id} - ` +
      //     d.experiments
      //       .map(
      //         (experiment) =>
      //           experiment.metadata?.sample?.isolateId ?? 'Unknown'
      //       )
      //       .join(', ')
      // )
      .text((d) => `Node ${d.id} (${d.experiments.length} experiments)`)
      .attr('font-size', '12px');

    newSimulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);

      text
        .attr('x', function (d) {
          return d.source.x + (d.target.x - d.source.x) * 0.5;
        })
        .attr('y', function (d) {
          return d.source.y + (d.target.y - d.source.y) * 0.5;
        });

      linkNode
        .attr('cx', function (d) {
          return (d.x = (d.source.x + d.target.x) * 0.5);
        })
        .attr('cy', function (d) {
          return (d.y = (d.source.y + d.target.y) * 0.5);
        });
    });

    if (simulation) {
      simulation.stop();
    }

    setSvg(newSvg);
    setSimulation(newSimulation);
  }, [experimentCluster]);

  React.useEffect(() => {
    // console.log({ width, height });
    svg?.attr('viewBox', [0, 0, width, height]);
    simulation
      ?.force('center', d3.forceCenter(width / 2, height / 2))
      .restart();

    //
    // const canvas = canvasRef.current;
    // if (canvas) {
    //   const context = canvas.getContext('2d');
    //   context.width = width;
    //   context.height = height;
    // }
    // console.log({ width, height });
  }, [width, height, svg, canvasRef]);

  const canvasStyle = React.useMemo(
    () => ({
      width,
      height,
    }),
    [width, height]
  );

  React.useEffect(() => {
    if (!width || !height) {
      return;
    }
    // const sensibleSettings = forceAtlas2.inferSettings(graph);
    // const positions = forceAtlas2(graph, {
    //   iterations: 50,
    //   settings: sensibleSettings,
    // });

    // const positions = forceAtlas2(graph, {
    //   iterations: 5000,
    //   edgeWeightInfluence: 1,
    // });
    forceAtlas2.assign(graphRef.current, {
      iterations: 1,
      edgeWeightInfluence: 1,
    });

    // console.log(graphRef.current.toJSON());
    // console.log(positions);

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.width = width;
    context.height = height;
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
        <div ref={svgContainerRef} className={styles.svgContainer}>
          <svg ref={svgRef} />
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            _style={canvasStyle}
          />
        </div>
      )}
    </div>
  );
};

export default ExperimentCluster;
