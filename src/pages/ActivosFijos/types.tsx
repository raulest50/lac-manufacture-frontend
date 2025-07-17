

export enum MetodoDepreciacion {
    SL = "SL",
    DB = "DB",
}

export interface Activo{

}

export interface OrdenCompraActivo{

}


export interface IncorporacionActivoHeader{
    tipoIncorporacion?: 'CON_OC' | 'SIN_OC' | 'AF_EXISTENTE';
}
