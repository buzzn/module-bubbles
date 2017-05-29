import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions, constants } from './actions';
import BubblesWrapper from './components/bubbles_wrapper';

class Root extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: constants.SET_API_PARAMS, apiUrl: 'http://localhost:3000', apiPath: '/api/v1' });
    dispatch({ type: constants.SET_TOKEN, token: 'token' });
    dispatch({ type: constants.SET_GROUP_ID, groupId: '095d3405-c442-488c-ac59-133c3eb8c77c' });
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
