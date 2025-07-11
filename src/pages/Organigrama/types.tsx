// Nivel de acceso del usuario
export enum AccessLevel {
  VIEW = 1,  // Solo visualización
  EDIT = 2   // Edición completa
}

// Interfaz unificada para el cargo en el organigrama
export interface Cargo {
  idCargo: string;
  tituloCargo: string;        // Título del cargo (será el mismo que el título del nodo)
  descripcionCargo: string;   // Descripción breve
  departamento: string;       // Departamento
  urlDocManualFunciones?: string; // url del pdf con el manual de funciones aprovado
  manualFuncionesFile?: File;  // Archivo del manual de funciones (solo en frontend)
  usuario?: string;           // Id Usuario asignado al cargo

  // Propiedades del nodo (anteriormente en CargoNodeData)
  posicionX: number;          // Posición X en el diagrama
  posicionY: number;          // Posición Y en el diagrama
  nivel: number;              // Nivel jerárquico
  jefeInmediato?: string;     // ID Nodo al que reporta
}

// Estructura completa del organigrama
export interface OrganizationChart {
  id: string;
  name: string;
  cargos: Cargo[];
}
