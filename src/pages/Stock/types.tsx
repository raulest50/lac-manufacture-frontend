// Path: src/pages/Stock/types.tsx
// Used in: src/pages/Stock/ListaProductos.tsx; src/pages/Stock/Inventario.tsx
// Summary: Tipos básicos de producto y stock para inventarios y listados de almacén.

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

