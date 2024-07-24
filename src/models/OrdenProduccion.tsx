

import { OrdenSeguimiento } from './OrdenSeguimiento';
import { Terminado } from "./Terminado.tsx";

export type OrdenProduccion = {
    ordenId?: number;
    terminado: Terminado;
    seccionResponsable: number;
    ordenesSeguimiento: OrdenSeguimiento[];
    estadoOrden: number;
    observaciones: string;
    fechaInicio: string;
    fechaFinal?: string;
};

