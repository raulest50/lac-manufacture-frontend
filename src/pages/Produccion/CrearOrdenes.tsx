// src/pages/ProduccionPage/CrearOrdenes.tsx

import { useState } from 'react';
import {
    Textarea,
    Select,
    Button,
    VStack,
    Card,
    CardHeader,
    CardBody,
    Heading,
    Text,
    Box,
    Divider,
    Flex,
    Tag,
    useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import {ProductoWithInsumos} from "./types";
import EndPointsURL from "../../api/EndPointsURL";
import TerminadoSemiterminadoPicker from "./components/TerminadoSemiterminadoPicker";

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
            <Card>
                <CardHeader>
                    <Heading size="md">Producto terminado</Heading>
                </CardHeader>
                <CardBody>
                    <VStack align="stretch" spacing={4}>
                        {selectedProducto ? (
                            <VStack align='stretch' spacing={2}>
                                <Heading size='sm'>{selectedProducto.producto.nombre}</Heading>
                                <Text fontSize='sm' color='gray.600'>ID: {selectedProducto.producto.productoId}</Text>
                                <Divider/>
                                <VStack align='stretch' spacing={2}>
                                    <Text fontWeight='medium'>Insumos requeridos</Text>
                                    {selectedProducto.insumos.length === 0 ? (
                                        <Text fontSize='sm' color='gray.500'>No se registran insumos para este producto.</Text>
                                    ) : (
                                        selectedProducto.insumos.map(insumo => {
                                            const tieneStock = insumo.stockActual >= insumo.cantidadRequerida;
                                            return (
                                                <Flex
                                                    key={insumo.insumoId}
                                                    justify='space-between'
                                                    align='center'
                                                    p={2}
                                                    borderWidth='1px'
                                                    borderRadius='md'
                                                    borderColor={tieneStock ? 'green.200' : 'red.200'}
                                                    bg={tieneStock ? 'green.50' : 'red.50'}
                                                >
                                                    <Box>
                                                        <Text fontSize='sm' fontWeight='medium'>{insumo.productoNombre}</Text>
                                                        <Text fontSize='xs' color='gray.600'>Requerido: {insumo.cantidadRequerida}</Text>
                                                    </Box>
                                                    <Tag colorScheme={tieneStock ? 'green' : 'red'}>
                                                        Stock: {insumo.stockActual}
                                                    </Tag>
                                                </Flex>
                                            );
                                        })
                                    )}
                                </VStack>
                                <Text fontWeight='medium' color={canProduce ? 'green.600' : 'red.600'}>
                                    {canProduce
                                        ? 'Stock suficiente para producir este producto.'
                                        : 'Stock insuficiente en al menos un insumo.'}
                                </Text>
                            </VStack>
                        ) : (
                            <Text>Ningún producto seleccionado.</Text>
                        )}
                        <Button colorScheme="blue" onClick={handleSeleccionarProducto}>
                            Seleccionar producto terminado
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
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
