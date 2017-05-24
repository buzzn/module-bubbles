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
    this.inColor = 'rgba(128, 222, 234, 0.8)';
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
    this.outArc = null;
    this.clock = null;
    this.updateClock = null;
    this.ticker = true;
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
        <svg ref={ svgDom => this.svgDom = svgDom } width="100%" height="100%" viewBox="0 0 1000 1000">
          <circle className="bg-circle" r="480" cx="500" cy="500" style={{ fill: '#efefef' }} />
          <path transform="translate(300,300)" d="M73.873,423.753c-2,0 -4,-0.8 -5.2,-2c-2.8,-2.8 -3.6,-6.8 -1.6,-10.4l108.4,-171.6l-117.6,0c-3.6,0 -6.4,-2 -7.6,-5.2c-1.2,-3.2 0,-6.8 2.8,-8.8l284,-224c3.2,-2.4 7.6,-2.4 10.4,0.4c2.8,2.8 3.6,6.8 1.2,10.4l-105.6,163.2l122.8,0c3.6,0 6.4,2 7.6,5.2c1.2,3.2 0,6.8 -2.4,8.8l-292,232c-1.6,1.6 -3.6,2 -5.2,2Z" style={{ fill: '#fff', fillRule: 'nonzero' }}/>
        </svg>
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
    // this.fullWidth = this.svgDom.getBoundingClientRect().width;
    // this.width = this.fullWidth;
    // this.fullHeight = this.svgDom.getBoundingClientRect().height;
    // this.height = this.fullHeight;
    // if (this.width > this.height + this.height * 0.2) {
    //   this.width = this.height;
    // } else if (this.height > this.width + this.width * 0.2) {
    //   this.height = this.width;
    // }
    this.fullHeight = 1000;
    this.fullWidth = 1000;
    this.height = 1000;
    this.width = 1000;
  }

  fillPoints(pointsArr) {
    this.inData.children = filter(this.inData.children, oldP => find(pointsArr, p => oldP.id === p.id));
    this.outData = filter(this.outData, oldP => find(pointsArr, p => oldP.id === p.id));

    const generatePoint = (point) => ({
      c: point.c,
      id: point.id,
      value: point.value,
      // r: 0,
      // x: d3.scaleLinear()
      // .domain([0, this.fullWidth])
      // .range([this.fullWidth * 0.4, this.fullWidth * 0.6])(Math.random() * this.fullWidth),
      // y: d3.scaleLinear()
      // .domain([0, this.fullHeight])
      // .range([this.fullHeight * 0.4, this.fullHeight * 0.6])(Math.random() * this.fullHeight),
      color: point.mode === 'in' ? this.inColor : this.outColor,
      outPoint: point.mode === 'out',
    });

    forEach(pointsArr, (point) => {
      if (point.label === 'consumption') {
        const idx = findIndex(this.inData.children, p => p.id === point.id);
        if (idx === -1) {
          this.inData.children.push(generatePoint(point));
        } else {
          this.inData.children[idx].value = point.value;
        }
      } else if (point.label === 'production_pv' || point.label === 'production_chp') {
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

    const isProducing = reduce(this.outData, (s, d) => s + d.value, 0) >= reduce(this.inData.children, (s, d) => s + d.value, 0);

    this.svgD3.append('g').classed('bubbles', true);

    this.clock = this.svgD3.append('g').classed('clock', true);

    this.clock.append('text')
    .text('')
    .classed('clock-left', true)
    .attr('x', '180')
    .attr('y', '580')
    .style('font-size', '260')
    .style('font-family', 'Asap-Regular, Helvetica')
    .style('color', '#4a4a4a');

    this.clock.append('text')
    .text('')
    .classed('clock-right', true)
    .attr('x', '520')
    .attr('y', '580')
    .style('font-size', '260')
    .style('font-family', 'Asap-Regular, Helvetica')
    .style('color', '#4a4a4a');

    this.updateClock = setInterval(() => {
      const now = new Date();
      this.clock.select('.clock-left').text((`0${now.getHours()}`).slice(-2) + (this.ticker ? ':' : ' '));
      this.clock.select('.clock-right').text((`0${now.getMinutes()}`).slice(-2));
      this.ticker = !this.ticker;
    }, 1000);

    // this.svgD3.select('.bubbles')
    // .append('circle')
    // .style('fill', '#efefef')
    // .attr('r', this.width / 2 - 20)
    // .attr('cx', () => this.fullWidth / 2)
    // .attr('cy', () => this.fullHeight / 2);

    this.outArc = this.svgD3.select('.bubbles')
    .append('circle')
    .classed('out-arc', true)
    .style('fill', 'rgba(0, 0, 0, 0)')
    .style('stroke', this.outColor)
    .style('stroke-width', '20px')
    .attr('r', this.width / 2 - 20)
    .attr('cx', () => this.fullWidth / 2)
    .attr('cy', () => this.fullHeight / 2);

    this.outCircle = this.svgD3.select('.bubbles').selectAll('.out-circle')
    .data(this.outCombined(), this.dataId)
    .enter()
    .append('circle')
    .classed('out-circle', true)
    .style('fill', this.outColor)
    .attr('r', d => (isProducing ? this.width / 2 : this.radius(this.dataWeight)(d.value)))
    .attr('cx', () => this.fullWidth / 2)
    .attr('cy', () => this.fullHeight / 2);

    this.hierarchy = d3.hierarchy(this.inData).sum(d => d.value)//.sort((a, b) => (a.value - b.value));

    this.pack = d3.pack().size([this.fullWidth - 20, this.fullHeight - 20]);

    this.circle = this.svgD3.select('.bubbles').selectAll('.in-circle')
    .data(this.pack(this.hierarchy).descendants())
    // .data(data, dataId)
    .enter()
    .append('circle')
    .classed('in-circle', true)
    .style('fill', el => !el.parent ? 'rgba(0, 0, 0, 0)' : this.inColor)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => d.r || 0);
  }

  redrawData() {
    console.warn('redraw')
    this.hierarchy = d3.hierarchy(this.inData).sum(d => d.value)//.sort((a, b) => (a.value - b.value));

    const isProducing = reduce(this.outData, (s, d) => s + d.value, 0) >= reduce(this.inData.children, (s, d) => s + d.value, 0);
    let scale = reduce(this.outData, (s, d) => s + d.value, 0) / reduce(this.inData.children, (s, d) => s + d.value, 0);
    let margin = 0;
    if (scale <= 1.5) {
      scale = 1;
    } else if (scale <= 2) {
      scale = 1.5;
      margin = 200;
    } else {
      scale = 2;
      margin = 260;
    }

    this.pack = d3.pack().size([this.fullWidth / scale - 20, this.fullHeight / scale - 20]);

    this.circle = this.svgD3.select('.bubbles').selectAll('.in-circle');

    this.circle.data(this.pack(this.hierarchy).descendants())
    .enter()
    .append('circle')
    .classed('in-circle', true)
    // .style('fill', this.inColor)
    .style('fill', el => {
      if (!el.parent) return 'rgba(0, 0, 0, 0)';
      // return el.data.c ? '#ff0000' : this.inColor
      return this.inColor;
    })
    .transition()
    .ease(d3.easeExpOut)
    .duration(1000)
    .attr('cx', d => (d.x + (((this.fullWidth) - (this.fullWidth / scale)) / 2)))
    .attr('cy', d => (d.y + (((this.fullHeight) - (this.fullHeight / scale)) / 2 + margin)))
    .attr('r', d => d.r || 0)

    this.circle
    .transition()
    .ease(d3.easeExpOut)
    .duration(1000)
    .attr('cx', d => (d.x + (((this.fullWidth) - (this.fullWidth / scale)) / 2)))
    .attr('cy', d => (d.y + (((this.fullHeight) - (this.fullHeight / scale)) / 2 + margin)))
    .attr('r', d => d.r || 0);

    this.circle.data(this.pack(this.hierarchy).descendants())
    .exit()
    .transition()
    .duration(200)
    .attr('r', 0)
    .style('opacity', 0)
    .remove();

    this.outArc.transition()
    .ease(d3.easeExpOut)
    .duration(1000)
    .style('opacity', isProducing ? 1 : 0);

    this.outCircle.data(this.outCombined(), this.dataId)
    .transition()
    .ease(d3.easeExpOut)
    .duration(1000)
    .style('opacity', isProducing ? 0 : 1)
    .attr('r', d => (isProducing ? this.width / 2 : this.radius(this.dataWeight)(d.value)));

    this.svgD3.select('.bg-circle')
    .transition()
    .ease(d3.easeExpOut)
    .duration(1000)
    .style('opacity', isProducing ? 1 : 0)
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

  componentWillUnmount() {
    clearInterval(this.updateClock);
  }
}

export default Bubbles;
