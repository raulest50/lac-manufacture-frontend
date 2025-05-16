
export interface DocTranDePersonal {
    id?: number;  // opcional porque es auto-generado
    idIntegrante: number;
    tipoDocTran: TipoDocTran;
    fechaHora: string;  // para LocalDateTime usamos string en formato ISO
    descripcion?: string;
    valoresAnteriores?: string;  // TEXT en formato JSON
    valoresNuevos?: string;      // TEXT en formato JSON
    usuarioResponsable?: string;
}

export enum TipoDocTran {
    INGRESO = 'INGRESO',
    MODIFICACION_SALARIO = 'MODIFICACION_SALARIO',
    MODIFICACION_CARGO = 'MODIFICACION_CARGO',
    MODIFICACION_DEPARTAMENTO = 'MODIFICACION_DEPARTAMENTO',
    MODIFICACION_DATOS_PERSONALES = 'MODIFICACION_DATOS_PERSONALES',
    CAMBIO_ESTADO = 'CAMBIO_ESTADO',
    SALIDA = 'SALIDA',
    OTRO = 'OTRO'
}

export interface IntegrantePersonal {
    // ID (cédula)
    id: number;

    // Información personal
    nombres: string;
    apellidos: string;
    celular: string;
    direccion: string;
    email?: string;

    // Información laboral
    cargo?: string;
    departamento?: 'PRODUCCION' | 'ADMINISTRATIVO';
    centroDeCosto?: string;
    centroDeProduccion?: string;

    // Salario en COP
    salario?: number;

    // Estado del integrante
    estado?: EstadoIntegrante;

    // Documentos asociados
    documentos?: DocTranDePersonal[];

    // Referencia a otro integrante
    idIntegrante?: IntegrantePersonal;
}

export enum EstadoIntegrante {
    ACTIVO = 'ACTIVO',
    INACTIVO = 'INACTIVO'
}
