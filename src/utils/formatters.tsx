import { formatMoney } from 'accounting-js';

/**
 * Formatea un valor numérico como moneda COP
 * @param value - Valor numérico a formatear
 * @param precision - Número de decimales (por defecto 0 para pesos colombianos)
 * @returns Cadena formateada como moneda COP
 */
export const formatCOP = (value: number, precision: number = 0): string => {
  return formatMoney(value, {
    symbol: '$',
    precision: precision,
    thousand: '.',
    decimal: ',',
    format: '%s %v'
  });
};

/**
 * Formatea un valor numérico como moneda COP sin el símbolo de peso
 * @param value - Valor numérico a formatear
 * @param precision - Número de decimales (por defecto 0 para pesos colombianos)
 * @returns Cadena formateada como moneda COP sin símbolo
 */
export const formatCOPWithoutSymbol = (value: number, precision: number = 0): string => {
  return formatMoney(value, {
    symbol: '',
    precision: precision,
    thousand: '.',
    decimal: ',',
    format: '%v'
  });
};