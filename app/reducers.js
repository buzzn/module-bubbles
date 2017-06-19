import { constants } from './actions';

export default (state = { loading: false, registers: [] }, action) => {
  switch (action.type) {
    case constants.SET_GROUP_ID:
      return { ...state, groupId: action.groupId };
    case constants.SET_REGISTERS:
      return { ...state, registers: action.registers };
    case constants.LOADING:
      return { ...state, loading: true };
    case constants.LOADED:
      return { ...state, loading: false };
    default:
      return state;
  }
};
