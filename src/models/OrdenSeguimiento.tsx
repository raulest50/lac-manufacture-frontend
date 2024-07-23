

import { Insumo } from './Insumo';

export type OrdenSeguimiento = {
    seguimientoId?: number;
    insumo: Insumo;
    seccionResponsable: number;
    estado: number;
    observaciones: string;
    fechaInicio?: string;
    fechaFinal?: string;
};