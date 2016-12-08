export const constants = {
  BUZZN_STORAGE_PREFIX: 'buzznKioskDemo',
  SET_GROUP: 'buzzn_bubbles/SET_GROUP',
  SET_DATA: 'buzzn_bubbles/SET_DATA',
  LOADING: 'buzzn_bubbles/LOADING',
  LOADED: 'buzzn_bubbles/LOADED',
};

export const actions = {
  setGroup: group => ({ type: constants.SET_GROUP, group }),
  setData: data => ({ type: constants.SET_DATA, data }),
  loading: () => ({ type: constants.LOADING }),
  loaded: () => ({ type: constants.LOADED }),
};
