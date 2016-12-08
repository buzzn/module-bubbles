import { expect } from 'chai';
import { actions, constants } from '../actions';

describe('bubbles actions', () => {
  it('should create an action to set group', () => {
    const group = 'group';
    const expectedAction = { type: constants.SET_GROUP, group };
    expect(actions.setGroup(group)).to.eql(expectedAction);
  });

  it('should create action to set data', () => {
    const data = 'data';
    const expectedAction = { type: constants.SET_DATA, data };
    expect(actions.setData(data)).to.eql(expectedAction);
  });

  it('should create action to set loading state', () => {
    expect(actions.loading()).to.eql({ type: constants.LOADING });
  });

  it('should create action to set loaded state', () => {
    expect(actions.loaded()).to.eql({ type: constants.LOADED });
  });
});
