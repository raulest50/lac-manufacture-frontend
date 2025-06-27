// Types for Contabilidad module

// Enum for account types
export enum TipoCuenta {
  ACTIVO = 'ACTIVO',
  PASIVO = 'PASIVO',
  PATRIMONIO = 'PATRIMONIO',
  INGRESO = 'INGRESO',
  GASTO = 'GASTO'
}

// Enum for normal balance
export enum SaldoNormal {
  DEBITO = 'DEBITO',
  CREDITO = 'CREDITO'
}

// Interface for Chart of Accounts
export interface CuentaContable {
  codigo: string;
  nombre: string;
  tipo: TipoCuenta;
  saldoNormal: SaldoNormal;
  cuentaControl: boolean;
}

// Enum for journal entry status
export enum EstadoAsiento {
  BORRADOR = 'BORRADOR',
  PUBLICADO = 'PUBLICADO',
  REVERSADO = 'REVERSADO'
}

// Interface for journal entry line
export interface LineaAsientoContable {
  id?: number;
  cuentaCodigo: string;
  debito: number;
  credito: number;
  descripcion: string;
}

// Enum for accounting period status
export enum EstadoPeriodo {
  ABIERTO = 'ABIERTO',
  CERRADO = 'CERRADO'
}

// Interface for accounting period
export interface PeriodoContable {
  id?: number;
  fechaInicio: string;
  fechaFin: string;
  nombre: string;
  estado: EstadoPeriodo;
}

// Interface for journal entry
export interface AsientoContable {
  id?: number;
  fecha: string;
  descripcion: string;
  modulo: string;
  documentoOrigen: string;
  estado: EstadoAsiento;
  periodoContable: PeriodoContable;
  lineas: LineaAsientoContable[];
}

// Interface for account balance
export interface SaldoCuenta {
  cuenta: CuentaContable;
  saldoDebito: number;
  saldoCredito: number;
  saldoNeto: number;
}

// Interface for general ledger entry
export interface MovimientoLibroMayor {
  fecha: string;
  numeroAsiento: number;
  descripcion: string;
  debito: number;
  credito: number;
  saldoAcumulado: number;
}