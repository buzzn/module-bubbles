import React from 'react';

export default ({ registers, loading, Bubbles }) => (
  <div className="col-sm-12 col-md-6 col-lg-6 bubbles-wrapper">
    <div className="row">
      <div className="col-sm-12 col-md-12 col-lg-12">
        <div className="panel" style={{ position: 'relative' }}>
          <div style={{ width: '100%', height: '453px', display: 'inline-block', position: 'relative' }}>
            <Bubbles registers={ registers } />
          </div>
          {/*<div className="basic-loading" style={{*/}
            {/*width: '100%',*/}
            {/*height: '100%',*/}
            {/*display: 'inline-block',*/}
            {/*position: 'absolute',*/}
            {/*left: 0,*/}
            {/*top: 0,*/}
            {/*zIndex: loading ? 10 : -10,*/}
            {/*background: 'rgba(255, 255, 255, 0.7)',*/}
          {/*}}>*/}
            {/*<div style={{ color: 'grey', fontSize: '28px', fontWeight: 'bolder', marginLeft: '40%', marginTop: '35%' }}>*/}
              {/*Loading...*/}
            {/*</div>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  </div>
);
