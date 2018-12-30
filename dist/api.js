"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("whatwg-fetch");

var _map = _interopRequireDefault(require("lodash/map"));

var _util = require("./_util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var _default = {
  fetchGroupBubbles: function fetchGroupBubbles(_ref) {
    var apiUrl = _ref.apiUrl,
        apiPath = _ref.apiPath,
        token = _ref.token,
        groupId = _ref.groupId,
        timeout = _ref.timeout,
        adminApp = _ref.adminApp;

    if (Array.isArray(groupId)) {
      return Promise.all(groupId.map(function (gid) {
        return (0, _util.req)({
          method: 'GET',
          url: "".concat(apiUrl).concat(apiPath, "/").concat(gid),
          headers: (0, _util.prepareHeaders)(token)
        }, timeout).then(_util.camelizeResponseKeys).then(function (rawRes) {
          var body = rawRes.body,
              res = _objectWithoutProperties(rawRes, ["body"]);

          if (res._status === 200 && body) {
            return JSON.parse(body).name;
          }

          return '';
        }).then(function (groupName) {
          return (0, _util.req)({
            method: 'GET',
            url: "".concat(apiUrl).concat(apiPath, "/").concat(gid, "/bubbles"),
            headers: (0, _util.prepareHeaders)(token)
          }, timeout).then(_util.camelizeResponseKeys).then(function (rawRes) {
            var body = rawRes.body,
                res = _objectWithoutProperties(rawRes, ["body"]);

            if (res._status === 200 && body) {
              var combined = (0, _map.default)(JSON.parse(body), function (r) {
                return _objectSpread({}, r, {
                  id: "".concat(gid, "-").concat(r.id),
                  name: groupName,
                  value: r.value < 0 ? 0 : r.value
                });
              }).reduce(function (sum, val) {
                return val.label === 'consumption' || val.label === 'consumption_common' ? _objectSpread({}, sum, {
                  consumption: sum.consumption + val.value
                }) : _objectSpread({}, sum, {
                  array: sum.array.concat([val])
                });
              }, {
                consumption: 0,
                array: []
              });
              return _objectSpread({}, res, {
                array: combined.array.concat([{
                  id: gid,
                  label: 'consumption_common',
                  name: groupName,
                  value: combined.consumption
                }])
              });
            }

            return _objectSpread({}, res, {
              array: []
            });
          });
        });
      })).then(function (resArr) {
        return resArr.reduce(function (sum, rawRes) {
          return _objectSpread({}, sum, {
            array: sum.array.concat(rawRes.array)
          });
        }, {
          _status: 200,
          array: []
        });
      });
    } else {
      return (0, _util.req)({
        method: 'GET',
        url: "".concat(apiUrl).concat(apiPath, "/").concat(groupId, "/bubbles"),
        headers: (0, _util.prepareHeaders)(token)
      }, timeout).then(_util.camelizeResponseKeys).then(function (rawRes) {
        var body = rawRes.body,
            res = _objectWithoutProperties(rawRes, ["body"]);

        if (res._status === 200 && body) {
          return _objectSpread({}, res, {
            array: (0, _map.default)(JSON.parse(body), function (r) {
              return _objectSpread({}, r, {
                value: r.value < 0 ? 0 : r.value
              });
            })
          });
        }

        return _objectSpread({}, res, {
          array: []
        });
      });
    }
  }
};
// function getRandomIntInclusive(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }
// function generatePLabel() {
//   return sample([
//     'production_pv',
//     'production_chp',
//     'production_water',
//     'production_wind',
//   ]);
// }
// function generateCLabel() {
//   return Math.random() >= 0.5 ? 'consumption' : 'consumption_common';
// }
// function processPoints(pointsArr) {
//   return pointsArr.map(p => ({ ...p, id: p.resource_id }));
// }
// const mainOutPoints = range(getRandomIntInclusive(5, 20)).map(num => ({
//   resource_id: chance.guid(),
//   mode: 'out',
//   value: 0,
//   label: generatePLabel(),
//   name: chance.company(),
// }));
// const mainInPoints = range(getRandomIntInclusive(5, 20)).map(num => ({
//   resource_id: chance.guid(),
//   mode: 'in',
//   value: 0,
//   label: generateCLabel(),
//   name: chance.company(),
//   // name: 'Haus Australien, Allgemeinstrom',
// }));
// const mainPoints = mainOutPoints.concat(mainInPoints);
var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(_default, "default", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/api.js");
  leaveModule(module);
})();

;