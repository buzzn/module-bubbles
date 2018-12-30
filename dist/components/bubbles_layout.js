"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var _default = function _default(_ref) {
  var registers = _ref.registers,
      loading = _ref.loading,
      Bubbles = _ref.Bubbles;
  return _react.default.createElement("div", {
    className: "col-sm-12 col-md-6 col-lg-6 bubbles-wrapper"
  }, _react.default.createElement("div", {
    className: "row"
  }, _react.default.createElement("div", {
    className: "col-sm-12 col-md-12 col-lg-12"
  }, _react.default.createElement("div", {
    className: "panel",
    style: {
      position: 'relative'
    }
  }, _react.default.createElement("div", {
    style: {
      width: '100%',
      height: '453px',
      display: 'inline-block',
      position: 'relative'
    }
  }, _react.default.createElement(Bubbles, {
    registers: registers
  }))))));
};

var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(_default, "default", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/components/bubbles_layout.js");
  leaveModule(module);
})();

;