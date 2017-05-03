import React, { Component } from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import reduce from 'lodash/reduce';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import sortBy from 'lodash/sortBy';
import first from 'lodash/first';
import last from 'lodash/last';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

const d3 = require('d3');

export class Bubbles extends Component {
  static propTypes = {
    registers: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.inData = { name: 'in', children: [] };
    this.outData = [];
    this.inColor = '#80DEEA';
    this.outColor = '#D4E157';
    this.fullWidth = null;
    this.width = null;
    this.fullHeight = null;
    this.height = null;
    this.outScale = 1.2;
    this.hierarchy = null;
    this.pack = null;
    this.circle = null;
    this.outCircle = null;
    this.simulation = null;
    this.svgDom = null;
    this.svgD3 = null;

    [
      'setSize',
      'fillPoints',
      'dataId',
      'totalWeight',
      'dataWeight',
      'radius',
      'outCombined',
      'formatPower',
      'ticked',
      'scaleCenterForce',
      'drawData',
      'redrawData',
      'onResize',
    ].forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <svg ref={ svgDom => this.svgDom = svgDom } style={{ width: '100%', height: '100%' }} />
      </div>
    );
  }

  componentDidMount() {
    const { registers } = this.props;
    this.svgD3 = d3.select(this.svgDom);

    this.setSize();
    this.fillPoints(registers);
    this.drawData();

    window.addEventListener('resize', this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    const { registers } = nextProps;
    const { registers: oldRegisters } = this.props;

    // if (isEqual(sortBy(registers, 'id'), sortBy(oldRegisters, 'id'))) return;

    this.fillPoints(registers);
    this.redrawData();
  }

  setSize() {
    if (!this.svgDom) return;
    this.fullWidth = this.svgDom.getBoundingClientRect().width;
    this.width = this.fullWidth;
    this.fullHeight = this.svgDom.getBoundingClientRect().height;
    this.height = this.fullHeight;
    if (this.width > this.height + this.height * 0.2) {
      this.width = this.height;
    } else if (this.height > this.width + this.width * 0.2) {
      this.height = this.width;
    }
  }

  fillPoints(pointsArr) {
    this.inData.children = filter(this.inData.children, oldP => find(pointsArr, p => oldP.id === p.id));
    this.outData = filter(this.outData, oldP => find(pointsArr, p => oldP.id === p.id));

    const generatePoint = (point) => ({
      c: point.c,
      id: point.id,
      value: point.value,
      r: 0,
      x: d3.scaleLinear()
      .domain([0, this.fullWidth])
      .range([this.fullWidth * 0.4, this.fullWidth * 0.6])(Math.random() * this.fullWidth),
      y: d3.scaleLinear()
      .domain([0, this.fullHeight])
      .range([this.fullHeight * 0.4, this.fullHeight * 0.6])(Math.random() * this.fullHeight),
      color: point.mode === 'in' ? this.inColor : this.outColor,
      outPoint: point.mode === 'out',
    });

    forEach(pointsArr, (point) => {
      if (point.mode === 'in') {
        const idx = findIndex(this.inData.children, p => p.id === point.id);
        if (idx === -1) {
          this.inData.children.push(generatePoint(point));
        } else {
          this.inData.children[idx].value = point.value;
        }
      } else {
        const idx = findIndex(this.outData, p => p.id === point.id);
        if (idx === -1) {
          this.outData.push(generatePoint(point));
        } else {
          this.outData[idx].value = point.value;
        }
      }
    });
  }

  dataId(d) {
    return d.id;
  }

  totalWeight(dataArr) {
    return reduce(dataArr, (sum, d) => sum + d.value, 0);
  }

  dataWeight() {
    const weightIn = this.totalWeight(this.inData.children);
    const weightOut = this.totalWeight(this.outData);
    return weightOut > weightIn ? weightOut : weightIn;
  }

  radius(weight) {
    const zoom = this.width / 3;
    return d3.scalePow()
    .exponent(0.5)
    .domain([0, weight()])
    .range([2, zoom]);
  }

  outCombined() {
    return [{
      id: 'outBubble',
      value: reduce(this.outData, (s, d) => s + d.value, 0) * this.outScale,
      outPoint: true,
    }];
  }

  formatPower(power) {
    const powerArr = power.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').split(',');
    powerArr.pop();
    return powerArr.join('.');
  }

  ticked() {
    this.circle.attr('cx', d => d.x)
    .attr('cy', d => d.y);
  }

  scaleCenterForce(val) {
    const sortedData = sortBy(this.inData.children, d => d.value);
    return d3.scaleLinear()
    .domain([last(sortedData).value, first(sortedData).value])
    .range([0.004, 0.0005])
    .clamp(true)(val);
  }

  drawData() {
    console.warn('draw')
    this.outCircle = this.svgD3.selectAll('.out-circle')
    .data(this.outCombined(), this.dataId)
    .enter()
    .append('circle')
    .classed('out-circle', true)
    .style('fill', this.outColor)
    .attr('r', d => this.radius(this.dataWeight)(d.value))
    .attr('cx', () => this.fullWidth / 2)
    .attr('cy', () => this.fullHeight / 2);

    this.hierarchy = d3.hierarchy(this.inData).sum(d => d.value).sort((a, b) => (a.value - b.value));

    this.pack = d3.pack().size([this.fullWidth, this.fullHeight]);

    this.simulation = d3.forceSimulation(this.inData.children)
    .velocityDecay(0.2)
    // .alphaDecay(0)
    .force('x', d3.forceX(this.fullWidth / 2).strength(d => this.scaleCenterForce(d.value)))
    .force('y', d3.forceY(this.fullHeight / 2).strength(d => this.scaleCenterForce(d.value)))
    .force('collide', d3.forceCollide()
    .radius(d => this.radius(this.dataWeight)(d.value))
    .strength(0.02)
    .iterations(2))
    .force('charge', d3.forceManyBody()
    .strength(d => d.value * 0.000002 / d3.scaleLinear()
    .domain([0, 300])
    .range([1, 100])(this.inData.children.length)))
    .on('tick', this.ticked);

    const nodes = this.simulation.nodes();

    this.circle = this.svgD3.selectAll('.in-circle')
    .data(nodes, this.dataId)
    // .data(data, dataId)
    .enter()
    .append('circle')
    .classed('in-circle', true)
    .style('fill', this.inColor)
    .attr('r', d => this.radius(this.dataWeight)(d.value));
  }

  redrawData() {
    console.warn('redraw')
    this.hierarchy = d3.hierarchy(this.inData).sum(d => d.value).sort((a, b) => (a.value - b.value));

    this.pack = d3.pack().size([this.fullWidth, this.fullHeight]);

    this.simulation.alpha(0.8)
    .force('x', d3.forceX(this.fullWidth / 2).strength(d => this.scaleCenterForce(d.value)))
    .force('y', d3.forceY(this.fullHeight / 2).strength(d => this.scaleCenterForce(d.value)))
    .force('charge', d3.forceManyBody()
    .strength(d => d.value * 0.000002 / d3.scaleLinear()
    .domain([0, 300])
    .range([1, 100])(this.inData.children.length)))
    .nodes(this.inData.children)
    .restart();

    const nodes = this.simulation.nodes();

    this.circle = this.svgD3.selectAll('.in-circle');

    this.circle.transition()
    .ease(d3.easeExpOut)
    .duration(1000)
    .attr('r', d => this.radius(this.dataWeight)(d.value));

    this.circle.data(nodes, this.dataId)
    .exit()
    .remove();

    this.circle.data(nodes, this.dataId)
    // .data(data, dataId)
    .enter()
    .append('circle')
    .classed('in-circle', true)
    // .style('fill', this.inColor)
    .style('fill', el => {console.log(el); return el.c ? '#ff0000' : this.inColor})
    .attr('r', d => this.radius(this.dataWeight)(d.value))
    .merge(this.circle);

    this.outCircle.data(this.outCombined(), this.dataId)
    .transition()
    .ease(d3.easeExpOut)
    .duration(1000)
    .attr('r', d => this.radius(this.dataWeight)(d.value));
  }

  onResize() {
    debounce(() => {
      if (!this.outCircle || !this.circle || !this.simulation) return;

      this.setSize();

      this.outCircle.attr('cx', () => this.fullWidth / 2)
      .attr('cy', () => this.fullHeight / 2)
      .transition()
      .ease(d3.easeExpOut)
      .duration(1000)
      .attr('r', d => this.radius(this.dataWeight)(d.value));

      this.circle.transition()
      .ease(d3.easeExpOut)
      .duration(1000)
      .attr('r', d => this.radius(this.dataWeight)(d.value));

      // Params are different from draw/redraw
      this.simulation.force('x', d3.forceX(this.fullWidth / 2).strength(d => this.scaleCenterForce(d.value * 10)))
      .force('y', d3.forceY(this.fullHeight / 2).strength(d => this.scaleCenterForce(d.value * 10)))
      .force('charge', d3.forceManyBody()
      .strength(d => d.value * 0.00002 / d3.scaleLinear()
      .domain([0, 300])
      .range([1, 100])(this.inData.children.length)))
      .alpha(1)
      .restart();
    }, 500);
  }
}

export default Bubbles;
