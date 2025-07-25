// src/pages/ProduccionPage/CrearOrdenes.tsx

import { useState, useRef } from 'react';
import { Textarea, Select, Button, VStack } from '@chakra-ui/react';
import { RecetaPicker, RecetaPickerRef } from './RecetaPicker';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import {ProductoWithInsumos} from "./types.tsx";
import EndPointsURL from "../../api/EndPointsURL.tsx";

const endPoints = new EndPointsURL();

export default function CrearOrdenes() {
    const toast = useToast();

    const [canProduce, setCanProduce] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState<ProductoWithInsumos | null>(null);
    const [observaciones, setObservaciones] = useState('');
    const [responsableId, setResponsableId] = useState(1);

    // Create a ref to RecetaPicker to access the refresh method
    const recetaPickerRef = useRef<RecetaPickerRef>(null);

    const handleCrearOrden = async () => {
        if (selectedProducto) {
            try {
                const ordenProduccion = {
                    productoId: selectedProducto.producto.productoId,
                    responsableId: responsableId,
                    observaciones: observaciones,
                };
                await axios.post(endPoints.save_produccion, ordenProduccion);
                // Handle success
                toast({
                    title: 'Orden de Producción creada',
                    description: 'La orden se ha creado correctamente.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                // Reset form
                setSelectedProducto(null);
                setObservaciones('');
                setCanProduce(false);
                // Trigger a refresh in RecetaPicker to update stocks
                if (recetaPickerRef.current) {
                    recetaPickerRef.current.refresh();
//                     console.log("entered the if refresh")
                }
            } catch (error) {
                console.error('Error creating orden de producción:', error);
                toast({
                    title: 'Error',
                    description: 'No se pudo crear la orden de producción.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } else {
            toast({
                title: 'Sin producto seleccionado',
                description: 'Por favor, selecciona un producto antes de crear la orden.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <VStack align="stretch">
            <RecetaPicker
                setCanProduce={setCanProduce}
                setSelectedProducto={setSelectedProducto}
                ref={recetaPickerRef} // Pass the ref to RecetaPicker
            />
            <Textarea
                placeholder="Observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                mt="4"
            />
            <Select
                value={responsableId}
                onChange={(e) => setResponsableId(Number(e.target.value))}
                mt="4"
            >
                <option value={1}>Responsable 1</option>
                <option value={2}>Responsable 2</option>
            </Select>
            <Button
                onClick={handleCrearOrden}
                isDisabled={!canProduce}
                mt="4"
                colorScheme="blue"
            >
                Crear Orden de Producción
            </Button>
        </VStack>
    );
}
