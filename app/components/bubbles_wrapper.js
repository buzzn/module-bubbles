import React from 'react';
import { connect } from 'react-redux';
import reduce from 'lodash/reduce';
import BubblesLayout from './bubbles_layout';
import Bubbles from './bubbles';

export const BubblesWrapper = props => (
  <props.Layout { ...props } Bubbles={ Bubbles } />
);

BubblesWrapper.defaultProps = {
  Layout: BubblesLayout,
};

function mapStateToProps(state) {
  return {
    registers: state.bubbles.registers.array,
    loading: state.bubbles.loading,
  };
}

export default connect(mapStateToProps)(BubblesWrapper);
