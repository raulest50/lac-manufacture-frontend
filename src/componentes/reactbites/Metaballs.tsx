import React from 'react';
import './Metaballs.css';

export default function Metaballs() {
  return (
    <div className="metaballs-container">
      <div className="metaball" style={{ left: '10%', top: '20%' }} />
      <div className="metaball" style={{ left: '60%', top: '40%' }} />
      <div className="metaball" style={{ left: '30%', top: '70%' }} />
    </div>
  );
}
