import 'whatwg-fetch';
import range from 'lodash/range';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import sample from 'lodash/sample';
const chance = require('chance').Chance();
import {
  req,
  prepareHeaders,
  parseResponse,
  camelizeResponseKeys,
  camelizeResponseArray,
} from './_util';

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePLabel() {
  return sample([
    'production_pv',
    'production_chp',
    'production_water',
    'production_wind',
  ]);
}

function generateCLabel() {
  return Math.random() >= 0.5 ? 'consumption' : 'consumption_common';
}

function processPoints(pointsArr) {
  return pointsArr.map(p => ({ ...p, id: p.resource_id }));
}

const mainOutPoints = range(getRandomIntInclusive(5, 20)).map(num => ({
  resource_id: chance.guid(),
  mode: 'out',
  value: 0,
  label: generatePLabel(),
  name: chance.company(),
}));
const mainInPoints = range(getRandomIntInclusive(5, 20)).map(num => ({
  resource_id: chance.guid(),
  mode: 'in',
  value: 0,
  label: generateCLabel(),
  name: chance.company(),
}));
const mainPoints = mainOutPoints.concat(mainInPoints);

export default {
  fetchGroupBubbles({ apiUrl, apiPath, token, groupId, timeout, adminApp }) {
    return req(
      {
        method: 'GET',
        url: `${apiUrl}${apiPath}/${groupId}/bubbles`,
        headers: prepareHeaders(token),
      },
      timeout,
    )
      .then(camelizeResponseKeys)
      .then((rawRes) => {
        const { body, ...res } = rawRes;
        if (res._status === 200 && body) {
          return {
            ...res,
            array: map(JSON.parse(body), r => ({
              ...r,
              value: r.value < 0 ? 0 : r.value,
            })),
          };
        }
        return { ...res, array: [] };
      });
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
    const newMainPoints = mainPoints.map(p => ({
      ...p,
      value: getRandomIntInclusive(5000, 10000),
    }));
    const outPoints = range(getRandomIntInclusive(0, 2)).map(num => ({
      resource_id: chance.guid(),
      mode: 'out',
      value: getRandomIntInclusive(80000, 180000),
      label: generatePLabel(),
      name: chance.company(),
    }));
    const inPoints = range(getRandomIntInclusive(0, 10)).map(num => ({
      c: true,
      resource_id: chance.guid(),
      mode: 'in',
      value: getRandomIntInclusive(0, 10000),
      label: generateCLabel(),
      name: chance.company(),
    }));
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          _status: 200,
          array: processPoints(
            newMainPoints.concat(outPoints.concat(inPoints)),
          ),
        });
      }, getRandomIntInclusive(100, 600));
    });
  },
};
