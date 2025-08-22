import React from 'react';
import SplitText from './SplitText.tsx';

export const Characters = () => {
  return <SplitText text="Animate by characters" />;
};

export const Words = () => {
  return <SplitText text="Animate by words example" type="words" delay={0.2} />;
};
