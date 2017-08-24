import { actions, constants } from '../actions';

describe('bubbles actions', () => {
  test('should create an action to set group id', () => {
    const groupId = 'group';
    const expectedAction = { type: constants.SET_GROUP_ID, groupId };
    expect(actions.setGroupId(groupId)).toEqual(expectedAction);
  });
});
