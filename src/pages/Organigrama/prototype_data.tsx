// src/pages/Organigrama/prototype_data.tsx
import { AccessLevel, Cargo, FunctionManual, OrganizationChart } from "./types";

// Mock user access level - can be changed to test different permission levels
export const mockUserAccess = {
  accessLevel: AccessLevel.EDIT // Change to AccessLevel.VIEW to test view-only mode
};

// Mock positions for the organization chart
export const mockPositions: Cargo[] = [
  // Level 1 - CEO
  {
    id: "pos-1",
    tituloCargo: "Director General",
    departamento: "Dirección",
    descripcionCargo: "Responsable de la dirección estratégica y operativa de la empresa",
    level: 1
  },

  // Level 2 - Directors
  {
    id: "pos-2",
    tituloCargo: "Director de Producción",
    departamento: "Producción",
    descripcionCargo: "Responsable de supervisar todos los procesos de producción",
    jefeInmediato: "pos-1",
    level: 2
  },

  // Level 3 - Managers
  {
    id: "pos-6",
    tituloCargo: "Gerente de Planta",
    departamento: "Producción",
    descripcionCargo: "Supervisa las operaciones diarias de la planta de producción",
    jefeInmediato: "pos-2",
    level: 3
  },

  // Level 4 - Staff
  {
    id: "pos-11",
    tituloCargo: "Supervisor de Producción",
    departamento: "Producción",
    descripcionCargo: "Supervisa el trabajo de los operarios de producción",
    jefeInmediato: "pos-6",
    level: 4
  }
];

// Mock function manuals for each position
export const mockFunctionManuals: Record<string, FunctionManual> = {
  "pos-1": {
    positionId: "pos-1",
    responsibilities: "- Definir la estrategia global de la empresa\n- Supervisar a los directores de departamento\n- Representar a la empresa ante entidades externas\n- Tomar decisiones estratégicas para el crecimiento y sostenibilidad\n- Aprobar presupuestos anuales",
    requirements: "- Título universitario en Administración de Empresas o similar\n- MBA o posgrado en Dirección de Empresas\n- Experiencia mínima de 10 años en puestos directivos",
    skills: "- Liderazgo y visión estratégica\n- Capacidad de toma de decisiones\n- Habilidades de comunicación y negociación\n- Gestión de equipos de alto rendimiento",
    experience: "Mínimo 10 años en puestos directivos, preferiblemente en el sector industrial",
    education: "MBA o posgrado en Dirección de Empresas",
    additionalInfo: "Reporta directamente al Consejo de Administración"
  },
  "pos-2": {
    positionId: "pos-2",
    responsibilities: "- Planificar y supervisar todos los procesos productivos\n- Gestionar el equipo de producción\n- Optimizar procesos para mejorar eficiencia\n- Asegurar el cumplimiento de estándares de calidad\n- Gestionar el presupuesto del departamento",
    requirements: "- Ingeniería Industrial o similar\n- Conocimientos avanzados en procesos de producción\n- Experiencia en gestión de equipos",
    skills: "- Planificación y organización\n- Resolución de problemas\n- Liderazgo\n- Conocimientos técnicos de producción",
    experience: "Mínimo 7 años en áreas de producción, con al menos 3 años en puestos de dirección",
    education: "Ingeniería Industrial o similar, preferiblemente con especialización en gestión de producción",
    additionalInfo: "Responsable de la gestión de la planta de producción y del cumplimiento de los objetivos de producción"
  },
  "pos-6": {
    positionId: "pos-6",
    responsibilities: "- Supervisar las operaciones diarias de la planta\n- Coordinar los equipos de producción\n- Asegurar el cumplimiento de los planes de producción\n- Gestionar recursos materiales y humanos\n- Implementar mejoras en los procesos",
    requirements: "- Ingeniería Industrial o técnica\n- Conocimientos en gestión de producción\n- Experiencia en supervisión de equipos",
    skills: "- Organización y planificación\n- Liderazgo\n- Resolución de problemas\n- Trabajo en equipo",
    experience: "Mínimo 5 años en áreas de producción, con experiencia en supervisión",
    education: "Ingeniería Industrial o técnica",
    additionalInfo: "Trabaja en estrecha colaboración con el departamento de calidad para asegurar los estándares de los productos"
  },
  "pos-11": {
    positionId: "pos-11",
    responsibilities: "- Supervisar el trabajo de los operarios\n- Asegurar el cumplimiento de los estándares de producción\n- Reportar incidencias y problemas\n- Coordinar los turnos de trabajo\n- Realizar controles de calidad básicos",
    requirements: "- Formación técnica en procesos industriales\n- Conocimientos en supervisión de personal\n- Experiencia en entornos de producción",
    skills: "- Liderazgo\n- Comunicación efectiva\n- Resolución de problemas\n- Trabajo bajo presión",
    experience: "Mínimo 3 años en entornos de producción",
    education: "Formación técnica o profesional en áreas industriales",
    additionalInfo: "Responsable directo del rendimiento y la calidad del trabajo de los operarios"
  }
};

// Create a complete organization chart with the mock data
export const mockOrganizationChart: OrganizationChart = {
  id: "org-1",
  name: "Organigrama Principal",
  description: "Estructura organizativa de la empresa",
  positions: mockPositions,
  functionManuals: mockFunctionManuals
};

// Helper function to get a function manual by position ID
export const getMockFunctionManual = (positionId: string): FunctionManual => {
  // Return the existing function manual if it exists
  if (mockFunctionManuals[positionId]) {
    return mockFunctionManuals[positionId];
  }

  // Otherwise, return a generic function manual
  return {
    positionId,
    responsibilities: "Responsabilidades genéricas del cargo",
    requirements: "Requisitos básicos del puesto",
    skills: "Habilidades necesarias para el puesto",
    experience: "Experiencia requerida para el puesto",
    education: "Formación académica necesaria",
    additionalInfo: "Información adicional sobre el cargo"
  };
};

// Mock API responses for use in components
export const mockApiResponses = {
  // Get user access level
  getUserAccess: () => {
    return Promise.resolve({ data: mockUserAccess });
  },

  // Get all organization charts
  getOrganizationCharts: () => {
    return Promise.resolve({ data: [mockOrganizationChart] });
  },

  // Get a specific organization chart
  getOrganizationChart: (id: string) => {
    if (id === mockOrganizationChart.id) {
      return Promise.resolve({ data: mockOrganizationChart });
    }
    return Promise.reject(new Error("Organization chart not found"));
  },

  // Get a specific position
  getPosition: (id: string) => {
    const position = mockPositions.find(pos => pos.id === id);
    if (position) {
      return Promise.resolve({ data: position });
    }
    return Promise.reject(new Error("Position not found"));
  },

  // Get a function manual for a position
  getFunctionManual: (positionId: string) => {
    const manual = mockFunctionManuals[positionId] || getMockFunctionManual(positionId);
    return Promise.resolve({ data: manual });
  },

  // Create a new position
  createPosition: (position: Cargo) => {
    return Promise.resolve({ data: position });
  },

  // Update a position
  updatePosition: (id: string, data: Partial<Cargo>) => {
    const position = mockPositions.find(pos => pos.id === id);
    if (position) {
      return Promise.resolve({ data: { ...position, ...data } });
    }
    return Promise.reject(new Error("Position not found"));
  },

  // Delete a position
  deletePosition: (id: string) => {
    return Promise.resolve({ data: { success: true } });
  },

  // Update a function manual
  updateFunctionManual: (positionId: string, data: FunctionManual) => {
    return Promise.resolve({ data });
  }
};
