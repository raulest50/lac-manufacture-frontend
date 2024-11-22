// src/pages/Produccion/CrearOrdenes.tsx

import { useState } from 'react';
import { Textarea, Select, Button, VStack } from "@chakra-ui/react";
import { RecetaPicker } from './RecetaPicker.tsx';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

interface ProductoWithInsumos {
    producto: Producto;
    insumos: InsumoWithStock[];
}

interface Producto {
    productoId: number;
    nombre: string;
    tipo_producto: string;
    // Other fields...
}

interface InsumoWithStock {
    insumoId: number;
    productoId: number;
    productoNombre: string;
    cantidadRequerida: number;
    stockActual: number;
}

export default function CrearOrdenes() {

    const toast = useToast();

    const [canProduce, setCanProduce] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState<ProductoWithInsumos | null>(null);
    const [observaciones, setObservaciones] = useState('');
    const [responsableId, setResponsableId] = useState(1);

    const handleCrearOrden = async () => {
        if (selectedProducto) {
            try {
                const ordenProduccion = {
                    productoId: selectedProducto.producto.productoId,
                    responsableId: responsableId,
                    observaciones: observaciones,
                };
                await axios.post('/produccion/save', ordenProduccion);
                //const response = await axios.post('/produccion/save', ordenProduccion);
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
        }
    };

    return (
        <VStack align="stretch">
            <RecetaPicker setCanProduce={setCanProduce} setSelectedProducto={setSelectedProducto} />
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
