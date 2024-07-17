

import { Insumo } from './Insumo';

export type OrdenSeguimiento = {
    seguimiento_id: number;
    insumo: Insumo;
    seccion_responsable: number;
    estado: number;
    observaciones: string;
    fechaInicio: string;
    fechaFinal: string;
};