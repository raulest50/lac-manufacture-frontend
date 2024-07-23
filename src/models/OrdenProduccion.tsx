

import { OrdenSeguimiento } from './OrdenSeguimiento';

export type OrdenProduccion = {
    ordenId?: number;
    terminadoId: number;
    seccionResponsable: number;
    ordenesSeguimiento: OrdenSeguimiento[];
    estadoOrden: number;
    observaciones: string;
    fechaInicio?: string;
    fechaFinal?: string;
};

