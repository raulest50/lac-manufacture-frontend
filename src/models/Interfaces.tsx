
/*
Interfaces para el modulo de Productos
*/
export interface MateriaPrima {
    referencia: number;
    descripcion: string;
    costo: number;
    cantidad: number;
    tipoUnidades: string | null;
    contenidoPorUnidad: number;
    fechaCreacion: string;
    observaciones: string | null;
}