
export const TIPO_INCORPORACION = {
        CON_OC:'CON_OC', SIN_OC:'SIN_OC', AF_EXISTENTE:'AF_EXISTENTE'
    };

export enum MetodoDepreciacion {
    SL = "SL",
    DB = "DB",
}

export interface Activo{

}

export interface OrdenCompraActivo{

}


export interface IncorporacionActivoDta {
    tipoIncorporacion?: 'CON_OC' | 'SIN_OC' | 'AF_EXISTENTE';

}
