import {Proveedor} from "../Compras/types.tsx";

export const TIPO_INCORPORACION = {
        CON_OC:'CON_OC', SIN_OC:'SIN_OC', AF_EXISTENTE:'AF_EXISTENTE'
    };

export enum MetodoDepreciacion {
    SL = "SL",
    DB = "DB",
}

export interface DepreciacionActivo{}
export interface MantenimientoActivo{}

export interface ActivoFijo {
    id: string;
    nombre: string; // nombre que se le desea asignar en el sistema
    brand?: string; // ejemplo dell, fluke, lenovo etc. puede ser el mismo o diferente del proveedor segun el caso
    url?: string; // ruta ficha tecnia, la establece el backend con el multiparfile adjunto.
    estado: number; // 0:activo, 1:obsoleto, 2:dado de baja

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

interface TrasladoActivo {
    // Propiedades según el modelo de backend
}

interface IncorporacionActivoLine {
    // Propiedades según el modelo de backend
}

interface DocumentoBajaActivo {
    // Propiedades según el modelo de backend
}


export interface IncorporacionActivoDta {
    tipoIncorporacion?: 'CON_OC' | 'SIN_OC' | 'AF_EXISTENTE';
    id_OC_AF ?: number;

}


 export interface ItemOrdenCompraActivo {
    itemOrdenId?: number;
    ordenCompraActivoId?: number;
    nombre: string;
    cantidad: number;
    precioUnitario: number ;
    iva: number;
    subTotal: number;
}

export type DIVISAS = 'USD' | 'COP'; // Add other currencies as needed

export interface OrdenCompraActivo {
    ordenCompraActivoId?: number;
    fechaEmision: Date;
    fechaVencimiento: Date;
    proveedor: Proveedor;
    subTotal: number;
    iva: number;
    totalPagar: number;
    condicionPago: string; // 0:credito, 1:contado
    tiempoEntrega: string;
    plazoPago: number;
    cotizacionUrl?: string; // la asigna el backend cuando se adjunta la cotizacion en pdf (multipartfile)
    /**
     * -1: cancelada
     *  0: pendiente liberacion
     *  1: pendiente envio
     *  2: pendiente recepcion
     *  3: cerrada con éxito
     */
    estado: number;
    divisa: DIVISAS;
    trm: number;
    facturaCompraActivoId?: number;
    itemsOrdenCompra: ItemOrdenCompraActivo[];
}
