// src/pages/Usuarios/types.tsx


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
}


// src/types/Modulo.tsx
export enum Modulo {
    USUARIOS = "USUARIOS", // ruta /usuarios
    PRODUCTOS = "PRODUCTOS", // ruta /productos
    PRODUCCION = "PRODUCCION", // ruta /produccion
    STOCK = "STOCK", // ruta /stock
    PROVEEDORES = "PROVEEDORES", // ruta /Proveedores
    COMPRAS = "COMPRAS", // ruta /compras
    SEGUIMIENTO_PRODUCCION = "SEGUIMIENTO_PRODUCCION", // ruta /asistente_produccion
    TRANSACCIONES_ALMACEN = "TRANSACCIONES_ALMACEN", // ruta /recepcion_mprima
    ACTIVOS = "ACTIVOS", // ruta /Activos
    CONTABILIDAD = "CONTABILIDAD", //ruta /Contabilidad
    PERSONAL_PLANTA = "PERSONAL_PLANTA", // ruta /personal
    BINTELLIGENCE = "BINTELLIGENCE", // ruta /Bintelligence
    //CARGA_MASIVA = "CARGA_MASIVA", // ruta /carga_masiva
    ADMINISTRACION_ALERTAS = "ADMINISTRACION_ALERTAS", // ruta /administracion_alertas
    //MASTER_CONFIGS = "MASTER_CONFIGS", // ruta /master_configs
    CRONOGRAMA = "CRONOGRAMA", // ruta /cronograma
    ORGANIGRAMA = "ORGANIGRAMA" // ruta /organigrama
}
