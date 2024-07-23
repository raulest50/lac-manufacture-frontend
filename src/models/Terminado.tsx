

import {Insumo} from "./Insumo.tsx";

export type Terminado ={
    productoId:number;
    nombre:string;
    observaciones:string;
    costo:number;
    fechaCreacion:string;
    tipoUnidades:string;
    cantidadUnidad:number;
    tipo_producto?:string;
    status:number;
    seccionResponsable:number;
    insumos:Insumo[];
}