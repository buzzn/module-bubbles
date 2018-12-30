"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.req = req;
exports.prepareHeaders = prepareHeaders;
exports.parseResponse = parseResponse;
exports.camelizeResponseArray = camelizeResponseArray;
exports.camelizeResponseKeys = camelizeResponseKeys;
exports.logException = logException;
exports.formatNumber = formatNumber;
exports.formatLabel = formatLabel;

var _forEach = _interopRequireDefault(require("lodash/forEach"));

var _camelCase = _interopRequireDefault(require("lodash/camelCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function req(reqObj, timeout) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(reqObj.method || 'GET', reqObj.url);
    xhr.timeout = timeout;

    if (reqObj.headers) {
      Object.keys(reqObj.headers).forEach(function (key) {
        xhr.setRequestHeader(key, reqObj.headers[key]);
      });
    }

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({
          body: xhr.response,
          _status: 200
        });
      } else {
        resolve({
          _status: xhr.status
        });
      }
    };

    xhr.onerror = function () {
      return reject(xhr.statusText);
    };

    xhr.ontimeout = function () {
      return reject('Timeout');
    };

    xhr.send(reqObj.body);
  });
}

function prepareHeaders(token) {
  var headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
  if (token) headers.Authorization = "Bearer ".concat(token);
  return headers;
}

function parseResponse(response) {
  var json = response.json();

  if (response.status >= 200 && response.status < 300) {
    return json.then(function (res) {
      return _objectSpread({}, res, {
        _status: 200
      });
    });
  } else {
    return Promise.resolve({
      _status: response.status
    });
  }
}

function camelizeResponseArray(data) {
  var result = [];
  (0, _forEach.default)(data, function (v) {
    if (Array.isArray(v)) {
      result.push(camelizeResponseArray(v));
    } else if (_typeof(v) === 'object') {
      result.push(camelizeResponseKeys(v));
    } else {
      result.push(v);
    }
  });
  return result;
}

function camelizeResponseKeys(data) {
  var result = {};
  (0, _forEach.default)(data, function (v, _k) {
    var k = _k === '_status' ? _k : (0, _camelCase.default)(_k);

    if (Array.isArray(v)) {
      result[k] = camelizeResponseArray(v);
    } else if (!v) {
      result[k] = v;
    } else if (_typeof(v) === 'object') {
      result[k] = camelizeResponseKeys(v);
    } else {
      result[k] = v;
    }
  });
  return result;
}

function logException(ex, context, errReporter) {
  if (typeof errReporter === 'function') {
    errReporter(ex, context);
  } else {
    console.error(ex);
  }
}

function formatNumber(value) {
  var decimalPoint = ',';
  var remainder = 0;
  var leadingNumber = 0;
  var formattedNumber = '';

  if (value >= 1000000000000000) {
    remainder = (value % 1000000000000000 / 1000000000000).toFixed(0);
    leadingNumber = Math.floor(value / 1000000000000000);
  } else if (value >= 1000000000000) {
    remainder = (value % 1000000000000 / 1000000000).toFixed(0);
    leadingNumber = Math.floor(value / 1000000000000);
  } else if (value >= 1000000000) {
    remainder = (value % 1000000000 / 1000000).toFixed(0);
    leadingNumber = Math.floor(value / 1000000000);
  } else if (value >= 1000000) {
    remainder = (value % 1000000 / 1000).toFixed(0);
    leadingNumber = Math.floor(value / 1000000);
  } else if (value >= 1000) {
    remainder = (value % 1000).toFixed(0);
    leadingNumber = Math.floor(value / 1000);
  } else {
    remainder = 0;
    leadingNumber = value.toFixed(0);
  }

  if (remainder !== 0) {
    if (remainder < 1) {
      formattedNumber = leadingNumber.toString();
    } else if (remainder < 10) {
      formattedNumber = "".concat(leadingNumber).concat(decimalPoint, "00");
    } else if (remainder < 100) {
      formattedNumber = "".concat(leadingNumber).concat(decimalPoint, "0").concat((remainder / 10).toFixed(0));
    } else if (remainder < 1000) {
      formattedNumber = "".concat(leadingNumber).concat(decimalPoint).concat((remainder / 10).toFixed(0));
    }
  } else {
    formattedNumber = leadingNumber.toString();
  }

  return formattedNumber;
}

function formatLabel(value, type) {
  var result = '';
  var number = formatNumber(value);

  if (value >= 1000000000000000) {
    result = "".concat(number, " PW");
  } else if (value >= 1000000000000) {
    result = "".concat(number, " TW");
  } else if (value >= 1000000000) {
    result = "".concat(number, " GW");
  } else if (value >= 1000000) {
    result = "".concat(number, " MW");
  } else if (value >= 1000) {
    result = "".concat(number, " kW");
  } else {
    result = "".concat(number, " W");
  }

  return type === 'h' ? "".concat(result, "h") : result;
}

;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(req, "req", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/_util.js");
  reactHotLoader.register(prepareHeaders, "prepareHeaders", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/_util.js");
  reactHotLoader.register(parseResponse, "parseResponse", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/_util.js");
  reactHotLoader.register(camelizeResponseArray, "camelizeResponseArray", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/_util.js");
  reactHotLoader.register(camelizeResponseKeys, "camelizeResponseKeys", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/_util.js");
  reactHotLoader.register(logException, "logException", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/_util.js");
  reactHotLoader.register(formatNumber, "formatNumber", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/_util.js");
  reactHotLoader.register(formatLabel, "formatLabel", "/Users/dongeolog/node_apps/buzzn/modules/bubbles/app/_util.js");
  leaveModule(module);
})();

;