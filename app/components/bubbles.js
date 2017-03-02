import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import 'whatwg-fetch';
import forEach from 'lodash/forEach';
import reduce from 'lodash/reduce';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import first from 'lodash/first';
import last from 'lodash/last';
import debounce from 'lodash/debounce';
import { getJson } from '../util/requests';

const d3 = require('d3');

require('font-awesome/css/font-awesome.css');

export class Bubbles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetchTimer: null,
      drawTimer: null,
      seedTimer: null,
    };
  }

  static propTypes = {
    url: React.PropTypes.string.isRequired,
    group: React.PropTypes.string.isRequired,
  };

  render() {
    const { group } = this.props;
    const tooltipId = `tooltip-${group}`;
    const svgId = `group-${group}`;
    const switchId = `switch-${group}`;
    return <div style={{ width: '100%', height: '100%' }}>
            <i className="fa fa-retweet" id={ switchId }></i>
            <svg id={ svgId } style={{ width: '100%', height: '100%' }}></svg>
            <div id={ tooltipId } style={{
              position: 'absolute',
              textAlign: 'center',
              borderRadius: '5px',
              border: '1px solid #000',
              background: '#fff',
              opacity: 0,
              display: 'none',
              color: 'black',
              padding: '10px',
              width: '300px',
              fontSize: '12px',
              zIndex: 10,
            }}></div>
          </div>;
  }

  componentDidMount() {
    const self = this;
    const { url, group, setData, setLoading, setLoaded } = this.props;
    const svg = d3.select(`#group-${group}`);
    const switchButton = document.querySelector(`#switch-${group}`);
    let switchInOnTop = true;
    let fullWidth = null;
    let width = null;
    let fullHeight = null;
    let height = null;
    // const width = +svg.attr('width');
    // const height = +svg.attr('height');
    const inColor = '#5FA2DD';
    const outColor = '#F76C51';
    const outScale = 1.2;
    const borderWidth = '3px';
    const inData = [];
    const outData = [];
    const headers = {
      Accept: 'application/json',
    };
    let circle = null;
    let outCircle = null;
    let simulation = null;
    let path = null;
    let arc = null;
    const tooltip = d3.select(`#tooltip-${group}`);

    function setSize() {
      const svgDom = document.querySelector(`#group-${group}`);
      if (!svgDom) return;
      fullWidth = svgDom.getBoundingClientRect().width;
      width = fullWidth;
      fullHeight = svgDom.getBoundingClientRect().height;
      height = fullHeight;
      if (width > height + height * 0.2) {
        width = height;
      } else if (height > width + width * 0.2) {
        height = width;
      }
    }

    function fillPoints(pointsArr) {
      forEach(pointsArr, (point) => {
        const pointObj = {
          id: point.id,
          value: 0,
          r: 0,
          name: point.attributes.name,
          x: d3.scaleLinear()
            .domain([0, fullWidth])
            .range([fullWidth * 0.4, fullWidth * 0.6])(Math.random() * fullWidth),
          y: d3.scaleLinear()
            .domain([0, fullHeight])
            .range([fullHeight * 0.4, fullHeight * 0.6])(Math.random() * fullHeight),
          seeded: false,
          updating: false,
        };
        if (point.attributes.direction === 'in') {
          inData.push(Object.assign({}, pointObj, { color: inColor, outPoint: false }));
        } else {
          outData.push(Object.assign({}, pointObj, { color: outColor, outPoint: true, startAngle: 0, endAngle: 0 }));
        }
      });
    }

    function dataId(d) {
      return d.id;
    }

    function totalWeight(dataArr) {
      return reduce(dataArr, (sum, d) => sum + d.value, 0);
    }

    function dataWeight() {
      const weightIn = totalWeight(inData);
      // return weightIn;
      const weightOut = totalWeight(outData);
      return weightOut > weightIn ? weightOut : weightIn;
    }

    function radius(weight) {
      const zoom = width / 3;
      return d3.scalePow()
        .exponent(0.5)
        .domain([0, weight()])
        .range([2, zoom]);
    }

    function outCombined() {
      return [{
        id: 'outBubble',
        value: reduce(outData, (s, d) => s + d.value, 0) * outScale,
        name: 'Power produced',
        outPoint: true,
      }];
    }

    function recalculateAngles() {
      const totalPower = reduce(outData, (s, d) => s + d.value, 0) * outScale;
      let startAngle = 0;
      forEach(outData, (data, idx) => {
        if (data.value === 0) return;
        let endAngle = (data.value * outScale / totalPower * 2 * Math.PI + startAngle) || 0;
        if (outData.length > 1 && endAngle > 0.015) endAngle -= 0.015;
        outData[idx].startAngle = startAngle;
        outData[idx].endAngle = endAngle;
        startAngle = endAngle + 0.015;
      });
    }

    function formatPower(power) {
      const powerArr = power.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').split(',');
      powerArr.pop();
      return powerArr.join('.');
    }

    function getData() {
      forEach(inData, (point, idx) => {
        if (inData[idx].updating) return;
        inData[idx].updating = true;
        fetch(`${url}/api/v1/aggregates/present?register_ids=${point.id}`, { headers })
          .then(getJson)
          .then(json => {
            inData[idx].value = Math.floor(Math.abs(json.power_milliwatt)) || 0;
            inData[idx].seeded = true;
            inData[idx].updating = false;
          })
          .catch(error => {
            inData[idx].updating = false;
            console.log(error);
          });
      });
      forEach(outData, (point, idx) => {
        if (outData[idx].updating) return;
        outData[idx].updating = true;
        fetch(`${url}/api/v1/aggregates/present?register_ids=${point.id}`, { headers })
          .then(getJson)
          .then(json => {
            outData[idx].value = Math.floor(Math.abs(json.power_milliwatt)) || 0;
            recalculateAngles();
            outData[idx].seeded = true;
            outData[idx].updating = false;
          })
          .catch(error => {
            outData[idx].updating = false;
            console.log(error);
          });
      });
      setData({
        in: formatPower(reduce(inData, (s, d) => s + d.value, 0)),
        out: formatPower(reduce(outData, (s, d) => s + d.value, 0)),
      });
    }

    function ticked() {
      circle.attr('cx', d => d.x)
        .attr('cy', d => d.y);
    }

    function showDetails(data, i, element) {
      if (data.outPoint && data.id !== 'outBubble') {
        d3.select(element).style('opacity', 0.9);
      } else {
        const color = data.outPoint ? outColor : inColor;
        const opacity = data.outPoint ? 0.9 : 0.7;
        d3.select(element).style('stroke', d3.rgb(color).darker().darker());
        d3.select(element).style('opacity', opacity);
      }
      tooltip.transition()
        .duration(500)
        .style('opacity', 1)
        .style('display', 'block');
      tooltip.html(`<b>Name: </b>${data.name}<br /><b>Power: </b>${formatPower(data.value)} Watt`)
        .style('left', `${d3.event.offsetX + 20}px`)
        .style('top', `${d3.event.offsetY - 20}px`);
    }

    function hideDetails(data, i, element) {
      if (data.outPoint && data.id !== 'outBubble') {
        d3.select(element).style('opacity', 1);
      } else {
        const color = data.outPoint ? outColor : inColor;
        const opacity = data.outPoint ? 1 : 0.9;
        d3.select(element).style('stroke', d3.rgb(color).darker());
        d3.select(element).style('opacity', opacity);
      }
      tooltip.transition()
        .duration(500)
        .style('opacity', 0)
        .style('display', 'none');
    }

    function scaleCenterForce(val) {
      const sortedData = sortBy(inData, d => d.value);
      return d3.scaleLinear()
        .domain([last(sortedData).value, first(sortedData).value])
        .range([0.004, 0.0005])
        .clamp(true)(val);
    }

    function drawData() {
      outCircle = svg.selectAll('circle')
        .data(outCombined(), dataId)
        .enter()
        .append('circle')
        .style('fill', outColor)
        .style('stroke', d3.rgb(outColor).darker())
        .style('stroke-width', borderWidth)
        .attr('r', d => radius(dataWeight)(d.value))
        .attr('cx', () => fullWidth / 2)
        .attr('cy', () => fullHeight / 2)
        .on('mouseover', function mouseShow(d, i) { showDetails(d, i, this); })
        .on('mouseout', function mouseHide(d, i) { hideDetails(d, i, this); })
        .on('touchstart', function touchShow(d, i) { showDetails(d, i, this); })
        .on('touchend', function touchHide(d, i) {
          const elementSelf = this;
          setTimeout(() => hideDetails(d, i, elementSelf), 1000);
        });

      arc = d3.arc()
        .startAngle(d => d.startAngle)
        .endAngle(d => d.endAngle)
        .cornerRadius(16)
        .innerRadius(() => radius(dataWeight)(outCombined()[0].value))
        .outerRadius(() => radius(dataWeight)(outCombined()[0].value * 1.1));

      path = svg.selectAll('path')
        .data(outData)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('id', d => `path_${d.id}`)
        .attr('stroke-width', 4)
        .style('stroke', 'none')
        .attr('transform', `translate(${fullWidth / 2}, ${fullHeight / 2})`)
        .style('fill', d3.rgb(outColor).darker())
        .on('mouseover', function mouseShow(d, i) { showDetails(d, i, this); })
        .on('mouseout', function mouseHide(d, i) { hideDetails(d, i, this); })
        .on('touchstart', function touchShow(d, i) { showDetails(d, i, this); })
        .on('touchend', function touchHide(d, i) {
          const elementSelf = this;
          setTimeout(() => hideDetails(d, i, elementSelf), 1000);
        });

      simulation = d3.forceSimulation(inData)
        .velocityDecay(0.2)
        // .alphaDecay(0)
        .force('x', d3.forceX(fullWidth / 2).strength(d => scaleCenterForce(d.value)))
        .force('y', d3.forceY(fullHeight / 2).strength(d => scaleCenterForce(d.value)))
        .force('collide', d3.forceCollide()
          .radius(d => radius(dataWeight)(d.value) + 0.5)
          .strength(0.02)
          .iterations(2))
        .force('charge', d3.forceManyBody()
          .strength(d => d.value * 0.000002 / d3.scaleLinear()
            .domain([0, 300])
            .range([1, 100])(inData.length)))
        .on('tick', ticked);

      const nodes = simulation.nodes();

      circle = svg.selectAll('circle')
        .data(nodes, dataId)
      // .data(data, dataId)
        .enter()
        .append('circle')
        .style('fill', inColor)
        .style('stroke', d3.rgb(inColor).darker())
        .style('stroke-width', borderWidth)
        .style('opacity', 0.9)
        .attr('r', d => radius(dataWeight)(d.value))
        .on('mouseover', function mouseShow(d, i) { showDetails(d, i, this); })
        .on('mouseout', function mouseHide(d, i) { hideDetails(d, i, this); })
        .on('touchstart', function touchShow(d, i) { showDetails(d, i, this); })
        .on('touchend', function touchHide(d, i) {
          const elementSelf = this;
          setTimeout(() => hideDetails(d, i, elementSelf), 1000);
        });
    }

    function redrawData() {
      circle.transition()
        .ease(d3.easeExpOut)
        .duration(1000)
        .attr('r', d => radius(dataWeight)(d.value));

      simulation.alpha(0.8)
        .force('x', d3.forceX(fullWidth / 2).strength(d => scaleCenterForce(d.value)))
        .force('y', d3.forceY(fullHeight / 2).strength(d => scaleCenterForce(d.value)))
        .force('charge', d3.forceManyBody()
          .strength(d => d.value * 0.000002 / d3.scaleLinear()
            .domain([0, 300])
            .range([1, 100])(inData.length)))
        .nodes(inData)
        .restart();

      outCircle.data(outCombined(), dataId)
        .transition()
        .ease(d3.easeExpOut)
        .duration(1000)
        .attr('r', d => radius(dataWeight)(d.value));

      arc = d3.arc()
        .startAngle(d => d.startAngle)
        .endAngle(d => d.endAngle)
        .cornerRadius(16)
        .innerRadius(() => radius(dataWeight)(outCombined()[0].value))
        .outerRadius(() => radius(dataWeight)(outCombined()[0].value * 1.1));

      path.transition()
        .ease(d3.easeExpOut)
        .duration(1000)
        .attr('d', arc);
    }

    switchButton.addEventListener('click', () => {
      if (switchInOnTop) {
        switchInOnTop = false;
        circle.lower();
      } else {
        switchInOnTop = true;
        circle.raise();
      }
    });

    this.onResize = debounce(() => {
      if (!outCircle || !arc || !path || !circle || !simulation) return;

      setSize();

      outCircle.attr('cx', () => fullWidth / 2)
        .attr('cy', () => fullHeight / 2)
        .transition()
        .ease(d3.easeExpOut)
        .duration(1000)
        .attr('r', d => radius(dataWeight)(d.value));

      arc.innerRadius(() => radius(dataWeight)(outCombined()[0].value))
        .outerRadius(() => radius(dataWeight)(outCombined()[0].value * 1.1));

      path.attr('transform', `translate(${fullWidth / 2}, ${fullHeight / 2})`)
        .transition()
        .ease(d3.easeExpOut)
        .duration(1000)
        .attr('d', arc);

      circle.transition()
        .ease(d3.easeExpOut)
        .duration(1000)
        .attr('r', d => radius(dataWeight)(d.value));

      // Params are different from draw/redraw
      simulation.force('x', d3.forceX(fullWidth / 2).strength(d => scaleCenterForce(d.value * 10)))
        .force('y', d3.forceY(fullHeight / 2).strength(d => scaleCenterForce(d.value * 10)))
        .force('charge', d3.forceManyBody()
          .strength(d => d.value * 0.00002 / d3.scaleLinear()
            .domain([0, 300])
            .range([1, 100])(inData.length)))
        .alpha(1)
        .restart();
    }, 500);

    function getMeteringPoints(page = 1, paginated) {
      let registersUrl = `${url}/api/v1/groups/${group}/registers`;
      if (paginated) registersUrl = `${url}/api/v1/groups/${group}/registers?per_page=10&page=${page}`;

      fetch(registersUrl, { headers })
        .then(getJson)
        .then(json => {
          if (json.data.length === 0) return Promise.reject('Empty group');
          fillPoints(json.data);
          if (json.meta && json.meta.total_pages > page) {
            getMeteringPoints(page + 1, true);
          } else {
            getData();
            self.setState({ fetchTimer: setInterval(getData, 10000) });
            self.setState({ seedTimer: setInterval(() => {
              if (!find(inData, d => !d.seeded) && !find(outData, d => !d.seeded)) {
                clearInterval(self.state.seedTimer);
                setLoaded();
                drawData();
                self.setState({ drawTimer: setInterval(redrawData, 10000) });
              }
            }, 2000) });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }

    setSize();

    window.addEventListener('resize', this.onResize);

    setLoading();
    getMeteringPoints();
  }

  componentWillUnmount() {
    clearInterval(this.state.fetchTimer);
    clearInterval(this.state.drawTimer);
    clearInterval(this.state.seedTimer);
    window.removeEventListener('resize', this.onResize);
  }
}

export default Bubbles;
