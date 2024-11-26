
// src/models/types.ts

export interface Producto {
    productoId: number;
    nombre: string;
    tipo_producto: string; // 'T' or 'S'
    // Other fields...
}

export interface ProductoStockDTO {
    producto: Producto;
    stock: number;
}

export interface InsumoWithStock {
    insumoId: number;
    productoId: number;
    productoNombre: string;
    cantidadRequerida: number;
    stockActual: number;
}

export interface ProductoWithInsumos {
    producto: Producto;
    insumos: InsumoWithStock[];
}

export interface OrdenSeguimientoDTO {
    seguimientoId: number;
    insumoNombre: string;
    cantidadRequerida: number;
    estado: number; // 0: pendiente, 1: finalizada
}

export interface OrdenProduccionDTO {
    ordenId: number;
    productoNombre: string;
    fechaInicio: string; // ISO date string
    estadoOrden: number; // 0: en produccion, 1: terminada
    responsableId: number;
    observaciones: string;
    ordenesSeguimiento: OrdenSeguimientoDTO[];
}