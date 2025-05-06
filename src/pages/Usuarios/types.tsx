// src/components/types.tsx
export interface Role {
    id: number;
    name: string;
}

export interface User {
    id: number;
    cedula: number;
    username: string;
    nombreCompleto?: string;
    password?: string;
    cel?: string;
    direccion?: string;
    fechaNacimiento?: string; // ISO format, e.g., '2025-05-06'
    estado: number;
    roles: Role[];
}


export const role_master = "ROLE_MASTER";
export const role_compras = "ROLE_COMPRAS";
export const role_jefe_prod = "ROLE_JEFE_PRODUCCION";
export const role_asist_prod = "ROLE_ASISTENTE PRODUCCION";
export const role_almacen = "ROLE_ALMACEN";
