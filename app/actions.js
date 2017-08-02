export const constants = {
  SET_API_PARAMS: 'buzzn_bubbles/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_bubbles/SET_TOKEN',
  SET_GROUP_ID: 'buzzn_bubbles/SET_GROUP_ID',
  STOP_REQUESTS: 'buzzn_bubbles/STOP_REQUESTS',
  SET_REGISTERS: 'buzzn_bubbles/SET_REGISTERS',
  LOADING: 'buzzn_bubbles/LOADING',
  LOADED: 'buzzn_bubbles/LOADED',
};

export const actions = {
  setApiParams: ({ apiUrl, apiPath }) => ({ type: constants.SET_API_PARAMS, apiUrl, apiPath }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),
  setGroupId: groupId => ({ type: constants.SET_GROUP_ID, groupId }),
  stopRequests: () => ({ type: constants.STOP_REQUESTS }),
  setRegisters: registers => ({ type: constants.SET_REGISTERS, registers }),
  loading: () => ({ type: constants.LOADING }),
  loaded: () => ({ type: constants.LOADED }),
};
