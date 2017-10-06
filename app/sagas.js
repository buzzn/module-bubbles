import { delay } from 'redux-saga';
import { call, put, fork, take, select, race, cancel } from 'redux-saga/effects';
import { constants, actions } from './actions';
import api from './api';
import { logException } from './_util';

let errReporter = null;

export const getGroupId = state => state.bubbles.groupId;

export function* getGroupBubbles({ apiUrl, apiPath, token, groupId }) {
  yield put(actions.loading());
  try {
    // const registers = yield call(api.fetchGroupBubblesFake, { apiUrl, apiPath, token, groupId });
    const registers = yield call(api.fetchGroupBubbles, { apiUrl, apiPath, token, groupId });
    yield put(actions.setRegisters(registers));
  } catch (error) {
    logException(error, null, errReporter);
  }
  yield put(actions.loaded());
}

export function* bubblesSagas({ apiUrl, apiPath, token, groupId }) {
  while (true) {
    if (groupId) {
      const { newGroupId, stopRequests } = yield race({
        delay: call(delay, 10 * 1000),
        newGroupId: take(constants.SET_GROUP_ID),
        stopRequests: take(constants.STOP_REQUESTS),
      });

      if (newGroupId) {
        groupId = newGroupId.groupId;
        yield put(actions.setRegisters([]));
      }
      if (stopRequests) {
        groupId = null;
        yield put(actions.setRegisters([]));
      }
    } else {
      const newGroupId = yield take(constants.SET_GROUP_ID);
      groupId = newGroupId.groupId;
    }

    if (groupId) yield fork(getGroupBubbles, { apiUrl, apiPath, token, groupId });
  }
}

export default function* (appErrReporter) {
  errReporter = appErrReporter;
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let groupId = yield select(getGroupId);
  if (groupId) {
    yield fork(getGroupBubbles, { apiUrl, apiPath, token, groupId });
  }

  while (true) {
    const sagas = yield fork(bubblesSagas, { apiUrl, apiPath, token, groupId });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}
