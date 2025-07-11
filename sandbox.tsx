
import axios from 'axios';

// Define server URL
const server = "http://localhost:8080";

// Define endpoint for users
const ep_all_users = server + "/usuarios";
const ep_cargos = server + "/organigrama";

const token = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtYXN0ZXIiLCJhY2Nlc29zIjoiIiwiaWF0IjoxNzUyMjQ4ODE0LCJleHAiOjE3NTIzMzUyMTR9.u1tT_ISLT8sK504zblqRVuShZ5NQ-pmxJV10NlguosYsBoiS4WotBt9kHjNc4szb";

const headers = {
    'Authorization': `Bearer ${token}`
};


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


// Function to fetch and print all users
const getAllUsers = async () => {
  try {
    const response = await axios.get(ep_all_users, {headers});
    return response.data;
  } catch (error) {
    // Handle any errors
    console.error('Error fetching users:', error);
    throw error;
  }
};

const getOrganigrama = async () => {
    try {
        const response = await axios.get(ep_cargos, {headers});
        return response.data;
    } catch (error) {
        // Handle any errors
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Call the function
const data = await getOrganigrama();

console.log(data);
