// ./types.tsx
export interface Proveedor {
    id: number;
    nombre: string;
    direccion: string;
    regimenTributario: number;
    ciudad: string;
    departamento: string;
    nombreContacto: string;
    telefono: string;
    email: string;
    url: string;
    observacion: string;
    fechaRegistro: string;
}

export function getRegimenTributario(regimen: number) {
    if(regimen == 0) return "Regimen Comun";
    if(regimen == 0) return "Regimen Simplificado";
    if(regimen == 0) return "Regimen Especial";
}

export function getEstadoText(estado: number){
    if(estado == -1) return "Cancelada";
    if(estado == 0) return "Pendiente confirmacion proveedor";
    if(estado == 1) return "Pendiente recepcion y verificacion precios";
    if(estado == 2) return "Pendiente recepcion y verificacion cantidades";
    if(estado == 3) return "Cerrada exitosamente";
}

export function getCondicionPagoText(condicion: string){
    if(condicion == "0") return "Credito";
    if(condicion == "1") return "Contado";
}

export function getCantidadCorrectaText(cantidadCorrecta: number){
    if(cantidadCorrecta == 0) return "Pendiente Revision";
    if(cantidadCorrecta == 1) return "Cantidad Correcta";
    if(cantidadCorrecta == -1) return "Cantidad Incorrecta";
}

export interface MateriaPrima {
    productoId: number;
    tipo_producto: string;
    nombre: string;
    costo: number;
    tipoUnidades: string;
    // add other properties if needed
}

export interface ItemOrdenCompra {
    itemOrdenId?: number;
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
    fechaVencimiento: string;
    facturaCompraId?: string;
    proveedor: Proveedor;
    itemsOrdenCompra: ItemOrdenCompra[];
    subTotal: number;
    iva19: number;
    totalPagar: number;
    condicionPago: string;
    tiempoEntrega: string;
    plazoPago: number;
    /**
     * -1: cancelada
     *  0: pendiente aprobación proveedor
     *  1: pendiente revisión precio
     *  2: pendiente conteo
     *  3: cerrada con éxito
     */
    estado: number;
}


export interface DocIngresoDTA{
    ordenCompra: OrdenCompra | null;
    user: string | undefined; // responsable del ingreso a almacen
    observaciones: string;
    file: File;
}


