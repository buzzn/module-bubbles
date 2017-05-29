import forEach from 'lodash/forEach';
import camelCase from 'lodash/camelCase';

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
    return json;
  } else {
    return json.then(error => Promise.reject(error));
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
