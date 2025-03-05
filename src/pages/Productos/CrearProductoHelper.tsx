import axios from 'axios';
import EndPointsURL from "../../api/EndPointsURL.tsx";
import { CreateToastFnReturn } from '@chakra-ui/react';

export interface MiItem {
    productoId: number;
    tipo_producto: string;
    nombre: string;
    observaciones: string;
    costo: number;
    tipoUnidades: string;
    cantidadUnidad: string;
    fechaCreacion: string;
    cantidadRequerida: string;
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
        cantidadUnidad: string;
        fechaCreacion: string;
    };
}

export interface SemiTermi {
    // Define properties as needed
}



const endPoints = new EndPointsURL();

export class CrearProductoHelper {

    static CodificarMateriaPrima = async (
        materiaPrima: MateriaPrima,
        toast: CreateToastFnReturn
    ) => {
        if (CrearProductoHelper.ValidateMateriaPrimaCreation(materiaPrima)) {
            try {
                const response = await axios.post(
                    endPoints.save_producto,
                    materiaPrima
                );
                console.log('Product saved successfully:', response.data);

                toast({
                    title: 'Materia Prima Creada',
                    description: `Creación exitosa  id:${response.data}, time:${response.data.fechaCreacion}`,
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });
            } catch (error) {
                console.error('Error saving product:', error);
                toast({
                    title: 'Ha ocurrido un error',
                    description: 'Ha ocurrido un error',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            }
        } else {
            toast({
                title: 'Alerta',
                description: 'Los datos ingresados en los campos no son válidos',
                status: 'warning',
                duration: 9000,
                isClosable: true,
            });
        }
    };

    static CodificarSemiTermi = async (
        semiTermi: SemiTermi,
        toast: CreateToastFnReturn
    ) => {
        if (CrearProductoHelper.ValidateSemiTerCreation(semiTermi)) {
            try {

                const response = await axios.post(
                    endPoints.save_producto,
                    semiTermi
                );
                console.log('Product saved successfully:', response.data);

                toast({
                    title: 'Terminado/Semiterminado Creado',
                    description: `Creación exitosa  id:${response.data}, time:${response.data.fechaCreacion}`,
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });
            } catch (error) {
                console.error('Error saving product:', error);
                toast({
                    title: 'Ha ocurrido un error',
                    description: 'Ha ocurrido un error',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
                console.log('JSON object', semiTermi);
            }
        } else {
            toast({
                title: 'Alerta',
                description: 'Los datos ingresados en los campos no son válidos',
                status: 'warning',
                duration: 9000,
                isClosable: true,
            });
        }
    };

    static ValidateMateriaPrimaCreation = (
        materiaPrima: MateriaPrima
    ): boolean => {
        return (
            materiaPrima.nombre !== '' &&
            !isNaN(Number(materiaPrima.costo)) &&
            Number(materiaPrima.costo) >= 0 &&
            !isNaN(Number(materiaPrima.cantidadUnidad))
        );
    };

    static ValidateSemiTerCreation = (semiTermi: SemiTermi): boolean => {
        console.log(semiTermi);
        return true; // Adjust validation logic as needed
    };
}
