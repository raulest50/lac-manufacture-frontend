
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
    categoriaId?: number;      // Añadir esta propiedad
    categoriaNombre?: string;  // Añadir esta propiedad
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

export interface Categoria {
    categoriaId: number;
    categoriaNombre: string;
    categoriaDescripcion: string;
}

export interface Terminado extends Producto {
    insumos: Insumo[];
    procesoProduccion: ProcesoProduccion;
    categoria?: Categoria;
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
    tipo_producto: string;
    tipoUnidades?: string; // KG, L, U, etc.
    subInsumos?: InsumoWithStock[];
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
    fechaInicio: string | null; // ISO date string or null when unavailable
    fechaLanzamiento: string | null;
    fechaFinalPlanificada: string | null;
    estadoOrden: number; // 0: en produccion, 1: terminada
    cantidadAProducir: number | null;
    numeroPedidoComercial: string | null;
    areaOperativa: string | null;
    departamentoOperativo: string | null;
    observaciones: string | null;
    ordenesSeguimiento: OrdenSeguimientoDTO[];
}
