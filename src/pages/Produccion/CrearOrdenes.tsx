// src/pages/ProduccionPage/CrearOrdenes.tsx

import { useState } from 'react';
import {
    Textarea,
    Select,
    Button,
    VStack,
    useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import {ProductoWithInsumos} from "./types";
import EndPointsURL from "../../api/EndPointsURL";
import TerminadoSemiterminadoPicker from "./components/TerminadoSemiterminadoPicker";
import TerSemiTerCard from "./components/TerSemiTerCard";

const endPoints = new EndPointsURL();

export default function CrearOrdenes() {
    const toast = useToast();

    const [selectedProducto, setSelectedProducto] = useState<ProductoWithInsumos | null>(null);
    const [canProduce, setCanProduce] = useState(false);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [observaciones, setObservaciones] = useState('');
    const [responsableId, setResponsableId] = useState(1);

    const handleSeleccionarProducto = () => {
        setIsPickerOpen(true);
    };

    const handleCrearOrden = async () => {
        if (selectedProducto && canProduce) {
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
                setCanProduce(false);
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
        }
    };

    const handlePickerConfirm = (producto: ProductoWithInsumos, canProduceFlag: boolean) => {
        setSelectedProducto(producto);
        setCanProduce(canProduceFlag);
        setIsPickerOpen(false);
    };

    const handlePickerClose = () => {
        setIsPickerOpen(false);
    };

    return (
        <VStack align="stretch">
            <TerSemiTerCard
                productoSeleccionado={selectedProducto}
                canProduce={canProduce}
                onSearchClick={handleSeleccionarProducto}
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
                isDisabled={!selectedProducto || !canProduce}
                mt="4"
                colorScheme="blue"
            >
                Crear Orden de Producción
            </Button>
            <TerminadoSemiterminadoPicker
                isOpen={isPickerOpen}
                onClose={handlePickerClose}
                onConfirm={handlePickerConfirm}
            />
        </VStack>
    );
}
