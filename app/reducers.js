import { constants } from './actions';

export default (state = { loading: false, summedData: {} }, action) => {
  switch (action.type) {
    case constants.SET_GROUP:
      return { ...state, group: action.group };
    case constants.SET_DATA:
      return { ...state, summedData: action.data };
    case constants.LOADING:
      return { ...state, loading: true };
    case constants.LOADED:
      return { ...state, loading: false };
    default:
      return state;
  }
};
