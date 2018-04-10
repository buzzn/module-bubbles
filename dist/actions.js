"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actions = exports.constants = void 0;

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var constants = {
  SET_API_PARAMS: 'buzzn_bubbles/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_bubbles/SET_TOKEN',
  SET_GROUP_ID: 'buzzn_bubbles/SET_GROUP_ID',
  STOP_REQUESTS: 'buzzn_bubbles/STOP_REQUESTS',
  SET_REGISTERS: 'buzzn_bubbles/SET_REGISTERS',
  LOADING: 'buzzn_bubbles/LOADING',
  LOADED: 'buzzn_bubbles/LOADED'
};
exports.constants = constants;
var actions = {
  setApiParams: function setApiParams(_ref) {
    var apiUrl = _ref.apiUrl,
        apiPath = _ref.apiPath,
        timeout = _ref.timeout;
    return {
      type: constants.SET_API_PARAMS,
      apiUrl: apiUrl,
      apiPath: apiPath,
      timeout: timeout
    };
  },
  setToken: function setToken(token) {
    return {
      type: constants.SET_TOKEN,
      token: token
    };
  },
  setGroupId: function setGroupId(groupId) {
    return {
      type: constants.SET_GROUP_ID,
      groupId: groupId
    };
  },
  stopRequests: function stopRequests() {
    return {
      type: constants.STOP_REQUESTS
    };
  },
  setRegisters: function setRegisters(registers) {
    return {
      type: constants.SET_REGISTERS,
      registers: registers
    };
  },
  loading: function loading() {
    return {
      type: constants.LOADING
    };
  },
  loaded: function loaded() {
    return {
      type: constants.LOADED
    };
  }
};
exports.actions = actions;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(constants, "constants", "app/actions.js");
  reactHotLoader.register(actions, "actions", "app/actions.js");
  leaveModule(module);
})();

;