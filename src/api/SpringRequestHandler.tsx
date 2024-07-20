

import {ServerParams} from "./params.tsx";
import {CreateToastFnReturn} from '@chakra-ui/react';
import axios from 'axios';

import {Movimiento} from "../models/Movimiento.tsx";
import {Stock} from "../models/Stock.tsx";


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

    static getStockByProductoId = async (producto_id:number, setStockItem:(stock: Stock) => void) => {
        try {
            const response =
                await axios.get(ServerParams.getMovStockEndPoint_byId(), {params:{producto_id:producto_id}});
            //console.log(serverParams.getProductoEndPoint_getall());
            const data = response.data;
            const stock:Stock = {
                cantidad_totalizada: data.stock,
                producto:{
                    producto_id:data.producto.producto_id,
                    nombre:data.producto.nombre,
                    observaciones:data.producto.observaciones,
                    costo:data.producto.costo,
                    fechaCreacion:data.producto.fechaCreacion,
                    tipo_unidades:data.producto.tipo_unidades,
                    cantidad_unidad:data.producto.cantidad_unidad,
                    tipo_producto:data.producto.tipo_producto
                }
            }
            setStockItem(stock);
        } catch (error) {
            console.error('Error en getAll', error);
        }
    };

    static getWorkLoadByZona = async () => {
        try {
            const response =
                await axios.get(ServerParams.getMovStockEndPoint_byId(), {params:{}});
            //console.log(serverParams.getProductoEndPoint_getall());
            const data = response.data;


        } catch (error) {
            console.error('Error en getAll', error);
        }
    }
     
    
}