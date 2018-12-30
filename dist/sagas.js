"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGroupBubbles = getGroupBubbles;
exports.bubblesSagas = bubblesSagas;
exports.default = exports.getGroupId = void 0;

var _effects = require("redux-saga/effects");

var _actions = require("./actions");

var _api = _interopRequireDefault(require("./api"));

var _util = require("./_util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(getGroupBubbles),
    _marked2 =
/*#__PURE__*/
regeneratorRuntime.mark(bubblesSagas);

var errReporter = null;
var adminApp = false;

var getGroupId = function getGroupId(state) {
  return state.bubbles.groupId;
};

exports.getGroupId = getGroupId;

function getGroupBubbles(_ref) {
  var apiUrl, apiPath, token, groupId, timeout, registers;
  return regeneratorRuntime.wrap(function getGroupBubbles$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          apiUrl = _ref.apiUrl, apiPath = _ref.apiPath, token = _ref.token, groupId = _ref.groupId, timeout = _ref.timeout;
          _context.next = 3;
          return (0, _effects.put)(_actions.actions.loading());

        case 3:
          _context.prev = 3;
          _context.next = 6;
          return (0, _effects.call)(_api.default.fetchGroupBubbles, {
            apiUrl: apiUrl,
            apiPath: apiPath,
            token: token,
            groupId: groupId,
            timeout: timeout,
            adminApp: adminApp
          });

        case 6:
          registers = _context.sent;

          if (!(registers._status === 200)) {
            _context.next = 10;
            break;
          }

          _context.next = 10;
          return (0, _effects.put)(_actions.actions.setRegisters(registers));

        case 10:
          _context.next = 15;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](3);
          (0, _util.logException)(_context.t0, null, errReporter);

        case 15:
          _context.next = 17;
          return (0, _effects.put)(_actions.actions.loaded());

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, this, [[3, 12]]);
}

function bubblesSagas(_ref2) {
  var apiUrl, apiPath, token, groupId, timeout, _ref3, newGroupId, stopRequests, _newGroupId;

  return regeneratorRuntime.wrap(function bubblesSagas$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          apiUrl = _ref2.apiUrl, apiPath = _ref2.apiPath, token = _ref2.token, groupId = _ref2.groupId, timeout = _ref2.timeout;

        case 1:
          if (!true) {
            _context2.next = 27;
            break;
          }

          if (!groupId) {
            _context2.next = 18;
            break;
          }

          _context2.next = 5;
          return (0, _effects.race)({
            delay: (0, _effects.delay)(10 * 1000),
            newGroupId: (0, _effects.take)(_actions.constants.SET_GROUP_ID),
            stopRequests: (0, _effects.take)(_actions.constants.STOP_REQUESTS)
          });

        case 5:
          _ref3 = _context2.sent;
          newGroupId = _ref3.newGroupId;
          stopRequests = _ref3.stopRequests;

          if (!newGroupId) {
            _context2.next = 12;
            break;
          }

          groupId = newGroupId.groupId;
          _context2.next = 12;
          return (0, _effects.put)(_actions.actions.setRegisters({
            _status: null,
            array: []
          }));

        case 12:
          if (!stopRequests) {
            _context2.next = 16;
            break;
          }

          groupId = null;
          _context2.next = 16;
          return (0, _effects.put)(_actions.actions.setRegisters({
            _status: null,
            array: []
          }));

        case 16:
          _context2.next = 22;
          break;

        case 18:
          _context2.next = 20;
          return (0, _effects.take)(_actions.constants.SET_GROUP_ID);

        case 20:
          _newGroupId = _context2.sent;
          groupId = _newGroupId.groupId;

        case 22:
          if (!(groupId && !document.hidden)) {
            _context2.next = 25;
            break;
          }

          _context2.next = 25;
          return (0, _effects.fork)(getGroupBubbles, {
            apiUrl: apiUrl,
            apiPath: apiPath,
            token: token,
            groupId: groupId,
            timeout: timeout
          });

        case 25:
          _context2.next = 1;
          break;

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked2, this);
}

var _default =
/*#__PURE__*/
regeneratorRuntime.mark(function _default(appErrReporter, isAdminApp) {
  var _ref4, apiUrl, apiPath, _ref4$timeout, timeout, _ref5, token, groupId, sagas, payload;

  return regeneratorRuntime.wrap(function _default$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          errReporter = appErrReporter;
          adminApp = isAdminApp;
          _context3.next = 4;
          return (0, _effects.take)(_actions.constants.SET_API_PARAMS);

        case 4:
          _ref4 = _context3.sent;
          apiUrl = _ref4.apiUrl;
          apiPath = _ref4.apiPath;
          _ref4$timeout = _ref4.timeout;
          timeout = _ref4$timeout === void 0 ? 10 * 1000 : _ref4$timeout;
          _context3.next = 11;
          return (0, _effects.take)(_actions.constants.SET_TOKEN);

        case 11:
          _ref5 = _context3.sent;
          token = _ref5.token;
          _context3.next = 15;
          return (0, _effects.select)(getGroupId);

        case 15:
          groupId = _context3.sent;

          if (!groupId) {
            _context3.next = 19;
            break;
          }

          _context3.next = 19;
          return (0, _effects.fork)(getGroupBubbles, {
            apiUrl: apiUrl,
            apiPath: apiPath,
            token: token,
            groupId: groupId,
            timeout: timeout
          });

        case 19:
          if (!true) {
            _context3.next = 31;
            break;
          }

          _context3.next = 22;
          return (0, _effects.fork)(bubblesSagas, {
            apiUrl: apiUrl,
            apiPath: apiPath,
            token: token,
            groupId: groupId,
            timeout: timeout
          });

        case 22:
          sagas = _context3.sent;
          _context3.next = 25;
          return (0, _effects.take)(_actions.constants.SET_TOKEN);

        case 25:
          payload = _context3.sent;
          token = payload.token;
          _context3.next = 29;
          return (0, _effects.cancel)(sagas);

        case 29:
          _context3.next = 19;
          break;

        case 31:
        case "end":
          return _context3.stop();
      }
    }
  }, _default, this);
});

var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(errReporter, "errReporter", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/sagas.js");
  reactHotLoader.register(adminApp, "adminApp", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/sagas.js");
  reactHotLoader.register(getGroupId, "getGroupId", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/sagas.js");
  reactHotLoader.register(getGroupBubbles, "getGroupBubbles", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/sagas.js");
  reactHotLoader.register(bubblesSagas, "bubblesSagas", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/sagas.js");
  reactHotLoader.register(_default, "default", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/sagas.js");
  leaveModule(module);
})();

;