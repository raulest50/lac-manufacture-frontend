import { formatMoney } from 'accounting-js';
import { DIVISAS } from '../pages/Compras/types';

/**
 * Formatea un valor numérico según la divisa indicada
 * @param value - Valor numérico a formatear
 * @param currency - Divisa a utilizar
 * @param precision - Número de decimales (por defecto 0)
 * @returns Cadena formateada como moneda
 */
export const formatCurrency = (
  value: number,
  currency: DIVISAS,
  precision = 0
): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  }).format(value);
};

/**
 * Formatea un valor numérico como moneda COP
 * @param value - Valor numérico a formatear
 * @param precision - Número de decimales (por defecto 0 para pesos colombianos)
 * @returns Cadena formateada como moneda COP
 */
export const formatCOP = (value: number, precision: number = 0): string => {
  return formatCurrency(value, DIVISAS.COP, precision);
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