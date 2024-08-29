
import axios from 'axios';
import {ServerParams} from "../../api/params.tsx";
import {CreateToastFnReturn} from '@chakra-ui/react';

export interface MiItem {
    productoId: number;
    tipo_producto:string;
    nombre: string;
    observaciones: string;
    costo: number;
    tipoUnidades: string;
    cantidadUnidad: string;
    fechaCreacion: string;
    cantidadRequerida:string;
}

export interface Insumo {
    cantidadRequerida: string;
    producto: {
        productoId: number;
        tipo_producto: string;
        nombre: string;
        observaciones: string;
        costo: number;
        tipoUnidades: string;
        cantidadUnidad:string;
        fechaCreacion: string;
    };
}

export interface SemiTermi {
    
}

export interface MateriaPrima {
    nombre:string,
    observaciones:string,
    costo:string,
    tipoUnidades:string,
    cantidadUnidad:string,
    tipo_producto:string
}


export class CrearProductoHelper {
    
    static CodificarMateriaPrima = async (materiaPrima:MateriaPrima, toast:CreateToastFnReturn) => {
        if(CrearProductoHelper.ValidateMateriaPrimaCreation(materiaPrima)){
            try {
                console.log(ServerParams.getProductoEndPoint_save());
                const response = await axios.post(ServerParams.getProductoEndPoint_save(), materiaPrima);
                console.log('Product saved successfully:', response.data);
    
                toast({
                title: 'Materia Prima Creada',
                description: `"Creacion exitosa  id:${response.data}, time:${response.data.fechaCreacion}"`,
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
        } else {
            toast({
                title: 'Alerta',
                description: `"Los datos ingresados en los campos no son validos"`,
                status: 'warning',
                duration: 9000,
                isClosable: true,
                })
        }
    }
    
    
    static CodificarSemiTermi = async (semiTermi:SemiTermi, toast:CreateToastFnReturn) => {
        
        if(CrearProductoHelper.ValidateSemiTerCreation(semiTermi)){
            try {
                console.log(ServerParams.getProductoEndPoint_save());
                const response = await axios.post(ServerParams.getProductoEndPoint_save(), semiTermi);
                console.log('Product saved successfully:', response.data);
    
                toast({
                title: 'Terminado/Semiterminado Creado',
                description: `"Creacion exitosa  id:${response.data}, time:${response.data.fechaCreacion}"`,
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
                console.log('json object',semiTermi)
            }
        } else{
            toast({
                title: 'Alerta',
                description: `"Los datos ingresados en los campos no son validos"`,
                status: 'warning',
                duration: 9000,
                isClosable: true,
                })
        }
        
    }
    
    static ValidateMateriaPrimaCreation = (materiaPrima:MateriaPrima): boolean => {
        if(
            materiaPrima.nombre != "" &&
            !isNaN(Number(materiaPrima.costo)) &&
            Number(materiaPrima.costo) >= 0 &&
            !isNaN(Number(materiaPrima.cantidadUnidad))
            ){
            return true;   
            }
        else{
            return false;
        }
    };
    
    static ValidateSemiTerCreation = (semiTermi:SemiTermi): boolean => {
        return true;
    };
    
}




