

type Movimiento = {
    movimiento_id: string;
    cantidad: number;
    producto_id: number;
    causa: string;
    observaciones: string;
    fechaMovimiento:string; // "yyyy-MM-dd'T'HH:mm:ss"
};

type OrdenProduccion = {
    
};

type OrdenSeguimiento = {
    
};

export {Movimiento, OrdenProduccion, OrdenSeguimiento}