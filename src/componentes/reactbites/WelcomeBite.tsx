import React, { useEffect, useState } from 'react';
import { Text } from '@chakra-ui/react';

interface WelcomeBiteProps {
  text: string;
  speed?: number; // milliseconds per character
}

export default function WelcomeBite({ text, speed = 80 }: WelcomeBiteProps) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplay(prev => prev + text[index]);
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <Text fontSize="lg" fontWeight="bold">{display}</Text>;
}
