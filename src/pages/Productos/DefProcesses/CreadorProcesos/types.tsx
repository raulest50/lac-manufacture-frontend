

export interface ProcesoNodeData {
    label: string;
    tiempo?: string;
    instrucciones?: string;
    nombreProceso?: string;
    unidadesTiempo?: string;
    procesoId?: number; // Agregar el ID del proceso seleccionado
    [key: string]: unknown;
}
