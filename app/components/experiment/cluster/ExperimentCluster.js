/* @flow */

// 82fa4fc2-0356-46c6-8681-7cd1e38c628c

import * as React from 'react';
import * as d3 from 'd3';
import useSize from '@react-hook/size';

import styles from './ExperimentCluster.module.scss';

const SCALE_VISUAL_DISTANCE = 80;

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
  experimentCluster,
  experimentClusterIsSearching,
}: React.ElementProps<*>) => {
  console.log({ experimentCluster, experimentClusterIsSearching });

  const svgContainerRef = React.useRef();
  const svgRef = React.useRef();

  const [width, height] = useSize(svgContainerRef);
  const [svg, setSvg] = React.useState(null);
  const [simulation, setSimulation] = React.useState(null);

  React.useEffect(() => {
    const { nodes, distance } = experimentCluster;

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
      .alphaDecay(0.01);

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
      .text((d) =>
        d.experiments.map(
          (experiment) => experiment.metadata?.sample?.isolateId ?? 'Unknown'
        )
      )
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
  }, [width, height, svg]);

  return (
    <div className={styles.container}>
      <div ref={svgContainerRef} className={styles.svgContainer}>
        <svg ref={svgRef} />
      </div>
    </div>
  );
};

export default ExperimentCluster;
