import React from 'react';
import { HeaderHexEf } from './HeaderHexEf';
import { BrowserRouter } from 'react-router-dom';

// Default story
export const Default = () => {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: '800px', padding: '20px' }}>
        <HeaderHexEf title="Example Title" />
      </div>
    </BrowserRouter>
  );
};

// Story with a longer title
export const LongTitle = () => {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: '800px', padding: '20px' }}>
        <HeaderHexEf title="This is a much longer title to demonstrate how the component handles longer text" />
      </div>
    </BrowserRouter>
  );
};