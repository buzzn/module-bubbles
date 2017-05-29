import React from 'react';

export default ({ type, data }) => (
  <div>
    { type === 'in' ? 'Gesamtverbrauch ' : 'Gesamtproduktion ' }
    <span style={{ fontWeight: 'bold' }}>{ data ? `${data} kWh` : 'n.a.' }</span>
  </div>
);
