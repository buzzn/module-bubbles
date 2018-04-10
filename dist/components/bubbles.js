"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Bubbles = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _filter = _interopRequireDefault(require("lodash/filter"));

var _forEach = _interopRequireDefault(require("lodash/forEach"));

var _reduce = _interopRequireDefault(require("lodash/reduce"));

var _map = _interopRequireDefault(require("lodash/map"));

var _find = _interopRequireDefault(require("lodash/find"));

var _findIndex = _interopRequireDefault(require("lodash/findIndex"));

var _util = require("../_util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var d3 = require('d3');

var Bubbles =
/*#__PURE__*/
function (_Component) {
  _inherits(Bubbles, _Component);

  function Bubbles(props) {
    var _this;

    _classCallCheck(this, Bubbles);

    _this = _possibleConstructorReturn(this, (Bubbles.__proto__ || Object.getPrototypeOf(Bubbles)).call(this, props));
    _this.inData = {
      name: 'in',
      children: []
    };
    _this.outData = [];
    _this.colors = {
      consumption: 'rgba(128, 222, 234, 0.8)',
      consumption_common: 'rgba(70, 202, 218, 0.8)',
      out: '#D4E157',
      production_pv: '#ffeb3b',
      production_chp: '#ffa726',
      production_water: '#1e88e5',
      production_wind: '#90caf9'
    };
    _this.fullWidth = null;
    _this.width = null;
    _this.fullHeight = null;
    _this.height = null;
    _this.hierarchy = null;
    _this.pack = null;
    _this.circle = null;
    _this.value = null;
    _this.name = null;
    _this.outCircle = null;
    _this.outArc = null;
    _this.outSources = [];
    _this.outSourcesArc = null;
    _this.clock = null;
    _this.updateClock = null;
    _this.ticker = true;
    _this.svgDom = null;
    _this.svgD3 = null;
    ['setSize', 'fillPoints', 'dataId', 'totalWeight', 'dataWeight', 'radius', 'outCombined', 'recalculateAngles', 'drawData', 'redrawData'].forEach(function (method) {
      _this[method] = _this[method].bind(_assertThisInitialized(_this));
    });
    return _this;
  }

  _createClass(Bubbles, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react.default.createElement("div", {
        style: {
          width: '100%',
          height: '100%'
        }
      }, _react.default.createElement("svg", {
        ref: function ref(svgDom) {
          return _this2.svgDom = svgDom;
        },
        width: "100%",
        height: "100%",
        viewBox: "0 0 1000 1000"
      }, _react.default.createElement("circle", {
        className: "bg-circle",
        r: "480",
        cx: "500",
        cy: "500",
        style: {
          fill: '#efefef'
        }
      }), _react.default.createElement("path", {
        transform: "translate(300,300)",
        d: "M73.873,423.753c-2,0 -4,-0.8 -5.2,-2c-2.8,-2.8 -3.6,-6.8 -1.6,-10.4l108.4,-171.6l-117.6,0c-3.6,0 -6.4,-2 -7.6,-5.2c-1.2,-3.2 0,-6.8 2.8,-8.8l284,-224c3.2,-2.4 7.6,-2.4 10.4,0.4c2.8,2.8 3.6,6.8 1.2,10.4l-105.6,163.2l122.8,0c3.6,0 6.4,2 7.6,5.2c1.2,3.2 0,6.8 -2.4,8.8l-292,232c-1.6,1.6 -3.6,2 -5.2,2Z",
        style: {
          fill: '#fff',
          fillRule: 'nonzero'
        }
      })));
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var registers = this.props.registers;
      this.svgD3 = d3.select(this.svgDom);
      this.setSize();
      this.fillPoints(registers);
      this.drawData();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var registers = this.props.registers;
      this.fillPoints(registers);
      this.redrawData();
    }
  }, {
    key: "setSize",
    value: function setSize() {
      if (!this.svgDom) return;
      this.fullHeight = 1000;
      this.fullWidth = 1000;
      this.height = 1000;
      this.width = 1000;
    }
  }, {
    key: "fillPoints",
    value: function fillPoints(pointsArr) {
      var _this3 = this;

      this.inData.children = (0, _filter.default)(this.inData.children, function (oldP) {
        return (0, _find.default)(pointsArr, function (p) {
          return oldP.id === p.id;
        });
      });
      this.outData = (0, _filter.default)(this.outData, function (oldP) {
        return (0, _find.default)(pointsArr, function (p) {
          return oldP.id === p.id;
        });
      });

      var generatePoint = function generatePoint(point) {
        return {
          c: point.c,
          id: point.id,
          value: point.value,
          label: point.label.toLowerCase(),
          name: point.name,
          color: _this3.colors[point.label.toLowerCase()]
        };
      };

      (0, _forEach.default)(pointsArr, function (point) {
        var label = point.label.toLowerCase();

        if (label === 'consumption' || label === 'consumption_common') {
          var idx = (0, _findIndex.default)(_this3.inData.children, function (p) {
            return p.id === point.id;
          });

          if (idx === -1) {
            _this3.inData.children.push(generatePoint(point));
          } else {
            _this3.inData.children[idx].value = point.value;
          }
        } else if (label === 'production_pv' || label === 'production_chp' || label === 'production_water' || label === 'production_wind') {
          var _idx = (0, _findIndex.default)(_this3.outData, function (p) {
            return p.id === point.id;
          });

          if (_idx === -1) {
            _this3.outData.push(generatePoint(point));
          } else {
            _this3.outData[_idx].value = point.value;
          }
        }
      });
    }
  }, {
    key: "dataId",
    value: function dataId(d) {
      return d.id;
    }
  }, {
    key: "totalWeight",
    value: function totalWeight(dataArr) {
      return (0, _reduce.default)(dataArr, function (sum, d) {
        return sum + d.value;
      }, 0);
    }
  }, {
    key: "dataWeight",
    value: function dataWeight() {
      var weightIn = this.totalWeight(this.inData.children);
      var weightOut = this.totalWeight(this.outData);
      return weightOut > weightIn ? weightOut : weightIn;
    }
  }, {
    key: "radius",
    value: function radius(weight) {
      var zoom = this.width / 3;
      return d3.scalePow().exponent(0.5).domain([0, weight()]).range([2, zoom]);
    }
  }, {
    key: "outCombined",
    value: function outCombined() {
      return [{
        id: 'outBubble',
        value: (0, _reduce.default)(this.outData, function (s, d) {
          return s + d.value;
        }, 0)
      }];
    }
  }, {
    key: "recalculateAngles",
    value: function recalculateAngles() {
      var _this4 = this;

      var totalPower = (0, _reduce.default)(this.outData, function (s, d) {
        return s + d.value;
      }, 0);
      var sources = {};
      (0, _forEach.default)(this.outData, function (d) {
        if (!sources[d.label]) sources[d.label] = {
          color: _this4.colors[d.label] || _this4.colors['out'],
          value: 0
        };
        sources[d.label].value += d.value;
      });
      var outSources = (0, _map.default)(sources, function (v, k) {
        return _objectSpread({
          id: k,
          source: k
        }, v);
      });
      var startAngle = 0;
      (0, _forEach.default)(outSources, function (data, idx) {
        if (data.value === 0) return;
        var endAngle = data.value / totalPower * 2 * Math.PI + startAngle || 0;
        outSources[idx].startAngle = startAngle;
        outSources[idx].endAngle = endAngle;
        startAngle = endAngle;
        var resIdx = (0, _findIndex.default)(_this4.outSources, function (s) {
          return s.source === data.source;
        });

        if (resIdx > -1) {
          _this4.outSources[resIdx] = _objectSpread({}, outSources[idx], {
            old: _this4.outSources[resIdx].old
          });
        } else {
          _this4.outSources.push(outSources[idx]);
        }
      });
    }
  }, {
    key: "drawData",
    value: function drawData() {
      var _this5 = this;

      this.svgD3.append('g').classed('bubbles', true);

      if (this.props.showClock) {
        this.clock = this.svgD3.append('g').classed('clock', true);
        this.clock.append('text').text('').classed('clock-left', true).attr('x', '180').attr('y', '580').style('font-size', '260px').style('font-family', 'Source Sans Pro, Helvetica').style('fill', 'rgba(74, 74, 74, 0.5)');
        this.clock.append('text').text('').classed('clock-right', true).attr('x', '520').attr('y', '580').style('font-size', '260px').style('font-family', 'Source Sans Pro, Helvetica').style('fill', 'rgba(74, 74, 74, 0.5)');
        this.updateClock = setInterval(function () {
          var now = new Date();

          _this5.clock.select('.clock-left').text("0".concat(now.getHours()).slice(-2) + (_this5.ticker ? ':' : ' '));

          _this5.clock.select('.clock-right').text("0".concat(now.getMinutes()).slice(-2));

          _this5.ticker = !_this5.ticker;
        }, 1000);
      }

      var isProducing = (0, _reduce.default)(this.outData, function (s, d) {
        return s + d.value;
      }, 0) >= (0, _reduce.default)(this.inData.children, function (s, d) {
        return s + d.value;
      }, 0);
      this.outArc = this.svgD3.select('.bubbles').append('circle').classed('out-arc', true).style('fill', 'rgba(0, 0, 0, 0)').style('stroke', this.colors['out']).style('stroke-width', '20px').attr('r', this.width / 2 - 20).attr('cx', function () {
        return _this5.fullWidth / 2;
      }).attr('cy', function () {
        return _this5.fullHeight / 2;
      });
      this.outCircle = this.svgD3.select('.bubbles').selectAll('.out-circle').data(this.outCombined(), this.dataId).enter().append('circle').classed('out-circle', true).style('fill', this.colors['out']).attr('r', function (d) {
        return isProducing ? _this5.width / 2 : _this5.radius(_this5.dataWeight)(d.value);
      }).attr('cx', function () {
        return _this5.fullWidth / 2;
      }).attr('cy', function () {
        return _this5.fullHeight / 2;
      });
      this.redrawData();
    }
  }, {
    key: "redrawData",
    value: function redrawData() {
      var _this6 = this;

      var _props$widgetScale = this.props.widgetScale,
          widgetScale = _props$widgetScale === void 0 ? 1 : _props$widgetScale;

      var _svgDom$getBoundingCl = this.svgDom.getBoundingClientRect(),
          svgWidth = _svgDom$getBoundingCl.width,
          svgHeight = _svgDom$getBoundingCl.height;

      var widgetSize = Math.min(svgWidth, svgHeight);
      this.hierarchy = d3.hierarchy(this.inData).sum(function (d) {
        return d.value;
      });
      var isProducing = (0, _reduce.default)(this.outData, function (s, d) {
        return s + d.value;
      }, 0) >= (0, _reduce.default)(this.inData.children, function (s, d) {
        return s + d.value;
      }, 0);
      var scale = (0, _reduce.default)(this.outData, function (s, d) {
        return s + d.value;
      }, 0) / (0, _reduce.default)(this.inData.children, function (s, d) {
        return s + d.value;
      }, 0);
      var margin = 0;

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
      var arc = d3.arc().startAngle(function (d) {
        return d.startAngle;
      }).endAngle(function (d) {
        return d.endAngle;
      }).innerRadius(this.width / 2 - 50).outerRadius(this.width / 2 - 30);
      this.outSourcesArc = this.svgD3.select('.bubbles').selectAll('.out-source');
      this.outSourcesArc.data(this.outSources, this.dataId).enter().append('path').classed('out-source', true).attr('transform', "translate(".concat(this.width / 2, ", ").concat(this.height / 2, ")")).transition().ease(d3.easeExpOut).duration(1000).attr('d', arc).style('fill', function (d) {
        return d.color;
      }).style('opacity', isProducing ? 1 : 0);
      this.outSourcesArc.style('fill', function (d) {
        return d.color;
      }).transition().ease(d3.easeExpOut).duration(1000).style('opacity', isProducing ? 1 : 0).attrTween('d', function (d) {
        var i = d3.interpolate(d.old, d);
        d.old = i(0);
        return function (t) {
          return arc(i(t));
        };
      });
      this.outSourcesArc.data(this.outSources, this.dataId).exit().transition().duration(200).style('opacity', 0).remove();
      this.pack = d3.pack().size([this.fullWidth / scale - 20, this.fullHeight / scale - 20]);
      this.circle = this.svgD3.select('.bubbles').selectAll('.in-circle').data(this.pack(this.hierarchy).descendants());
      this.value = this.svgD3.select('.bubbles').selectAll('.in-value').data(this.pack(this.hierarchy).descendants()); // FIXME: wrapping text into tspan (see wrapping long labels example) leads to less controllable rows and overcomplicated renderer.
      // Fix it later, there must be cleaner solution.

      this.name = this.svgD3.select('.bubbles').selectAll('.in-name').data(this.pack(this.hierarchy).descendants());
      ['circle', 'value', 'name'].forEach(function (type) {
        _this6[type].exit().transition().duration(200).attr('r', 0).style('opacity', 0).remove();
      });
      this.circle.transition().ease(d3.easeExpOut).duration(1000).attr('cx', function (d) {
        return (d.x || 0) + (_this6.fullWidth - _this6.fullWidth / scale) / 2;
      }).attr('cy', function (d) {
        return (d.y || 0) + ((_this6.fullHeight - _this6.fullHeight / scale) / 2 + margin);
      }).attr('r', function (d) {
        return d.r || 0;
      });
      this.value.transition().ease(d3.easeExpOut).duration(1000).attr('x', function (d) {
        return (d.x || 0) + (_this6.fullWidth - _this6.fullWidth / scale) / 2;
      }).attr('y', function (d) {
        if (d.data.label !== 'consumption_common') return 0;
        var scSize = d3.scaleLinear().domain([0, 1000]).range([0, widgetSize * widgetScale]);
        if (scSize(d.r * 2) < 100) return (d.y || 0) + ((_this6.fullHeight - _this6.fullHeight / scale) / 2 + margin + (d.r || 0) / 5);
        return (d.y || 0) + ((_this6.fullHeight - _this6.fullHeight / scale) / 2 + margin);
      });
      this.name.transition().ease(d3.easeExpOut).duration(1000).attr('x', function (d) {
        return (d.x || 0) + (_this6.fullWidth - _this6.fullWidth / scale) / 2;
      }).attr('y', function (d) {
        return (d.y || 0) + ((_this6.fullHeight - _this6.fullHeight / scale) / 2 + margin + (d.r || 0) / 3);
      });
      this.circle.enter().append('circle').classed('in-circle', true).style('fill', function (el) {
        if (!el.parent) return 'rgba(0, 0, 0, 0)';
        return el.data.color;
      }).transition().ease(d3.easeExpOut).duration(1000).attr('cx', function (d) {
        return (d.x || 0) + (_this6.fullWidth - _this6.fullWidth / scale) / 2;
      }).attr('cy', function (d) {
        return (d.y || 0) + ((_this6.fullHeight - _this6.fullHeight / scale) / 2 + margin);
      }).attr('r', function (d) {
        return d.r || 0;
      });
      this.value.enter().append('text').classed('in-value', true).transition().ease(d3.easeExpOut).duration(1000).attr('x', function (d) {
        return (d.x || 0) + (_this6.fullWidth - _this6.fullWidth / scale) / 2;
      }).attr('y', function (d) {
        if (d.data.label !== 'consumption_common') return 0;
        var scSize = d3.scaleLinear().domain([0, 1000]).range([0, widgetSize * widgetScale]);
        if (scSize(d.r * 2) < 100) return (d.y || 0) + ((_this6.fullHeight - _this6.fullHeight / scale) / 2 + margin + (d.r || 0) / 5);
        return (d.y || 0) + ((_this6.fullHeight - _this6.fullHeight / scale) / 2 + margin);
      });
      this.value.each(function (d, i) {
        d3.select(this).selectAll('.in-text').remove();
        if (d.data.label !== 'consumption_common') return;
        var scSize = d3.scaleLinear().domain([0, 1000]).range([0, widgetSize * widgetScale]);
        if (scSize(d.r * 2) < 60) return;
        d3.select(this).append('tspan').classed('in-text', true).text(function (d) {
          return (0, _util.formatLabel)(d.data.value).split(' ')[0];
        }).attr('text-anchor', 'middle').attr('font-size', function (d) {
          return d.r / 5 * 3;
        }).attr('font-family', 'Asap').attr('fill', 'rgba(255, 255, 255, 0.8)');
        d3.select(this).append('tspan').classed('in-text', true).text(function (d) {
          return (0, _util.formatLabel)(d.data.value).split(' ')[1];
        }).attr('text-anchor', 'middle').attr('font-size', function (d) {
          return d.r / 5;
        }).attr('font-family', 'Asap').attr('fill', 'rgba(255, 255, 255, 0.8)');
      });
      this.name.enter().append('text').classed('in-name', true).transition().ease(d3.easeExpOut).duration(1000).attr('x', function (d) {
        return (d.x || 0) + (_this6.fullWidth - _this6.fullWidth / scale) / 2;
      }).attr('y', function (d) {
        return (d.y || 0) + ((_this6.fullHeight - _this6.fullHeight / scale) / 2 + margin + (d.r || 0) / 3);
      });
      this.name.each(function (d, i) {
        var _this7 = this;

        d3.select(this).selectAll('.in-text').remove();
        if (d.data.label !== 'consumption_common') return;
        var scSize = d3.scaleLinear().domain([0, 1000]).range([0, widgetSize * widgetScale]);
        if (scSize(d.r * 2) < 100) return;
        d3.select(this).append('tspan').classed('in-text', true).text(function (d) {
          if (!d.data.name) return '';
          if (d.data.name.length <= 20) return d.data.name;
          return "".concat(d.data.name.slice(0, 17), "...");
        }).attr('text-anchor', 'middle').attr('font-size', function (d) {
          return Math.min(d.r / 5, d.r / 5 / _this7.getComputedTextLength() * 150);
        }).attr('font-family', 'Asap').attr('fill', 'rgba(255, 255, 255, 0.8)');
      });
      this.outArc.transition().ease(d3.easeExpOut).duration(1000).style('opacity', isProducing ? 1 : 0);
      this.outCircle.data(this.outCombined(), this.dataId).transition().ease(d3.easeExpOut).duration(1000).style('opacity', isProducing ? 0 : 1).attr('r', function (d) {
        return isProducing ? _this6.width / 2 : _this6.radius(_this6.dataWeight)(d.value);
      });
      this.svgD3.select('.bg-circle').transition().ease(d3.easeExpOut).duration(1000).style('opacity', isProducing ? 1 : 0);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearInterval(this.updateClock);
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    value: function __reactstandin__regenerateByEval(key, code) {
      this[key] = eval(code);
    }
  }]);

  return Bubbles;
}(_react.Component);

exports.Bubbles = Bubbles;
Object.defineProperty(Bubbles, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    registers: _propTypes.default.array.isRequired
  }
});
var _default = Bubbles;
var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(Bubbles, "Bubbles", "app/components/bubbles.js");
  reactHotLoader.register(_default, "default", "app/components/bubbles.js");
  leaveModule(module);
})();

;