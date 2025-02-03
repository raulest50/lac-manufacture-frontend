// ./types.tsx
export interface Proveedor {
    id: number;
    nombre: string;
    direccion: string;
    ciudad: string;
    departamento: string;
    nombreContacto: string;
    telefono: string;
    email: string;
    url: string;
    observacion: string;
    fechaRegistro: string;
}

export interface MateriaPrima {
    productoId: number;
    tipo_producto: string;
    nombre: string;
    costo: number;
    // add other properties if needed
}

export interface ItemOrdenCompra {
    // The selected MateriaPrima is wrapped here.
    materiaPrima: MateriaPrima;
    cantidad: number;
    precioUnitario: number;
    iva19: number;
    subTotal: number;
    /**
     * 0: aún por revisar
     * 1: si concuerda
     * -1: no concuerda
     */
    cantidadCorrecta: number;
    /**
     * 0: aún por revisar
     * 1: si concuerda
     * -1: no concuerda
     */
    precioCorrecto: number;
}

export interface OrdenCompra {
    // The backend generates this id
    ordenCompraId?: number;
    fechaEmision?: string;
    fechaVencimiento?: string;
    proveedor: Proveedor;
    itemsOrdenCompra: ItemOrdenCompra[];
    subTotal: number;
    iva19: number;
    totalPagar: number;
    condicionPago: string;
    tiempoEntrega: string;
    plazo_pago: number;
    /**
     * -1: cancelada
     *  0: pendiente aprobación proveedor
     *  1: pendiente revisión precio
     *  2: pendiente conteo
     *  3: cerrada con éxito
     */
    estado: number;
}
