
import axios from 'axios';
import { Compra } from './types.tsx';
import EndPointsURL from "../../api/EndPointsURL.tsx";

const endPoints = new EndPointsURL();

export const saveCompra = async (compra: Compra) => {
    const response = await axios.post(endPoints.save_compra, compra);
    return response.data;
};
