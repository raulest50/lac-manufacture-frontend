

export type Movimiento = {
    movimientoId?: string;
    cantidad: string;
    producto: {
        productoId:string;
        tipo_producto:string;
    };
    causa: string;
    observaciones: string;
    fechaMovimiento?:string; // "yyyy-MM-dd'T'HH:mm:ss"
};

