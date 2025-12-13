// Path: src/pages/TransaccionesAlmacen/types.tsx
// Used in: src/pages/TransaccionesAlmacen/AsistenteDispensacion/*; src/pages/TransaccionesAlmacen/AsistenteDispensacionDirecta/*; src/pages/TransaccionesAlmacen/AsistenteIngresoOCM/*; src/pages/TransaccionesAlmacen/AjustesInventario/*; src/pages/TransaccionesAlmacen/AsistenteBackflushDirecto/*; src/pages/TransaccionesAlmacen/components/MateriaPrimaPicker.tsx; src/pages/TransaccionesAlmacen/AsistenteBackflushDirecto/TerminadoPicker.tsx
// Summary: Tipos para dispensaciones, ingresos, ajustes de inventario y movimientos de almacén.
// RecibirMercancia/types.tsx
import {Contacto} from "../Proveedores/types";

export interface Proveedor {
    id: string;
    tipoIdentificacion: number;
    nombre: string;
    direccion?: string;
    regimenTributario: number;
    ciudad?: string;
    departamento?: string;
    contactos: Contacto[];
    url?: string;
    observacion?: string;
    categorias:number[];
    condicionPago: string;
    rutFile?: File;         // Optional file for RUT
    camaraFile?: File;      // Optional file for Cámara y Comercio
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

export interface Producto{
    productoId: number;
    nombre: string;
    observaciones: string;
    costo: number;
    ivaPercentual: number;
    fechaCreacion?: string;
    tipoUnidades: string;
    cantidadUnidad: string;
    tipo_producto: string;
}

export interface Material extends Producto{
    fichaTecnicaUrl?: string;
    tipoMaterial?: number; // 1: materia prima, 2: material de empaque
}

export interface ItemOrdenCompra {
    itemOrdenId?: number;
    // The selected MateriaPrima is wrapped here.
    material: Material;
    cantidad: number;
    precioUnitario: number;
    ivaCOP: number;
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
    ivaCOP: number;
    totalPagar: number;
    condicionPago: string;
    tiempoEntrega: string;
    plazoPago: number;
    /**
     * -1: cancelada
     *  0: pendiente liberacion
     *  1: pendiente envio a proveedor
     *  2: pendiente recepcion en almacen
     *  3: cerrada con éxito
     */
    estado: number;
}


export interface Lote{
    id?: number;
    batchNumber?: string;
    productionDate?: string;
    expirationDate: string;
}

export enum TipoMovimiento{
    COMPRA = "COMPRA",
    BAJA = "BAJA",
    CONSUMO = "CONSUMO",
    BACKFLUSH = "BACKFLUSH",
    VENTA = "VENTA",
    PERDIDA = "PERDIDA"
}

export enum Almacen {
    GENERAL = "GENERAL", // donde se reciben compras, se dispensa material, se ingresa backflush
    PERDIDAS = "PERDIDAS", // scrap de OP's y perdidas de material por eventos fortuitos
    CALIDAD = "CANTIDAD", // producto para control de calidad
    DEVOLUCIONES = "DEVOLUCIONES" // terminados devuelto por clientes o materiales para devolverle a proveedor
}

export interface Movimiento{
    movimientoId?: number;
    cantidad: number;
    producto: Producto
    tipoMovimiento: TipoMovimiento;
    almacen: Almacen;
    lote: Lote;
    fechaMovimiento: string;
}

export enum TipoEntidadCausante{
    OCM = "OCM", // orden de compra de materiales
    OP = "OP", // orden de produccion
    OTA = "OTA", // orden de tranferencia de almacen
    OAA = "OAA", // orden de ajuste de almacen
}

export interface TransaccionAlmacen{
    transaccionId?: number;
    movimientosTransaccion: Movimiento[];
    fechaTransaccion?: string;
    urlDocSoporte: string;
    tipoEntidadCausante: TipoEntidadCausante;
    idEntidadCausante: string;
    observaciones: string;
}

export interface IngresoOCM_DTA{
    transaccionAlmacen: TransaccionAlmacen;
    ordenCompraMateriales: OrdenCompra;
    userId: string | undefined; // responsable del ingreso a almacen
    observaciones: string;
    file: File;
}

// ===== Dispensación de Materiales =====

export interface LoteDispensacion {
    loteId: number;
    batchNumber: string;
    cantidadDisponible: number;
}

export interface DispensacionFormularioItemDTO {
    seguimientoId: number;
    producto: Producto;
    cantidadSolicitada: number;
}

export interface DispensacionFormularioLoteDTO {
    seguimientoId: number;
    loteId: number;
    batchNumber: string;
    cantidadDisponible: number;
    cantidadSugerida: number;
}

export interface DispensacionFormularioDTO {
    ordenProduccionId: number;
    dispensaciones: DispensacionFormularioItemDTO[];
    lotesRecomendados: DispensacionFormularioLoteDTO[];
}

export interface ItemDispensacionDTO {
    seguimientoId: number;
    producto: Producto;
    lote: LoteDispensacion;
    /** Cantidad sugerida por el backend */
    cantidadSugerida: number;
    /** Cantidad que se va a dispensar (editable por el usuario) */
    cantidad: number;
}

export interface DispensacionDTO {
    ordenProduccionId: number;
    items: ItemDispensacionDTO[];
}

// ===== Dispensación No Planificada =====

/** Item básico solicitado por el usuario para la dispensación directa */
export interface DispensacionDirectaItem {
    material: Material;
    cantidad: number;
}

/** Item detallado luego de la recomendación de lotes */
export interface DispensacionDirectaDetalleItem {
    material: Material;
    loteId: number | null;
    /** Cantidad sugerida por el backend */
    cantidadSugerida: number;
    /** Cantidad final a dispensar (editable) */
    cantidad: number;
}

export interface DispensacionNoPlanificadaItemDTO {
    productoId: string;
    cantidad: number;
    loteId?: number;
}

export interface DispensacionNoPlanificadaDTO {
    observaciones: string;
    usuarioId: number;
    items: DispensacionNoPlanificadaItemDTO[];
}
