import React from 'react';
import { connect } from 'react-redux';
import reduce from 'lodash/reduce';
import BubblesLayout from './bubbles_layout';
import Bubbles from './bubbles';
import InfoPanel from './info_panel';

export const BubblesWrapper = props => (
  <props.Layout { ...props } Bubbles={ Bubbles } InfoPanel={ InfoPanel } />
);

BubblesWrapper.defaultProps = {
  Layout: BubblesLayout,
};

function mapStateToProps(state) {
  function sumPower({ direction, registers }) {
    const power = reduce(registers, (res, reg) => (reg.mode === direction ? res + reg.value : res), 0);
    const powerArr = power.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').split(',');
    powerArr.pop();
    return powerArr.join('.');
  }

  return {
    registers: state.bubbles.registers,
    loading: state.bubbles.loading,
    summedIn: sumPower({ direction: 'in', registers: state.bubbles.registers }),
    summedOut: sumPower({ direction: 'out', registers: state.bubbles.registers }),
  };
}

export default connect(mapStateToProps)(BubblesWrapper);
