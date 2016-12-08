import { expect } from 'chai';
import reducers from '../reducers';
import { constants } from '../actions';

describe('bubbles reducers', () => {
  const initialState = { loading: false, summedData: {} };

  it('should return the initial state', () => {
    expect(reducers(undefined, {})).to.eql(initialState);
  });

  it('should handle SET_GROUP', () => {
    const group = 'group';
    const action = { type: constants.SET_GROUP, group };
    expect(reducers(undefined, action)).to.eql({ ...initialState, group });
  });

  it('should handle SET_DATA', () => {
    const data = 'data';
    const action = { type: constants.SET_DATA, data };
    expect(reducers(undefined, action)).to.eql({ ...initialState, summedData: data });
  });

  it('should handle LOADING', () => {
    const action = { type: constants.LOADING };
    expect(reducers(undefined, action)).to.eql({ ...initialState, loading: true });
  });

  it('should handle LOADED', () => {
    const action = { type: constants.LOADED };
    expect(reducers(undefined, action)).to.eql({ ...initialState, loading: false });
  });
});
