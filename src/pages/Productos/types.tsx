


/**
 * interfaces para la codificacion de materias primas
 */


export interface MateriaPrima {
    productoId?: string;
    nombre: string;
    observaciones: string;
    costo: string;
    tipoUnidades: string;
    cantidadUnidad: string;
    tipo_producto: string;
}





/**
 * Interfaces usadas principalmente aunque no necesariamente de manera exclusiva
 * en el feuture de ProcesDesigner
 */

export interface Node{
    Id: number;
    type: string;
    localId: string;
    label: string;
    x: number;
    y: number;
}

export interface ProcesoNode extends Node {
    unidadesTiempo?: number;
    tiempo?: string;
    nombreProceso?: string;
    instrucciones?: string;
    descripcionSalida: string;
}

export interface ProcesoProduccion{
    procesoId: number;
    procesoNodes: ProcesoNode[];
    materiaPrimaNodes: Node[];
    targetNode: Node;
}


export interface ProductoSemiter {
    productoId?: string;
    nombre: string;
    observaciones: string;
    costo: string;
    tipoUnidades: string;
    cantidadUnidad: string;
    tipo_producto: string;
    procesoProduccion: ProcesoProduccion;
}