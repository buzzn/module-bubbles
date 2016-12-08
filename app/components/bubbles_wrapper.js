import React from 'react';
import { connect } from 'react-redux';
import Bubbles from './bubbles';
import InfoPanel from './info_panel';
import { actions } from '../actions';

export const BubblesWrapper = ({ group, url, summedData, loading, setData, setLoading, setLoaded }) => (
  <div className="col-sm-12 col-md-6 col-lg-6 bubbles-wrapper">
    <div className="row">
      <InfoPanel type="in" data={ summedData.in } />
      <InfoPanel type="out" data={ summedData.out } />
      <div className="col-sm-12 col-md-12 col-lg-12">
        <div className="panel" style={{ position: 'relative' }}>
          <div style={{ width: '100%', height: '453px', display: 'inline-block', position: 'relative' }}>
            { !!group &&
              <Bubbles
                key={ group }
                url={ url }
                group={ group }
                setData={ setData }
                setLoading={ setLoading }
                setLoaded={ setLoaded } />
            }
          </div>
          <div className="basic-loading" style={{
            width: '100%',
            height: '100%',
            display: 'inline-block',
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: loading ? 10 : -10,
            background: 'rgba(255, 255, 255, 0.7)',
          }}>
            <div style={{ color: 'grey', fontSize: '28px', fontWeight: 'bolder', marginLeft: '40%', marginTop: '35%' }}>
              Loading...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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
