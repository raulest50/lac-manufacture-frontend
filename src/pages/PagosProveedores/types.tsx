// Types for PagosProveedores module

// Enum for payment status
export enum EstadoPago {
  PENDIENTE = 'PENDIENTE',
  PROCESANDO = 'PROCESANDO',
  COMPLETADO = 'COMPLETADO',
  RECHAZADO = 'RECHAZADO'
}

// Enum for payment methods
export enum MetodoPago {
  TRANSFERENCIA = 'TRANSFERENCIA',
  CHEQUE = 'CHEQUE',
  EFECTIVO = 'EFECTIVO',
  TARJETA = 'TARJETA'
}

// Interface for payment
export interface Pago {
  id?: number;
  fecha: string;
  monto: number;
  estado: EstadoPago;
  metodo: MetodoPago;
  referencia: string;
  descripcion: string;
  documentoRelacionado?: string;
  proveedorId: number; // ID del proveedor al que se realiza el pago
  ordenCompraId?: number; // ID de la orden de compra relacionada (opcional)
}

// Interface for payment filter
export interface FiltrosPago {
  fechaDesde?: string;
  fechaHasta?: string;
  estado?: EstadoPago;
  proveedorId?: number;
  metodo?: MetodoPago;
}