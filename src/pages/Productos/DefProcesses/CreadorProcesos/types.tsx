
// Path: src/pages/Productos/DefProcesses/CreadorProcesos/types.tsx
// Used in: (sin referencias actuales)
// Summary: Tipos para nodos de procesos productivos diseñados en el creador de procesos.

export interface ProcesoNodeData {
    label: string;
    tiempo?: string;
    instrucciones?: string;
    nombreProceso?: string;
    unidadesTiempo?: string;
    procesoId?: number; // Agregar el ID del proceso seleccionado
    [key: string]: unknown;
}
