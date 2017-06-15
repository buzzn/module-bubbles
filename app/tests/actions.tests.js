import { expect } from 'chai';
import { actions, constants } from '../actions';

describe('bubbles actions', () => {
  it('should create an action to set group id', () => {
    const groupId = 'group';
    const expectedAction = { type: constants.SET_GROUP_ID, groupId };
    expect(actions.setGroupId(groupId)).to.eql(expectedAction);
  });
});
