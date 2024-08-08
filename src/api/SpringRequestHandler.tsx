

import {ServerParams} from "./params.tsx";
import {CreateToastFnReturn} from '@chakra-ui/react';
import axios from 'axios';

import {Movimiento} from "../models/Movimiento.tsx";
import {Stock} from "../models/Stock.tsx";
import {Terminado} from "../models/Terminado.tsx";
import {OrdenProduccionDTA} from "../models/OrdenProduccionDTA.tsx";
import {OrdenProduccion} from "../models/OrdenProduccion.tsx";
import {OrdenSeguimiento} from "../models/OrdenSeguimiento.tsx";

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
            console.error('Error guardando movimiento:', error);
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
                    productoId:data.producto.productoId,
                    nombre:data.producto.nombre,
                    observaciones:data.producto.observaciones,
                    costo:data.producto.costo,
                    fechaCreacion:data.producto.fechaCreacion,
                    tipoUnidades:data.producto.tipoUnidades,
                    cantidadUnidad:data.producto.cantidadUnidad,
                    tipo_producto:data.producto.tipo_producto
                }
            }
            setStockItem(stock);
        } catch (error) {
            console.error('Error en getAll', error);
        }
    };

    static getWorkLoadByZona = async (zonaId:number, setListaOrdenesSeg:(listaOrdenesSeg: OrdenSeguimiento[]) => void) => {
        try {
            const response =
                await axios.get(ServerParams.getWorkload_by_zona(), {params:{zonaId:zonaId}});
            const data = response.data;
            const listaOrdenesSeg = data.content.map((item: any) => ({
                seguimientoId: item.seguimientoId,
                insumo: item.insumo,
                seccionResponsable: item.seccionResponsable,
                estado: item.estado,
                observaciones: item.observaciones,
                fechaInicio: item.fechaInicio,
                fechaFinalizacion: item.fechaFinalizacion
            }));

            setListaOrdenesSeg(listaOrdenesSeg)

        } catch (error) {
            console.error('Error en getAll', error);
        }
    };

    static CrearOrdenProduccion = async (toast:CreateToastFnReturn, ordenProduccionDTA:OrdenProduccionDTA) => {
        try {
            const response = await axios.post(ServerParams.getProduccionEndPoint_save(), ordenProduccionDTA);
            console.log('Product saved successfully:', response.data);
            toast({
            title: 'Orden de Produccion Creada Exitosamente',
            description: `"Registro Exitoso  id:${response.data}, time:${response.data.fechaCreacion}"`,
            status: 'success',
            duration: 9000,
            isClosable: true,
            })
        } catch (error) {
            console.error('Error creando orden:', error);
            toast({
            title: 'Ha ocurrido un error',
            description: `" ha ocurrido un error"`,
            status: 'error',
            duration: 9000,
            isClosable: true,
            })
        }
    };

    static getOrdenesActivas = async ( setListaProdActivas:(lista:OrdenProduccion[]) => void ) => {
        try {
            const response =
                await axios.get(ServerParams.getProduccionEndPoint_byEstado(), {params:{estado:0, }});
            setListaProdActivas(response.data.content);
        } catch (error) {
            console.error('Error en getAll', error);
        }
    };

    static getTerminadosList = async (busqueda:string, tipo_busqueda:string, setListaTerminados:(listaterminados: Terminado[]) => void) => {
        try {
            const response =
                await axios.get(ServerParams.getProductoEndPoint_TerminadosGetAll(), {params:{search:busqueda, tipoBusqueda:tipo_busqueda}});
            setListaTerminados(response.data.content);
        } catch (error) {
            console.error('Error en getAll', error);
        }
    };


    static UpdateOrdenSeguimientoEstado = async (ordenSegId:number, estado:number) => {
        try {
            const response =
                await axios.get(ServerParams.getProduccionEndPoint_Update_OrdSeg_Estado(), {params:{seguimientoId:ordenSegId, estado:estado}});
            return response.data.content;
        } catch (error) {
            console.error('Error en getAll', error);
        }
    };
     
}