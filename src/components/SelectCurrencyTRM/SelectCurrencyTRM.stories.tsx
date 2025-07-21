// src/components/SelectCurrencyTRM/SelectCurrencyTRM.stories.tsx
import React, { useState } from 'react';
import { SelectCurrencyTrm } from './SelectCurrencyTRM';

// Función auxiliar para crear el estado que necesita el componente
const useCurrencyState = () => {
  const [isUSD, setIsUSD] = useState(true);
  return [isUSD, setIsUSD] as [boolean, React.Dispatch<React.SetStateAction<boolean>>];
};

// Historia por defecto
export const Default = () => {
  const currencyState = useCurrencyState();
  const [currentUsd2Cop, setCurrentUsd2Cop] = useState<number>(0);
  
  const handleUsd2CopChange = (value: number) => {
    setCurrentUsd2Cop(value);
    console.log('TRM actualizada:', value);
  };

  return (
    <div style={{ maxWidth: '500px', padding: '20px' }}>
      <h2>Selector de Moneda y TRM</h2>
      <SelectCurrencyTrm 
        currencyIsUSD={currencyState}
        useCurrentUsd2Cop={handleUsd2CopChange}
      />
      <div style={{ marginTop: '20px' }}>
        <p>Moneda actual: {currencyState[0] ? 'USD' : 'COP'}</p>
        <p>TRM actual: {currentUsd2Cop}</p>
      </div>
    </div>
  );
};

// Historia con valor inicial en COP
export const InitialCOP = () => {
  const [isUSD, setIsUSD] = useState(false);
  const currencyState = [isUSD, setIsUSD] as [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  const [currentUsd2Cop, setCurrentUsd2Cop] = useState<number>(4000);
  
  const handleUsd2CopChange = (value: number) => {
    setCurrentUsd2Cop(value);
    console.log('TRM actualizada:', value);
  };

  return (
    <div style={{ maxWidth: '500px', padding: '20px' }}>
      <h2>Selector de Moneda y TRM (Inicial: COP)</h2>
      <SelectCurrencyTrm 
        currencyIsUSD={currencyState}
        useCurrentUsd2Cop={handleUsd2CopChange}
      />
      <div style={{ marginTop: '20px' }}>
        <p>Moneda actual: {currencyState[0] ? 'USD' : 'COP'}</p>
        <p>TRM actual: {currentUsd2Cop}</p>
      </div>
    </div>
  );
};