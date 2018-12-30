"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _actions = require("./actions");

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    loading: false,
    registers: {
      _status: null,
      array: []
    }
  };
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _actions.constants.SET_GROUP_ID:
      return _objectSpread({}, state, {
        groupId: action.groupId
      });

    case _actions.constants.SET_REGISTERS:
      return _objectSpread({}, state, {
        registers: action.registers
      });

    case _actions.constants.LOADING:
      return _objectSpread({}, state, {
        loading: true
      });

    case _actions.constants.LOADED:
      return _objectSpread({}, state, {
        loading: false
      });

    default:
      return state;
  }
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

  reactHotLoader.register(_default, "default", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/reducers.js");
  leaveModule(module);
})();

;