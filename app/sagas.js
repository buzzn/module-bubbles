import { constants, actions } from './actions';
import { takeLatest, delay } from 'redux-saga';
import { call, put, fork, take, select, race } from 'redux-saga/effects';
import api from './api';

export const getGroupId = state => state.bubbles.groupId;

export function* getGroupBubbles({ apiUrl, apiPath, token, groupId }) {
  yield put(actions.loading());
  try {
    const registers = yield call(api.fetchGroupBubbles, { apiUrl, apiPath, token, groupId });
    yield put(actions.setRegisters(registers));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loaded());
}

export function* bubblesSagas({ apiUrl, apiPath, token, groupId }) {
  while (true) {
    if (groupId) {
      const { newGroupId } = yield race({
        delay: call(delay, 10 * 1000),
        newGroupId: take(constants.SET_GROUP_ID),
      });

      if (newGroupId) {
        groupId = newGroupId.groupId;
        yield put(actions.setRegisters([]));
      }
    } else {
      const newGroupId = yield take(constants.SET_GROUP_ID);
      groupId = newGroupId.groupId;
    }

    yield fork(getGroupBubbles, { apiUrl, apiPath, token, groupId });
  }
}

export default function* () {
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
