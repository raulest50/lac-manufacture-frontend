

export type Movimiento = {
    movimiento_id?: string;
    cantidad: string;
    producto: {
        producto_id:string;
        tipo_producto:string;
    };
    causa: string;
    observaciones: string;
    fechaMovimiento?:string; // "yyyy-MM-dd'T'HH:mm:ss"
};

