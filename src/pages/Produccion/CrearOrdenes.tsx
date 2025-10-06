// src/pages/ProduccionPage/CrearOrdenes.tsx

import { useState } from 'react';
import { Textarea, Select, Button, VStack } from '@chakra-ui/react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { ProductoWithInsumos } from './types.tsx';
import EndPointsURL from '../../api/EndPointsURL.tsx';
import ProductoTerminadoCard from './components/ProductoTerminadoCard';

const endPoints = new EndPointsURL();

export default function CrearOrdenes() {
    const toast = useToast();

    const [selectedProducto, setSelectedProducto] = useState<ProductoWithInsumos | null>(null);
    const [observaciones, setObservaciones] = useState('');
    const [responsableId, setResponsableId] = useState(1);

    const handleSeleccionarProducto = () => {
        toast({
            title: 'Seleccionar producto terminado',
            description: 'La selección de productos estará disponible próximamente.',
            status: 'info',
            duration: 5000,
            isClosable: true,
        });
        // TODO: Implementar lógica de selección de producto terminado.
    };

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
            <ProductoTerminadoCard
                selectedProducto={selectedProducto}
                onPickClick={handleSeleccionarProducto}
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
                isDisabled={!selectedProducto}
                mt="4"
                colorScheme="blue"
            >
                Crear Orden de Producción
            </Button>
        </VStack>
    );
}
