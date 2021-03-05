/* @flow */

import * as React from 'react';
import styles from './DistanceViewPrototype.module.scss';
import * as d3 from 'd3';
import HeaderContainer from '../ui/header/HeaderContainer';

// const json = require('./nearest-neighbours-sample-data/SAMD00016703,5fd7dd0ee804da0012608e6f,955bafc3-9e25-4aa8-a57b-f6e7438915bf-2072*many.json');

const json = require('./nearest-neighbours-sample-data/SAMD00029444,5fd7dd10e804da00126093a1,31bc3b8b-a5f1-46fb-b9e6-047c5073643b-201*33468.json');

// const json = require('./nearest-neighbours-sample-data/SAMD00029466,5fd7dd11e804da0012609530,d9c38ab1-e949-44b3-ad92-5a402bb0669d-21*418.json');

// const json = require('./nearest-neighbours-sample-data/SAMD00029487,5fd7dd12e804da00126096bf,d48aca21-fb18-4e42-96db-0299ed82eedb-5*14.json');

const data = json[0];

// merge nodes where relationship distance is 0

let nodes = data.nodes.map(({ identity }) => ({
  id: identity,
  zeroDistanceIds: [],
}));

const dedupedRelationships = [];

data.relationships.forEach((first) => {
  const same = dedupedRelationships.findIndex(
    (second) => first.end === second.start && first.start === second.end
  );
  if (same === -1) {
    dedupedRelationships.push(first);
  }
});

const links = dedupedRelationships.flatMap(({ start, end, properties }) => {
  const distance = properties.distance;
  if (distance === 0) {
    // debugger;
    // const sourceNode = nodes.find(({ id }) => id === start);
    // sourceNode.zeroDistanceIds.push(end);
    // nodes = nodes.filter(({ id }) => id === end);
    // return [];
    console.log({ start, end });
  }
  return {
    source: start,
    target: end,
    distance,
    visualDistance: distance * 30,
  };
});

const width = 600;
const height = 600;

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

const DistanceViewPrototype = () => {
  const ref = React.useRef();

  React.useEffect(() => {
    const svg = d3.select(ref.current).attr('viewBox', [0, 0, width, height]);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .distance((d) => d.visualDistance)
          .id((d) => d.id)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 0.5);

    const text = svg
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
      .attr('text-anchor', 'middle');

    const node = svg
      .append('g')
      .attr('fill', 'currentColor')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(drag(simulation));

    node
      .append('circle')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .attr('r', 5);

    node
      .append('text')
      .attr('x', 8)
      .attr('y', '0.31em')
      .text((d) => d.id)
      .clone(true)
      .lower()
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', 3);

    simulation.on('tick', () => {
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
    });
  }, []);

  return (
    <div className={styles.container}>
      <HeaderContainer title={'Distance view prototype'} />
      <svg ref={ref} />
    </div>
  );
};

export default DistanceViewPrototype;
