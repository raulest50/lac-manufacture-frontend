
const TIPOS_PRODUCTOS = {materiaPrima: "M", semiTerminado:"S", Terminado:"T"};

const UNIDADES: { [key: string]: string } = { L: "L", KG: "KG", U: "U" };



type Seccion = {
    nombre: string;
    id: number;
};


const SECCION: Record<string, Seccion> = {
    BODEGA_PISO_1: {nombre:"Bodega Piso 1", id:101},
    BODEGA_PISO_2: {nombre:"Bodega Piso 2", id:201},
    LLENADO_PISO_1: {nombre:"LLenado Piso 1", id:102},
    LLENADO_PISO_2: {nombre:"LLenado Piso 2", id:202},
    ETIQUETAS_PISO_3: {nombre:"Etiquetas Piso 3", id:303},
    MARMITAS_PISO_3: {nombre:"Marmitas Piso 3", id:304},
};



const CAUSAS_MOVIMIENTOS = {
    VENTA:"VENTA",
    COMPRA:"COMPRA",
    AVERIA:"AVERIA",
    USO_INTERNO:"USO_INTERNO",
    PROD_INTERNO:"PROD_INTERNO",
    OTROS:"OTROS"
};

export {TIPOS_PRODUCTOS, UNIDADES, SECCION, CAUSAS_MOVIMIENTOS}