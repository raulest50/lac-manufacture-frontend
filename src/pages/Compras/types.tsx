// src/models/types.ts

export interface Proveedor {
    id: number;
    nombre: string;
    // Add other fields as needed
}

export interface MiItem {
    productoId: number;
    tipo_producto: string;
    nombre: string;
    observaciones: string;
    costo: number;
    tipoUnidades: string;
    cantidadUnidad: string;
    fechaCreacion: string;
    cantidadRequerida?: string; // Optional, since it might not be present
}

export interface ItemCompra {
    materiaPrima: MiItem;
    cantidad: string; // Using string to match the input field value
    precioCompra: string; // Using string to match the input field value
}

export interface Compra {
    proveedor: Proveedor;
    estado: number;
    itemsCompra: {
        materiaPrima: {
            productoId: number;
            tipo_producto: string;
        };
        cantidad: number;
        precioCompra: number;
    }[];
}
