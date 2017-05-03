export const constants = {
  SET_API_PARAMS: 'buzzn_bubbles/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_bubbles/SET_TOKEN',
  SET_GROUP_ID: 'buzzn_bubbles/SET_GROUP_ID',
  SET_REGISTERS: 'buzzn_bubbles/SET_REGISTERS',
  LOADING: 'buzzn_bubbles/LOADING',
  LOADED: 'buzzn_bubbles/LOADED',
};

export const actions = {
  setGroupId: groupId => ({ type: constants.SET_GROUP_ID, groupId }),
  setRegisters: registers => ({ type: constants.SET_REGISTERS, registers }),
  loading: () => ({ type: constants.LOADING }),
  loaded: () => ({ type: constants.LOADED }),
};
