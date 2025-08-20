
/**
 * Interfaz que representa un item de necesidad (una fila del Excel)
 */
export interface NecesidadItem {
  codigo: string;
  nombre: string;
  necesidad: number;
  categoria: string;
  // Campo para marcar si existe en la base de datos
  existeEnBD?: boolean;
}

/**
 * Interfaz que representa la colección de necesidades
 */
export interface Nececidades {
  items: NecesidadItem[];
  categorias: string[];
}

/**
 * Interfaz para la capacidad productiva
 */
export interface CapProductiva {
  horasTrabajo?: number;
  diasTrabajo?: number;
  eficiencia?: number;
  modoOptimizacion?: 'tiempo' | 'costo' | 'balanceado';
  considerarHorasExtra?: boolean;
  permitirProduccionParalelo?: boolean;
}

/**
 * Interfaz para un item del plan maestro de producción
 */
export interface MPSItem {
  codigo: string;
  nombre: string;
  cantidad: number;
  semana: number;
  prioridad: 'Alta' | 'Media' | 'Baja';
  categoria: string;
  fechaInicio?: string;
  fechaFin?: string;
}

/**
 * Interfaz para el plan maestro de producción
 */
export interface MPS {
  items: MPSItem[];
  totalProductos: number;
  totalCategorias: number;
  horasProduccionTotal: number;
  fechaGeneracion: string;
}
