
// src/models/types.ts

export interface Producto {
    productoId: number;
    nombre: string;
    tipo_producto: string; // 'T' or 'S'
    // Other fields...
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
