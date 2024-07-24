

/**
 * se usa solo para crear ordenes de produccion en la db ya que con el terminadoId Spring reconstruye los demas datos
 */
export type OrdenProduccionDTA = {
    terminadoId:number;
    seccionResponsable:number;
    observaciones:string;
}