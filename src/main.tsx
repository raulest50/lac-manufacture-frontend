import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import {ChakraProvider} from "@chakra-ui/react";

import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  sizes: {
    container: {
      "2xl": "1440px",
      "3xl": "1920px", // Define your custom size here
    },
  },
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  
    <React.StrictMode>
      <ChakraProvider theme={theme}>      
        <App />
      </ChakraProvider>
    </React.StrictMode>
  ,
)
