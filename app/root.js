import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions, constants } from './actions';
import BubblesWrapper from './components/bubbles_wrapper';

class Root extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: constants.SET_API_PARAMS, apiUrl: 'http://localhost:3000', apiPath: '/api/display/groups' });
    dispatch({ type: constants.SET_TOKEN, token: 'token' });
    dispatch({ type: constants.SET_GROUP_ID, groupId: ['1'] });
  }

  render() {
    return (
      <div>
        <BubblesWrapper/>
      </div>
    );
  }
}

export default connect()(Root);
