export interface Cliente {
    clienteId: number;
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    condicionesPago?: string;
    limiteCredito?: number;
    urlRut?: string;
    urlCamComer?: string;
}

export interface ClienteFormData {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    condicionesPago?: string;
    limiteCredito?: number;
}

export interface DTO_SearchCliente {
    id: number | null;
    nombre: string | null;
    email: string | null;
    searchType: SearchType;
}

export enum SearchType {
    ID = 'ID',
    NOMBRE_O_EMAIL = 'NOMBRE_O_EMAIL'
}
