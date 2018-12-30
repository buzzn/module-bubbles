"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _reactHotLoader = require("react-hot-loader");

var _reactRedux = require("react-redux");

var _redboxReact = _interopRequireDefault(require("redbox-react"));

var _configure_store = _interopRequireDefault(require("./configure_store"));

var _root = _interopRequireDefault(require("./root"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var render = function render(Component) {
  _reactDom.default.render(_react.default.createElement(_reactHotLoader.AppContainer, {
    errorReporter: _redboxReact.default
  }, _react.default.createElement(_reactRedux.Provider, {
    store: (0, _configure_store.default)()
  }, _react.default.createElement(Component, null))), document.querySelector('#root'));
};

render(_root.default);

if (module.hot) {
  module.hot.accept('./root', function () {
    var NewRoot = require('./root').default;

    render(NewRoot);
  });
}

;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(render, "render", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/index.dev.js");
  leaveModule(module);
})();

;