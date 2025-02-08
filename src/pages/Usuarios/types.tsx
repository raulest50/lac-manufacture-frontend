// src/components/types.tsx
export interface Role {
    id: number;
    name: string;
}

export interface User {
    id: number;
    username: string;
    password?: string;
    roles: Role[];
}


export const role_master = "ROLE_MASTER";
export const role_compras = "ROLE_COMPRAS";
export const role_jefe_prod = "ROLE_JEFE_PRODUCCION";
export const role_asist_prod = "ROLE_ASISTENTE PRODUCCION";
export const role_almacen = "ROLE_ALMACEN";
