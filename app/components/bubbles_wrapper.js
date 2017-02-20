import React from 'react';
import { connect } from 'react-redux';
import BubblesLayout from './bubbles_layout';
import Bubbles from './bubbles';
import InfoPanel from './info_panel';
import { actions } from '../actions';

export const BubblesWrapper = props => (
  <props.Layout { ...props } Bubbles={ Bubbles } InfoPanel={ InfoPanel } />
);

BubblesWrapper.defaultProps = {
  Layout: BubblesLayout,
};

function mapStateToProps(state) {
  return {
    // TODO: replace with ownProps parameter
    url: state.config.apiUrl,
    // TODO: replace 'bubbles' with 'mountedPath' ownProps parameter or constant
    group: state.bubbles.group,
    summedData: state.bubbles.summedData,
    loading: state.bubbles.loading,
  };
}

const mappedActions = {
  setData: actions.setData,
  setLoading: actions.loading,
  setLoaded: actions.loaded,
};

export default connect(mapStateToProps, mappedActions)(BubblesWrapper);
