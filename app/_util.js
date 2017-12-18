import forEach from 'lodash/forEach';
import camelCase from 'lodash/camelCase';

export function req(reqObj, timeout) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.timeout = timeout;
    xhr.open(reqObj.method || 'GET', reqObj.url);
    if (reqObj.headers) {
      Object.keys(reqObj.headers).forEach(key => {
        xhr.setRequestHeader(key, reqObj.headers[key]);
      });
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ body: xhr.response, _status: 200 });
      } else {
        resolve({ _status: xhr.status });
      }
    };
    xhr.onerror = () => reject(xhr.statusText);
    xhr.ontimeout = () => reject('Timeout');
    xhr.send(reqObj.body);
  });
}

export function prepareHeaders(token) {
  const headers =  {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export function parseResponse(response) {
  const json = response.json();
  if (response.status >= 200 && response.status < 300) {
    return json.then(res => ({ ...res, _status: 200 }));
  } else {
    return Promise.resolve({ _status: response.status });
  }
}

export function camelizeResponseArray(data) {
  const result = [];
  forEach(data, (v) => {
    if (Array.isArray(v)) {
      result.push(camelizeResponseArray(v));
    } else if (typeof v === 'object') {
      result.push(camelizeResponseKeys(v));
    } else {
      result.push(v);
    }
  });
  return result;
}

export function camelizeResponseKeys(data) {
  const result = {};
  forEach(data, (v, k) => {
    if (Array.isArray(v)) {
      result[camelCase(k)] = camelizeResponseArray(v);
    } else if (!v) {
      result[camelCase(k)] = v;
    } else if (typeof v === 'object') {
      result[camelCase(k)] = camelizeResponseKeys(v);
    } else {
      result[camelCase(k)] = v;
    }
  });
  return result;
}

export function logException(ex, context, errReporter) {
  if (typeof errReporter === 'function') {
    errReporter(ex, context);
  } else {
    console.error(ex);
  }
}
