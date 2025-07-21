// .ladle/components.tsx
import { ChakraProvider } from '@chakra-ui/react';
import type { GlobalProvider } from '@ladle/react';

export const Provider: GlobalProvider = ({ children }) => {
  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  );
};