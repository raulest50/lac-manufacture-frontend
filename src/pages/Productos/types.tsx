
export const TIPOS_PRODUCTOS = {materiaPrima: "M", semiTerminado:"S", terminado:"T"};
export const UNIDADES = {L:"L", KG:"KG", U:"U"};

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
 * para uso principalmente en step 2 creacion de semiterminado o temrinado
 */
export interface Producto{
    productoId: number;
    tipo_producto: string;
    nombre: string;
    observaciones: string;
    costo: number;
    tipoUnidades: string;
    cantidadUnidad: string;
    fechaCreacion: string;
}


export interface Insumo {
    cantidadRequerida: number;
    producto: Producto;
    subtotal?: number; // this is not part of the model at backend, but useful for frontend
}


/**
 * para usar exclusivamente en la bandeja de seleccion de insumos.
 */
export interface Semiterminado {
    productoId: string;
    nombre: string;
    observaciones: string;
    costo: string;
    tipoUnidades: string;
    cantidadUnidad: string;
    tipo_producto: string;
    insumos: Insumo[]
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
    productoId: string;
    nombre: string;
    observaciones: string;
    costo?: string; // se determina a al momento de seleccinoar los insumos - step 2
    insumos?: Insumo[]; // se determina tambien en - step 2
    tipoUnidades: string;
    cantidadUnidad: string;
    tipo_producto: string;
    procesoProduccion?: ProcesoProduccion; // se determina a la hora de definir el proceso - step 3
}