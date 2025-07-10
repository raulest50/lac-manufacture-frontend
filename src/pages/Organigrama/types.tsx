// Nivel de acceso del usuario
export enum AccessLevel {
  VIEW = 1,  // Solo visualización
  EDIT = 2   // Edición completa
}

// Interfaz para el cargo en el organigrama
export interface Cargo {
  idCargo: string;
  tituloCargo: string;        // Título del cargo
  descripcionCargo: string;  // Descripción breve
  departamento: string;   // Departamento
  jefeInmediato?: string;    // ID del cargo al que reporta
  urlDocManualFunciones?: string; // url del pdf con el manual de funciones aprovado
  usuario?: string; // Id Usuario asignado al cargo
}

// Datos para el nodo de cargo
export interface PositionNodeData {
  id: string;
  title: string;
  department: string;
  description: string;
  level: number;
}

// Manual de funciones asociado a un cargo
export interface FunctionManual {
  positionId: string;
  responsibilities: string;  // Responsabilidades
  requirements: string;      // Requisitos
  skills: string;            // Habilidades
  experience: string;        // Experiencia requerida
  education: string;         // Formación académica
  additionalInfo: string;    // Información adicional
}

// Estructura completa del organigrama
export interface OrganizationChart {
  id: string;
  name: string;
  description: string;
  positions: Cargo[];
  functionManuals: Record<string, FunctionManual>; // Manuales indexados por positionId
}