"use strict";

var _actions = require("../actions");

describe('bubbles actions', function () {
  test('should create an action to set group id', function () {
    var groupId = 'group';
    var expectedAction = {
      type: _actions.constants.SET_GROUP_ID,
      groupId: groupId
    };
    expect(_actions.actions.setGroupId(groupId)).toEqual(expectedAction);
  });
});