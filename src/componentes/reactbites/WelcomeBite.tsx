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
      if (index < text.length) {
        setDisplay(prev => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <Text fontSize="lg" fontWeight="bold" fontFamily="Arimo">{display}</Text>;
}
