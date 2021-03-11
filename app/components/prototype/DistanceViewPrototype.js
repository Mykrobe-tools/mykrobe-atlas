/* @flow */

import * as React from 'react';
import styles from './DistanceViewPrototype.module.scss';
import * as d3 from 'd3';
import HeaderContainer from '../ui/header/HeaderContainer';
import useSize from '@react-hook/size';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import createGraph from 'ngraph.graph';
import kruskal from 'ngraph.kruskal';

const SCALE_VISUAL_DISTANCE = 50;

const sources = {
  '5*14': require('./nearest-neighbours-sample-data/SAMD00029487,5fd7dd12e804da00126096bf,d48aca21-fb18-4e42-96db-0299ed82eedb-5*14.json'),
  '21*418': require('./nearest-neighbours-sample-data/SAMD00029466,5fd7dd11e804da0012609530,d9c38ab1-e949-44b3-ad92-5a402bb0669d-21*418.json'),
  '201*33468': require('./nearest-neighbours-sample-data/SAMD00029444,5fd7dd10e804da00126093a1,31bc3b8b-a5f1-46fb-b9e6-047c5073643b-201*33468.json'),
  // '2072*many': require('./nearest-neighbours-sample-data/SAMD00016703,5fd7dd0ee804da0012608e6f,955bafc3-9e25-4aa8-a57b-f6e7438915bf-2072*many.json'),
};

const transformData = (data) => {
  // merge nodes where relationship distance is 0

  let nodes = data.nodes.map(({ identity }) => ({
    id: identity,
    zeroDistanceIds: [identity],
  }));

  // remove relationships where start<->end are also included as as end<->start

  const dedupedRelationships = [];

  data.relationships.forEach((first) => {
    const same = dedupedRelationships.findIndex(
      (second) => first.end === second.start && first.start === second.end
    );
    if (same === -1) {
      dedupedRelationships.push(first);
    }
  });

  // find relationships with zero distance, mark end node for removal

  const nodesIdsToRemove = [];

  dedupedRelationships.forEach((relationship) => {
    if (relationship.properties.distance === 0) {
      const startNode = nodes.find(({ id }) => id === relationship.start);
      startNode.zeroDistanceIds.push(relationship.end);
      nodesIdsToRemove.push(relationship.end);
    }
  });

  // remove the nodes

  nodes = nodes.filter(({ id }) => !nodesIdsToRemove.includes(id));

  // remove the relationships

  const filterdAndDedupedRelationships = dedupedRelationships.filter(
    ({ start, end }) => {
      const remove =
        nodesIdsToRemove.includes(start) || nodesIdsToRemove.includes(end);
      return !remove;
    }
  );

  const links = filterdAndDedupedRelationships.flatMap(
    ({ start, end, properties }) => {
      const distance = properties.distance;
      return {
        source: start,
        target: end,
        distance,
        visualDistance: distance * SCALE_VISUAL_DISTANCE,
        mst: false,
      };
    }
  );

  // build graph used to create mst

  const g = createGraph();

  nodes.forEach((node) => {
    g.addNode(node.id, node);
  });

  links.forEach((link) => {
    g.addLink(link.source, link.target, link);
  });

  g.forEachNode(function (node) {
    console.log(node.id, node.data);
  });

  g.forEachLink(function (link) {
    console.dir(link);
  });

  // create mst and flag each link that is in the mst

  const mst = kruskal(g, (link) => link.data.distance);

  console.log(mst);
  mst.forEach(({ fromId, toId }) => {
    const link = g.getLink(fromId, toId);
    link.data.mst = true;
  });

  console.log({ nodes, links });

  return { nodes, links };
};

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
  const [source, setSource] = React.useState('5*14');
  const [showDistance, setShowDistance] = React.useState(true);
  const [showMst, setShowMst] = React.useState(true);
  const [onlyMst, setOnlyMst] = React.useState(true);

  const svgContainerRef = React.useRef();
  const svgRef = React.useRef();

  const [width, height] = useSize(svgContainerRef);
  const [svg, setSvg] = React.useState(null);
  const [simulation, setSimulation] = React.useState(null);

  React.useEffect(() => {
    const sourceData = sources[source][0];
    const data = transformData(sourceData);
    const { nodes, links: rawLinks } = data;

    const links =
      showMst && onlyMst ? rawLinks.filter(({ mst }) => mst) : rawLinks;

    // add forces to the centre of each link to help with overlapping
    // http://bl.ocks.org/couchand/7190660

    const linkNodes = [];

    links.forEach(function (link) {
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
      .attr('visibility', (d) =>
        showMst ? (d.mst ? 'visible' : 'hidden') : 'visible'
      );

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
      .attr('fill', '#999')
      .attr('visibility', (d) =>
        showDistance
          ? showMst
            ? d.mst
              ? 'visible'
              : 'hidden'
            : 'visible'
          : 'hidden'
      );

    const node = newSvg
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(drag(newSimulation));

    node
      .append('circle')
      .attr('fill', 'gray')
      .attr('r', (d) => 5 * Math.sqrt(d.zeroDistanceIds.length));

    node
      .append('text')
      .attr('x', 8)
      .attr('y', '0.31em')
      .text((d) => d.zeroDistanceIds.join(', '))
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
  }, [source, showDistance, showMst, onlyMst]);

  React.useEffect(() => {
    // console.log({ width, height });
    svg?.attr('viewBox', [0, 0, width, height]);
    simulation
      ?.force('center', d3.forceCenter(width / 2, height / 2))
      .restart();
  }, [width, height, svg]);

  const toggleShowDistance = React.useCallback(() => {
    setShowDistance(!showDistance);
  }, [setShowDistance, showDistance]);

  const toggleShowMst = React.useCallback(() => {
    setShowMst(!showMst);
  }, [setShowMst, showMst]);

  const toggleOnlyMst = React.useCallback(() => {
    setOnlyMst(!onlyMst);
  }, [setOnlyMst, onlyMst]);

  return (
    <div className={styles.container}>
      <HeaderContainer title={'Distance view prototype'} />
      <div ref={svgContainerRef} className={styles.svgContainer}>
        <svg ref={svgRef} />
        <div className={styles.controlsContainer}>
          <UncontrolledDropdown>
            <DropdownToggle color="mid" outline size={'sm'}>
              {source} <i className="fa fa-caret-down" />
            </DropdownToggle>
            <DropdownMenu right>
              {Object.keys(sources).map((thisSource, index) => (
                <DropdownItem
                  key={index}
                  onClick={() => {
                    setSource(thisSource);
                  }}
                >
                  {thisSource}
                </DropdownItem>
              ))}
              <DropdownItem divider />
              <DropdownItem onClick={toggleShowDistance}>
                {showDistance ? (
                  <i className="fa fa-check-square" />
                ) : (
                  <i className="fa fa-square-o" />
                )}{' '}
                Show distance
              </DropdownItem>
              <DropdownItem onClick={toggleShowMst}>
                {showMst ? (
                  <i className="fa fa-check-square" />
                ) : (
                  <i className="fa fa-square-o" />
                )}{' '}
                Use MST
              </DropdownItem>
              {showMst && (
                <DropdownItem onClick={toggleOnlyMst}>
                  {onlyMst ? (
                    <i className="fa fa-check-square" />
                  ) : (
                    <i className="fa fa-square-o" />
                  )}{' '}
                  Use only MST for layout
                </DropdownItem>
              )}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>
    </div>
  );
};

export default DistanceViewPrototype;
