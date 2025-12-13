// Path: src/pages/Ventas/types.tsx
// Used in: (sin referencias actuales)
// Summary: Estructuras para entidades de ventas que pueden alimentar formularios y reportes comerciales.

export interface Venta {
    id: number;
    clienteId: number;
    clienteNombre: string;
    fecha: string; // ISO format
    total: number;
    estado: number; // 1: completada, 2: pendiente, 3: cancelada, etc.
    items: VentaItem[];
}

export interface VentaItem {
    id: number;
    ventaId: number;
    productoId: number;
    productoNombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface VentaFormData {
    clienteId: number;
    fecha: string;
    items: {
        productoId: number;
        cantidad: number;
        precioUnitario: number;
    }[];
}