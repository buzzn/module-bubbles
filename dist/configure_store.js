"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureStore;

var _reduxSaga = _interopRequireDefault(require("redux-saga"));

var _effects = require("redux-saga/effects");

var _redux = require("redux");

var _sagas = _interopRequireDefault(require("./sagas"));

var _reducers = _interopRequireDefault(require("./reducers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(rootSaga);

function rootSaga() {
  return regeneratorRuntime.wrap(function rootSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return [(0, _effects.call)(_sagas.default)];

        case 2:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, this);
}

function configureStore(initialState) {
  var sagaMiddleware = (0, _reduxSaga.default)();
  var store = (0, _redux.createStore)((0, _redux.combineReducers)({
    bubbles: _reducers.default
  }), {}, (0, _redux.compose)((0, _redux.applyMiddleware)(sagaMiddleware), window.devToolsExtension ? window.devToolsExtension() : function (f) {
    return f;
  }));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', function () {
      var nextRootReducer = require('./reducers').default;

      store.replaceReducer(nextRootReducer);
    });
  }

  sagaMiddleware.run(rootSaga);
  return store;
}

;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(rootSaga, "rootSaga", "app/configure_store.js");
  reactHotLoader.register(configureStore, "configureStore", "app/configure_store.js");
  leaveModule(module);
})();

;