// src/models/types.ts

export interface Producto {
    productoId: number;
    nombre: string;
    observaciones: string;
    costo: number;
    fechaCreacion: string;
    tipoUnidades: string;
    cantidadUnidad: number;
    tipo_producto: string; // 'M', 'S', or 'T'
}

export interface ProductStockDTO {
    producto: Producto;
    stock: number;
}

export interface Movimiento {
    movimientoId: number;
    cantidad: number;
    producto: Producto;
    causa: string;
    observaciones: string;
    fechaMovimiento: string;
}
