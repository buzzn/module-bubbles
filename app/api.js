import 'whatwg-fetch';
import range from 'lodash/range';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import { req, prepareHeaders, parseResponse, camelizeResponseKeys, camelizeResponseArray } from './_util';

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
  .toString(16)
  .substring(1);
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLabel() {
  return Math.random() >= 0.5 ? 'production_pv' : 'production_chp';
}

function processPoints(pointsArr) {
  return pointsArr.map(p => ({ ...p, id: p.resource_id }));
}

const mainOutPoints = range(getRandomIntInclusive(5, 20)).map(num => ({ resource_id: guid(), mode: 'out', value: 0, label: generateLabel() }));
const mainInPoints = range(getRandomIntInclusive(5, 20)).map(num => ({ resource_id: guid(), mode: 'in', value: 0, label: 'consumption' }));
const mainPoints = mainOutPoints.concat(mainInPoints);

export default {
  fetchGroupBubbles({ apiUrl, apiPath, token, groupId, timeout, adminApp }) {
    return req({
      method: 'GET',
      url: `${apiUrl}${apiPath}/${groupId}/bubbles`,
      headers: { ...prepareHeaders(token), 'Cache-Control': 'no-cache' },
    }, timeout)
      .then(str => camelizeResponseArray(JSON.parse(str)))
      .then(res => res.map(r => ({ ...r, value: r.value < 0 ? 0 : (r.value / 1000) })));
  },
  // fetchGroupBubbles({ apiUrl, apiPath, token, groupId }) {
  //   return fetch(`${apiUrl}${apiPath}/${groupId}/registers`, {
  //     headers: { ...prepareHeaders(token), 'Cache-Control': 'no-cache' },
  //   })
  //   .then(parseResponse)
  //   .then(camelizeResponseKeys)
  //   .then(registersRes => {
  //     const registers = registersRes.array;
  //     return fetch(`${apiUrl}${apiPath}/${groupId}/bubbles`, {
  //       headers: { ...prepareHeaders(token), 'Cache-Control': 'no-cache' },
  //     })
  //     .then(parseResponse)
  //     .then(camelizeResponseKeys)
  //     .then(bubbles => filter(bubbles.array, b => find(registers, r => r.id === b.resourceId)).map(b => ({ ...b, id: b.resourceId, label: find(registers, r => r.id === b.resourceId).label })));
  //   });
  // },
  fetchGroupBubblesFake({ apiUrl, apiPath, token, groupId }) {
    const newMainPoints = mainPoints.map(p => ({ ...p, value: getRandomIntInclusive(5000, 10000) }));
    const outPoints = range(getRandomIntInclusive(0, 2)).map(num => ({ resource_id: guid(), mode: 'out', value: getRandomIntInclusive(80000, 180000), label: generateLabel() }));
    const inPoints = range(getRandomIntInclusive(0, 10)).map(num => ({ c: true, resource_id: guid(), mode: 'in', value: getRandomIntInclusive(0, 10000), label: 'consumption' }));
    return new Promise((resolve) => {
      setTimeout(() => { resolve(processPoints(newMainPoints.concat(outPoints.concat(inPoints)))); }, getRandomIntInclusive(100, 600));
    });
  },
};
