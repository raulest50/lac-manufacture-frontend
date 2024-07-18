
const TIPOS_PRODUCTOS = {materiaPrima: "M", semiTerminado:"S", Terminado:"T"};

const UNIDADES = {L:"L", KG:"KG", U:"U"};

const SECCION = {
    BODEGA: {nombre:"Bodega", id:1},
    LLENADO: {nombre:"Envasar", id:2},
    ETIQUETAS: {nombre:"Quema Etiquetas", id:3},
    MARMITAS: {nombre:"Marmitas", id:4},
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