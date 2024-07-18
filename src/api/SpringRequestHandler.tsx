

import {ServerParams} from "./params.tsx";
import {Movimiento} from "../models/Movimiento.tsx";
import {CreateToastFnReturn} from '@chakra-ui/react';
import axios from 'axios';


export class SpringRequestHandler{
    
   static registrarMovimiento = async (toast:CreateToastFnReturn, movimiento:Movimiento) => {
        try {
            const response = await axios.post(ServerParams.getMovimientoEndPoint_save(), movimiento);
            console.log('Product saved successfully:', response.data);
            toast({
            title: 'Movimiento Registrado',
            description: `"Registro Exitoso  id:${response.data}, time:${response.data.fechaCreacion}"`,
            status: 'success',
            duration: 9000,
            isClosable: true,
            })
        } catch (error) {
            console.error('Error saving product:', error);
            toast({
            title: 'Ha ocurrido un error',
            description: `" ha ocurrido un error"`,
            status: 'error',
            duration: 9000,
            isClosable: true,
            })
        }
    };
     
    
}