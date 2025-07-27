import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    Input,
    useToast,
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Tfoot
} from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from '../../../../api/EndPointsURL';
import { OrdenCompraActivo, getEstadoOCAFText } from '../../types';
import { formatCOP } from '../../../../utils/formatters';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    orden: OrdenCompraActivo;
    onOrdenCancelada?: () => void;
}

const DialogCancelarOCAF: React.FC<Props> = ({ isOpen, onClose, orden, onOrdenCancelada }) => {
    const [randomCode, setRandomCode] = useState('');
    const [inputCode, setInputCode] = useState('');
    const toast = useToast();
    const endpoints = new EndPointsURL();

    useEffect(() => {
        if (isOpen) {
            const code = Math.floor(1000000 + Math.random() * 9000000).toString();
            setRandomCode(code);
            setInputCode('');
        }
    }, [isOpen]);

    const handleCancelar = async () => {
        if (inputCode !== randomCode) {
            toast({
                title: 'Código incorrecto',
                description: 'El código ingresado no coincide.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        try {
            await axios.put(
                endpoints.cancel_orden_compra_activo.replace('{ordenCompraActivoId}', String(orden.ordenCompraActivoId))
            );
            toast({
                title: 'Orden cancelada',
                description: 'La orden de compra fue cancelada correctamente.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            if (onOrdenCancelada) onOrdenCancelada();
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'No se pudo cancelar la orden.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirmar Cancelación</ModalHeader>
                <ModalBody>
                    {/* Detalles de la orden */}
                    <Box mb={4}>
                        <Text><strong>ID:</strong> {orden.ordenCompraActivoId}</Text>
                        <Text><strong>Fecha Emisión:</strong> {orden.fechaEmision ? new Date(orden.fechaEmision).toLocaleString() : '-'}</Text>
                        <Text><strong>Fecha Vencimiento:</strong> {orden.fechaVencimiento ? new Date(orden.fechaVencimiento).toLocaleDateString() : '-'}</Text>
                        <Text><strong>Proveedor:</strong> {orden.proveedor?.nombre ?? '-'}</Text>
                        <Text><strong>Total a Pagar:</strong> {formatCOP(orden.totalPagar)}</Text>
                        <Text><strong>Estado:</strong> {getEstadoOCAFText(orden.estado)}</Text>
                    </Box>

                    {/* Tabla de items */}
                    {orden.itemsOrdenCompra && orden.itemsOrdenCompra.length > 0 ? (
                        <Table variant='simple' size='sm' mb={4}>
                            <Thead>
                                <Tr>
                                    <Th>Descripción</Th>
                                    <Th isNumeric>Cantidad</Th>
                                    <Th isNumeric>Precio Unitario</Th>
                                    <Th isNumeric>Subtotal</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {orden.itemsOrdenCompra.map(item => (
                                    <Tr key={item.itemOrdenId}>
                                        <Td>{item.nombre}</Td>
                                        <Td isNumeric>{item.cantidad}</Td>
                                        <Td isNumeric>{formatCOP(item.precioUnitario)}</Td>
                                        <Td isNumeric>{formatCOP(item.subTotal)}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                            <Tfoot>
                                <Tr>
                                    <Td colSpan={3} textAlign='right'><strong>Total a Pagar:</strong></Td>
                                    <Td isNumeric>{formatCOP(orden.totalPagar)}</Td>
                                </Tr>
                            </Tfoot>
                        </Table>
                    ) : (
                        <Text mb={4}>No hay items en esta orden.</Text>
                    )}

                    {/* Confirmación de cancelación */}
                    <Text mb={4}>
                        Para confirmar la cancelación de la orden de compra, digite los 7 dígitos que ve a continuación y presione "Cancelar Orden".
                    </Text>
                    <Text fontWeight="bold" mb={4}>Código: {randomCode}</Text>
                    <Input
                        placeholder="Ingrese el código"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={handleCancelar}>
                        Cancelar Orden
                    </Button>
                    <Button variant='ghost' onClick={onClose}>Atrás</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DialogCancelarOCAF;
