
// src/models/types.ts

import {Node, ProcesoNode} from "../Productos/types.tsx";

export interface Producto{
    productoId: string;
    tipo_producto: string;
    nombre: string;
    observaciones?: string;
    costo: number;
    tipoUnidades: string;
    cantidadUnidad: string;
    fechaCreacion?: string;
    ivaPercentual?: number;
}

export interface Insumo {
    cantidadRequerida: number;
    producto: Producto;
    subtotal?: number; // this is not part of the model at backend, but useful for frontend
}

export interface ProcesoProduccion{
    procesoId: number;
    procesoNodes: ProcesoNode[];
    materiaPrimaNodes: Node[];
    targetNode: Node;
}

export interface Terminado extends Producto {
    insumos: Insumo[];
    procesoProduccion: ProcesoProduccion;
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