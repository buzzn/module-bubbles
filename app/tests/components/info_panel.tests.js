import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import InfoPanel from '../../components/info_panel';

describe('bubbles InfoPanel', () => {
  it('should render proper icon class and text', () => {
    const wrapper = shallow(<InfoPanel type="in" />);
    expect(wrapper.find('span.panel-primary')).to.have.length(1);
    expect(wrapper.contains(<p>Aktueller Gesamtbezug (Watt)</p>)).to.be.true;
    wrapper.setProps({ type: 'out' });
    expect(wrapper.find('span.panel-danger')).to.have.length(1);
    expect(wrapper.contains(<p>Aktuelle Gesamterzeugung (Watt)</p>)).to.be.true;
  });

  it('should show power data or n.a.', () => {
    const wrapper = shallow(<InfoPanel />);
    expect(wrapper.contains(<div className="power-ticker">n.a.</div>)).to.be.true;
    wrapper.setProps({ data: 10 });
    expect(wrapper.contains(<div className="power-ticker">{10}</div>)).to.be.true;
  });
});
