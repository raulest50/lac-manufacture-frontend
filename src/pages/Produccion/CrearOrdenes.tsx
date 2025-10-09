// src/pages/ProduccionPage/CrearOrdenes.tsx

import { useState } from 'react';
import {
    Textarea,
    Select,
    Button,
    VStack,
    useToast,
    FormControl,
    FormLabel,
    Input,
    HStack,
    Box,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
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
    const [numeroPedido, setNumeroPedido] = useState('');
    const [area, setArea] = useState('');
    const [departamento, setDepartamento] = useState('');

    // Nuevos estados para las fechas y el lote
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFinalizacion, setFechaFinalizacion] = useState('');
    const [lote, setLote] = useState('');

    // Estado para la cantidad a producir (número de lotes)
    const [numeroLotes, setNumeroLotes] = useState(1);

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
                    fechaInicio: fechaInicio,
                    fechaFinalizacionTeorica: fechaFinalizacion,
                    lote: lote,
                    numeroLotes: numeroLotes, // Agregar el número de lotes a producir
                    numeroPedido: numeroPedido, // Agregar el número de pedido
                    area: area, // Agregar el área
                    departamento: departamento, // Agregar el departamento
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
                setFechaInicio('');
                setFechaFinalizacion('');
                setLote('');
                setNumeroLotes(1); // Resetear el número de lotes
                setNumeroPedido(''); // Resetear el número de pedido
                setArea(''); // Resetear el área
                setDepartamento(''); // Resetear el departamento
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

            <HStack spacing={4} mt="4">
                <FormControl>
                    <FormLabel>Asesor</FormLabel>
                    <Select
                        value={responsableId}
                        onChange={(e) => setResponsableId(Number(e.target.value))}
                    >
                        <option value={1}>Vendedor 1</option>
                        <option value={2}>Vendedor 2</option>
                    </Select>
                </FormControl>

                <FormControl>
                    <FormLabel>Numero de pedido</FormLabel>
                    <Input
                        placeholder="Ingrese el número de pedido"
                        value={numeroPedido}
                        onChange={(e) => setNumeroPedido(e.target.value)}
                    />
                </FormControl>
            </HStack>

            {/* Nuevos campos para fechas */}
            <HStack spacing={4} mt="4">
                <FormControl>
                    <FormLabel>Fecha de inicio</FormLabel>
                    <Input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Fecha teórica de finalización</FormLabel>
                    <Input
                        type="date"
                        value={fechaFinalizacion}
                        onChange={(e) => setFechaFinalizacion(e.target.value)}
                    />
                </FormControl>
            </HStack>

            {/* Campos para lote y cantidad a producir */}
            <HStack spacing={4} mt="4">
                <FormControl>
                    <FormLabel>Lote</FormLabel>
                    <Input
                        placeholder="Ingrese el número de lote"
                        value={lote}
                        onChange={(e) => setLote(e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Cantidad a producir</FormLabel>
                    <NumberInput 
                        min={1} 
                        value={numeroLotes} 
                        onChange={(valueString) => setNumeroLotes(Number(valueString))}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>
            </HStack>

            {/* Campos para área y departamento */}
            <HStack spacing={4} mt="4">
                <FormControl>
                    <FormLabel>Área</FormLabel>
                    <Input
                        placeholder="Ingrese el área"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Departamento</FormLabel>
                    <Input
                        placeholder="Ingrese el departamento"
                        value={departamento}
                        onChange={(e) => setDepartamento(e.target.value)}
                    />
                </FormControl>
            </HStack>

            <Textarea
                placeholder="Observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                mt="4"
            />
            <Button
                onClick={handleCrearOrden}
                isDisabled={!selectedProducto || !canProduce || !fechaInicio || !fechaFinalizacion || !lote || numeroLotes < 1}
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
