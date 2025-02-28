


export interface Insumo {
    cantidadRequerida: string;
    producto: {
        productoId: number;
        tipo_producto: string;
        nombre: string;
        observaciones: string;
        costo: number;
        tipoUnidades: string;
        cantidadUnidad: string;
        fechaCreacion: string;
    };
}

/**
 * para los componentes en esta carpeta, un Target
 * representa un Terminado o Semiterminado
 */
export interface Target{
    productoId: number;
    nombre: string;
    observaciones: string;
    costo: number;
    fechaCreacion: string;
    tipoUnidades: string;
    cantidadUnidad: number;
    insumos:Insumo[];
    tipo_producto: string;
}


export interface ProcesoNodeData {
    label: string;
    tiempo?: string;
    instrucciones?: string;
    nombreProceso?: string;
    unidadesTiempo?: string;
    [key: string]: unknown;
}