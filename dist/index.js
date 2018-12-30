"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reducers = _interopRequireDefault(require("./reducers"));

var _bubbles_wrapper = _interopRequireDefault(require("./components/bubbles_wrapper"));

var _actions = require("./actions");

var _sagas = _interopRequireDefault(require("./sagas"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var _default = {
  reducers: _reducers.default,
  container: _bubbles_wrapper.default,
  constants: _actions.constants,
  actions: _actions.actions,
  sagas: _sagas.default
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

  reactHotLoader.register(_default, "default", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/index.js");
  leaveModule(module);
})();

;