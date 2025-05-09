export interface Contacto {
    fullName: string;
    cargo: string;
    cel: string;
    email: string;
}

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

export interface DTO_SearchProveedor {
    id:string;
    nombre:string;
    categorias: number[];
    searchType: string; // "id" or "combined"
}

export const TIPO_BUSQUEDA = {
    ID: 'ID',
    NOMBRE_Y_CATEGORIA: 'NOMBRE_Y_CATEGORIA'
}
