import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { BubblesWrapper } from '../../components/bubbles_wrapper';
import { Bubbles } from '../../components/bubbles';
import InfoPanel from '../../components/info_panel';

describe('bubbles wrapper', () => {
  const props = {
    group: 'groupId',
    url: 'groupUrl',
    summedData: { in: 10, out: 10 },
    loading: false,
    setData() {},
    setLoading() {},
    setLoaded() {},
  };

  it('should render 2 InfoPanels', () => {
    const wrapper = shallow(<BubblesWrapper { ...props } />);
    expect(wrapper.find(InfoPanel)).to.have.length(2);
  });

  it('should render bubbles if there is a groupId', () => {
    const wrapper = shallow(<BubblesWrapper { ...props } />);
    expect(wrapper.find(Bubbles)).to.have.length(1);
    wrapper.setProps({ group: null });
    expect(wrapper.find(Bubbles)).to.have.length(0);
  });

  it('should render loading on top of bubbles in case of loading prop', () => {
    const wrapper = shallow(<BubblesWrapper { ...props } />);
    expect(wrapper.find('.basic-loading').html()).to.have.string('z-index:-10');
    wrapper.setProps({ loading: true });
    expect(wrapper.find('.basic-loading').html()).to.have.string('z-index:10');
  });
});
