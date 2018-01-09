import React, { Component } from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import { formatLabel} from "../_util";

const d3 = require('d3');

export class Bubbles extends Component {
  static propTypes = {
    registers: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.inData = { name: 'in', children: [] };
    this.outData = [];
    this.colors = {
      consumption: 'rgba(128, 222, 234, 0.8)',
      consumption_common: 'rgba(70, 202, 218, 0.8)',
      out: '#D4E157',
      production_pv: '#ffeb3b',
      production_chp: '#ffa726',
      production_water: '#1e88e5',
      production_wind: '#90caf9',
    };
    this.fullWidth = null;
    this.width = null;
    this.fullHeight = null;
    this.height = null;
    this.hierarchy = null;
    this.pack = null;
    this.circle = null;
    this.text = null;
    this.name = null;
    this.outCircle = null;
    this.outArc = null;
    this.outSources = [];
    this.outSourcesArc = null;
    this.clock = null;
    this.updateClock = null;
    this.ticker = true;
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
      'recalculateAngles',
      'drawData',
      'redrawData',
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
  }

  componentWillReceiveProps(nextProps) {
    const { registers } = nextProps;
    const { registers: oldRegisters } = this.props;

    this.fillPoints(registers);
    this.redrawData();
  }

  setSize() {
    if (!this.svgDom) return;
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
      label: point.label.toLowerCase(),
      name: point.name,
      color: this.colors[point.label.toLowerCase()],
    });

    forEach(pointsArr, (point) => {
      const label = point.label.toLowerCase();
      if (label === 'consumption' || label === 'consumption_common') {
        const idx = findIndex(this.inData.children, p => p.id === point.id);
        if (idx === -1) {
          this.inData.children.push(generatePoint(point));
        } else {
          this.inData.children[idx].value = point.value;
        }
      } else if (label === 'production_pv' || label === 'production_chp' || label === 'production_water' || label === 'production_wind') {
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
      value: reduce(this.outData, (s, d) => s + d.value, 0),
    }];
  }

  recalculateAngles() {
    const totalPower = reduce(this.outData, (s, d) => s + d.value, 0);
    const sources = {};
    forEach(this.outData, (d) => {
      if (!sources[d.label]) sources[d.label] = { color: this.colors[d.label] || this.colors['out'], value: 0 };
      sources[d.label].value += d.value;
    });
    const outSources = map(sources, (v, k) => ({ id: k, source: k, ...v }));

    let startAngle = 0;
    forEach(outSources, (data, idx) => {
      if (data.value === 0) return;
      let endAngle = (data.value / totalPower * 2 * Math.PI + startAngle) || 0;
      outSources[idx].startAngle = startAngle;
      outSources[idx].endAngle = endAngle;
      startAngle = endAngle;
      const resIdx = findIndex(this.outSources, s => s.source === data.source);
      if (resIdx > -1) {
        this.outSources[resIdx] = { ...outSources[idx], old: this.outSources[resIdx].old };
      } else {
        this.outSources.push(outSources[idx]);
      }
    });
  }

  drawData() {
    this.svgD3.append('g').classed('bubbles', true);

    this.clock = this.svgD3.append('g').classed('clock', true);

    this.clock.append('text')
      .text('')
      .classed('clock-left', true)
      .attr('x', '180')
      .attr('y', '580')
      .style('font-size', '260px')
      .style('font-family', 'Asap, Helvetica')
      .style('fill', 'rgba(74, 74, 74, 0.5)');

    this.clock.append('text')
      .text('')
      .classed('clock-right', true)
      .attr('x', '520')
      .attr('y', '580')
      .style('font-size', '260px')
      .style('font-family', 'Asap, Helvetica')
      .style('fill', 'rgba(74, 74, 74, 0.5)');

    this.updateClock = setInterval(() => {
      const now = new Date();
      this.clock.select('.clock-left').text((`0${now.getHours()}`).slice(-2) + (this.ticker ? ':' : ' '));
      this.clock.select('.clock-right').text((`0${now.getMinutes()}`).slice(-2));
      this.ticker = !this.ticker;
    }, 1000);

    const isProducing = reduce(this.outData, (s, d) => s + d.value, 0) >= reduce(this.inData.children, (s, d) => s + d.value, 0);

    this.outArc = this.svgD3.select('.bubbles')
      .append('circle')
      .classed('out-arc', true)
      .style('fill', 'rgba(0, 0, 0, 0)')
      .style('stroke', this.colors['out'])
      .style('stroke-width', '20px')
      .attr('r', this.width / 2 - 20)
      .attr('cx', () => this.fullWidth / 2)
      .attr('cy', () => this.fullHeight / 2);

    this.outCircle = this.svgD3.select('.bubbles').selectAll('.out-circle')
      .data(this.outCombined(), this.dataId)
      .enter()
      .append('circle')
      .classed('out-circle', true)
      .style('fill', this.colors['out'])
      .attr('r', d => (isProducing ? this.width / 2 : this.radius(this.dataWeight)(d.value)))
      .attr('cx', () => this.fullWidth / 2)
      .attr('cy', () => this.fullHeight / 2);

    this.redrawData();
  }

  redrawData() {
    this.hierarchy = d3.hierarchy(this.inData).sum(d => d.value);

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

    this.recalculateAngles();

    const arc = d3.arc()
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .innerRadius(this.width / 2 - 50)
      .outerRadius(this.width / 2 - 30);

    this.outSourcesArc = this.svgD3.select('.bubbles').selectAll('.out-source');

    this.outSourcesArc.data(this.outSources, this.dataId)
      .enter()
      .append('path')
      .classed('out-source', true)
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`)
      .transition()
      .ease(d3.easeExpOut)
      .duration(1000)
      .attr('d', arc)
      .style('fill', d => d.color)
      .style('opacity', isProducing ? 1 : 0);

    this.outSourcesArc
      .style('fill', d => d.color)
      .transition()
      .ease(d3.easeExpOut)
      .duration(1000)
      .style('opacity', isProducing ? 1 : 0)
      .attrTween('d', function (d) {
        const i = d3.interpolate(d.old, d);
        d.old = i(0);
        return (t) => arc(i(t));
      });

    this.outSourcesArc.data(this.outSources, this.dataId)
      .exit()
      .transition()
      .duration(200)
      .style('opacity', 0)
      .remove();

    this.pack = d3.pack().size([this.fullWidth / scale - 20, this.fullHeight / scale - 20]);

    this.circle = this.svgD3.select('.bubbles').selectAll('.in-circle').data(this.pack(this.hierarchy).descendants());

    this.text = this.svgD3.select('.bubbles').selectAll('.in-text').data(this.pack(this.hierarchy).descendants());

    // FIXME: wrapping text into tspan (see wrapping long labels example) leads to less controllable rows and overcomplicated renderer.
    // Fix it later, there must be cleaner solution.
    this.name = this.svgD3.select('.bubbles').selectAll('.in-name').data(this.pack(this.hierarchy).descendants());

    this.circle
      .exit()
      .transition()
      .duration(200)
      .attr('r', 0)
      .style('opacity', 0)
      .remove();

    this.text
      .exit()
      .transition()
      .duration(200)
      .attr('r', 0)
      .style('opacity', 0)
      .remove();

    this.name
      .exit()
      .transition()
      .duration(200)
      .attr('r', 0)
      .style('opacity', 0)
      .remove();

    this.circle
      .transition()
      .ease(d3.easeExpOut)
      .duration(1000)
      .attr('cx', d => ((d.x || 0) + (((this.fullWidth) - (this.fullWidth / scale)) / 2)))
      .attr('cy', d => ((d.y || 0) + (((this.fullHeight) - (this.fullHeight / scale)) / 2 + margin)))
      .attr('r', d => d.r || 0);

    this.text
      .transition()
      .ease(d3.easeExpOut)
      .duration(1000)
      .attr('x', d => ((d.x || 0) + (((this.fullWidth) - (this.fullWidth / scale)) / 2) - (d.r || 0) + ((d.r || 0) / 8)))
      .attr('y', d => ((d.y || 0) + (((this.fullHeight) - (this.fullHeight / scale)) / 2 + margin + ((d.r || 0) / 8))))
      .text(d => d.data.label === 'consumption_common' ? formatLabel(d.data.value) : '')
      .attr('font-size', d => d.r / 2);

    this.name
      .transition()
      .ease(d3.easeExpOut)
      .duration(1000)
      .attr('x', d => ((d.x || 0) + (((this.fullWidth) - (this.fullWidth / scale)) / 2) - (d.r || 0) + ((d.r || 0) / 8)))
      .attr('y', d => ((d.y || 0) + (((this.fullHeight) - (this.fullHeight / scale)) / 2 + margin + ((d.r || 0) / 2))))
      .text(d => d.data.label === 'consumption_common' ? d.data.name : '')
      .attr('font-size', d => d.r / 2);

    this.circle
      .enter()
      .append('circle')
      .classed('in-circle', true)
      .style('fill', el => {
        if (!el.parent) return 'rgba(0, 0, 0, 0)';
        return el.data.color;
      })
      .transition()
      .ease(d3.easeExpOut)
      .duration(1000)
      .attr('cx', d => ((d.x || 0) + (((this.fullWidth) - (this.fullWidth / scale)) / 2)))
      .attr('cy', d => ((d.y || 0) + (((this.fullHeight) - (this.fullHeight / scale)) / 2 + margin)))
      .attr('r', d => d.r || 0);

    this.text
      .enter()
      .append('text')
      .classed('in-text', true)
      .transition()
      .ease(d3.easeExpOut)
      .duration(1000)
      .attr('x', d => ((d.x || 0) + (((this.fullWidth) - (this.fullWidth / scale)) / 2) - (d.r || 0) + ((d.r || 0) / 8)))
      .attr('y', d => ((d.y || 0) + (((this.fullHeight) - (this.fullHeight / scale)) / 2 + margin + ((d.r || 0) / 8))))
      .text(d => d.data.label === 'consumption_common' ? formatLabel(d.data.value) : '')
      .attr('font-size', d => d.r / 2)
      .attr('font-family', 'Asap')
      .attr('fill', 'white');

    this.name
      .enter()
      .append('text')
      .classed('in-name', true)
      .transition()
      .ease(d3.easeExpOut)
      .duration(1000)
      .attr('x', d => ((d.x || 0) + (((this.fullWidth) - (this.fullWidth / scale)) / 2) - (d.r || 0) + ((d.r || 0) / 8)))
      .attr('y', d => ((d.y || 0) + (((this.fullHeight) - (this.fullHeight / scale)) / 2 + margin + ((d.r || 0) / 2))))
      .text(d => d.data.label === 'consumption_common' ? d.data.name : '')
      .attr('font-size', d => d.r / 2)
      .attr('font-family', 'Asap')
      .attr('fill', 'white');

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

  componentWillUnmount() {
    clearInterval(this.updateClock);
  }
}

export default Bubbles;
