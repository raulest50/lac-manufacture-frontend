// Path: src/pages/Clientes/types.tsx
// Used in: src/pages/Clientes/CodificarCliente.tsx; src/pages/Clientes/consultar/ConsultarClientes.tsx; src/pages/Clientes/consultar/panel_busqueda_comp/ListaSearchClientes.tsx; src/pages/Clientes/consultar/PanelBusqueda.tsx; src/pages/Clientes/consultar/DetalleCliente.tsx
// Summary: Tipos de clientes y utilidades de búsqueda usados en formularios de codificación y consultas.
export interface Cliente {
    clienteId: number;
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    condicionesPago?: string;
    limiteCredito?: number;
    urlRut?: string;
    urlCamComer?: string;
}

export interface ClienteFormData {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    condicionesPago?: string;
    limiteCredito?: number;
}

export interface DTO_SearchCliente {
    id: number | null;
    nombre: string | null;
    email: string | null;
    searchType: SearchType;
}

export enum SearchType {
    ID = 'ID',
    NOMBRE_O_EMAIL = 'NOMBRE_O_EMAIL'
}
