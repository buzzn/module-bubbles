"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BubblesWrapper = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _reduce = _interopRequireDefault(require("lodash/reduce"));

var _bubbles_layout = _interopRequireDefault(require("./bubbles_layout"));

var _bubbles = _interopRequireDefault(require("./bubbles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var BubblesWrapper = function BubblesWrapper(props) {
  return _react.default.createElement(props.Layout, _extends({}, props, {
    Bubbles: _bubbles.default
  }));
};

exports.BubblesWrapper = BubblesWrapper;
BubblesWrapper.defaultProps = {
  Layout: _bubbles_layout.default
};

function mapStateToProps(state) {
  return {
    registers: state.bubbles.registers.array,
    loading: state.bubbles.loading
  };
}

var _default = (0, _reactRedux.connect)(mapStateToProps)(BubblesWrapper);

var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(BubblesWrapper, "BubblesWrapper", "app/components/bubbles_wrapper.js");
  reactHotLoader.register(mapStateToProps, "mapStateToProps", "app/components/bubbles_wrapper.js");
  reactHotLoader.register(_default, "default", "app/components/bubbles_wrapper.js");
  leaveModule(module);
})();

;