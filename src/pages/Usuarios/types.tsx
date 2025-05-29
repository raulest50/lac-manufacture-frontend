// src/pages/Usuarios/types.tsx
import { Modulo } from "../../types/Modulo";

export interface Role {
    id: number;
    name: string;
}

export interface Acceso {
    id: number;
    nivel: number;
    moduloAcceso: Modulo;
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
    accesos: Acceso[];
    roles?: Role[]; // Keep for backward compatibility during transition
}


export const role_master = "ROLE_MASTER";
export const role_compras = "ROLE_COMPRAS";
export const role_jefe_prod = "ROLE_JEFE_PRODUCCION";
export const role_asist_prod = "ROLE_ASISTENTE PRODUCCION";
export const role_almacen = "ROLE_ALMACEN";
