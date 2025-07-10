// src/pages/Clientes/types.tsx

export interface Cliente {
    id: number;
    nombre: string;
    ruc?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    contacto?: string;
    estado: number; // 1: activo, 0: inactivo
}

export interface ClienteFormData {
    nombre: string;
    ruc?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    contacto?: string;
}