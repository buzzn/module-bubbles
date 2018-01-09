import { delay } from 'redux-saga';
import { call, put, fork, take, select, race, cancel } from 'redux-saga/effects';
import { constants, actions } from './actions';
import api from './api';
import { logException } from './_util';

let errReporter = null;
let adminApp = false;

export const getGroupId = state => state.bubbles.groupId;

export function* getGroupBubbles({ apiUrl, apiPath, token, groupId, timeout }) {
  yield put(actions.loading());
  try {
    const registers = yield call(api.fetchGroupBubblesFake, { apiUrl, apiPath, token, groupId });
    // const registers = yield call(api.fetchGroupBubbles, { apiUrl, apiPath, token, groupId, timeout, adminApp });
    yield put(actions.setRegisters(registers));
  } catch (error) {
    logException(error, null, errReporter);
  }
  yield put(actions.loaded());
}

export function* bubblesSagas({ apiUrl, apiPath, token, groupId, timeout }) {
  while (true) {
    if (groupId) {
      const { newGroupId, stopRequests } = yield race({
        delay: call(delay, 10 * 1000),
        newGroupId: take(constants.SET_GROUP_ID),
        stopRequests: take(constants.STOP_REQUESTS),
      });

      if (newGroupId) {
        groupId = newGroupId.groupId;
        yield put(actions.setRegisters({ _status: null, array: [] }));
      }
      if (stopRequests) {
        groupId = null;
        yield put(actions.setRegisters({ _status: null, array: [] }));
      }
    } else {
      const newGroupId = yield take(constants.SET_GROUP_ID);
      groupId = newGroupId.groupId;
    }

    if (groupId && !document.hidden) yield fork(getGroupBubbles, { apiUrl, apiPath, token, groupId, timeout });
  }
}

export default function* (appErrReporter, isAdminApp) {
  errReporter = appErrReporter;
  adminApp = isAdminApp;
  const { apiUrl, apiPath, timeout = 10 * 1000 } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let groupId = yield select(getGroupId);
  if (groupId) {
    yield fork(getGroupBubbles, { apiUrl, apiPath, token, groupId, timeout });
  }

  while (true) {
    const sagas = yield fork(bubblesSagas, { apiUrl, apiPath, token, groupId, timeout });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}
