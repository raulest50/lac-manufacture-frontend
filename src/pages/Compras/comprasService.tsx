// src/services/comprasService.ts

import axios from 'axios';
import { Compra } from './types.tsx';
import { ServerParams } from '../../api/params.tsx';

export const saveCompra = async (compra: Compra) => {
    const response = await axios.post(`${ServerParams.getDomain()}/compras/save`, compra);
    return response.data;
};
