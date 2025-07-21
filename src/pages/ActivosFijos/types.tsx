
export const TIPO_INCORPORACION = {
        CON_OC:'CON_OC', SIN_OC:'SIN_OC', AF_EXISTENTE:'AF_EXISTENTE'
    };

export enum MetodoDepreciacion {
    SL = "SL",
    DB = "DB",
}

export interface ActivoFijo {
    // llave primaria
    id: string;

    nombre: string;

    /**
     * diferente de proveedor. ej:
     * un proveedor puede vender laptop Dell pero no es el fabricante
     */
    brand?: string;

    /**
     * URL a la ficha técnica del activo
     */
    url?: string;

    /**
     * 0: activo
     * 1: obsoleto
     * 2: dado de baja
     */
    estado: number;

    fechaCodificacion?: Date | string;

    fechaBaja?: Date | string;

    // Campos para integración contable
    valorAdquisicion?: number;
    valorResidual?: number;
    vidaUtilMeses?: number;
    metodoDespreciacion?: string; // "LINEAL", "SUMA_DIGITOS", etc.

    depreciaciones?: DepreciacionActivo[];

    traslados?: TrasladoActivo[];

    mantenimientos?: MantenimientoActivo[];

    lineaIncorporacion?: IncorporacionActivoLine;

    documentosBaja?: DocumentoBajaActivo[];
}

// Interfaces relacionadas que deberían definirse según sea necesario
interface DepreciacionActivo {
    // Propiedades según el modelo de backend
}

interface TrasladoActivo {
    // Propiedades según el modelo de backend
}

interface MantenimientoActivo {
    // Propiedades según el modelo de backend
}

interface IncorporacionActivoLine {
    // Propiedades según el modelo de backend
}

interface DocumentoBajaActivo {
    // Propiedades según el modelo de backend
}

export interface OrdenCompraActivo{

}


export interface IncorporacionActivoDta {
    tipoIncorporacion?: 'CON_OC' | 'SIN_OC' | 'AF_EXISTENTE';
    id_OC_AF ?: number;

}
