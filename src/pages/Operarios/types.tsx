

// Path: src/pages/Operarios/types.tsx
// Used in: src/pages/Operarios/OrdenProduccionCard.tsx; src/pages/Operarios/WorkLoad.tsx
// Summary: DTOs for órdenes de producción y seguimiento que se muestran en cards y cargas de trabajo.

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
    estadoOrden: number; // 0: en producción, 1: terminada
    responsableId: number;
    observaciones: string;
    ordenesSeguimiento: OrdenSeguimientoDTO[];
}


// Interface for paginated response
export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number; // Current page number
    size: number; // Page size
    // ... other fields if needed
}