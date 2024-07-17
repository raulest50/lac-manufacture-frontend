

import { OrdenSeguimiento } from './OrdenSeguimiento';

export type OrdenProduccion = {
    orden_id: number;
    terminado_id: number;
    seccion_responsable: number;
    ordenesSeguimiento: OrdenSeguimiento[];
    estado_orden: number;
    observaciones: string;
    fechaInicio: string;
    fechaFinal: string;
};

