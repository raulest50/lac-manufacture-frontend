

export type Movimiento = {
    movimiento_id?: string;
    cantidad: string;
    producto_id: string;
    causa: string;
    observaciones: string;
    fechaMovimiento?:string; // "yyyy-MM-dd'T'HH:mm:ss"
};

