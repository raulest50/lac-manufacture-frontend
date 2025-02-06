// src/components/ActualizarEstadoOrdenCompraDialog.tsx
import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Box,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Input,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from '../../../api/EndPointsURL';
import { OrdenCompra, getEstadoText, getCondicionPagoText } from '../types';

interface ActualizarEstadoOrdenCompraDialogProps {
    isOpen: boolean;
    onClose: () => void;
    orden: OrdenCompra;
    onEstadoUpdated?: (updatedOrden: OrdenCompra) => void;
}

const ActualizarEstadoOrdenCompraDialog: React.FC<ActualizarEstadoOrdenCompraDialogProps> = ({ isOpen, onClose, orden, onEstadoUpdated }) => {
    const toast = useToast();

    // Generate a random 7-digit code and hold the user input.
    const [randomCode, setRandomCode] = useState<string>('');
    const [inputCode, setInputCode] = useState<string>('');

    // For estado 1 and 2, keep a local copy of the items (to update precioCorrecto or to check cantidadCorrecta)
    const [localItems, setLocalItems] = useState(orden.itemsOrdenCompra);

    // Generate random code on open
    useEffect(() => {
        if (isOpen) {
            const code = Math.floor(1000000 + Math.random() * 9000000).toString();
            setRandomCode(code);
            setInputCode('');
            // Clone the items array for local updates.
            setLocalItems(orden.itemsOrdenCompra);
        }
    }, [isOpen, orden.itemsOrdenCompra]);

    // Function to update order estado via backend.
    const updateEstado = async (newEstado: number) => {
        try {
            const response = await axios.put(
                `${EndPointsURL.getDomain()}/compras/orden_compra/${orden.ordenCompraId}/updateEstado`,
                { newEstado }
            );
            toast({
                title: "Estado actualizado",
                description: "La orden ha sido actualizada exitosamente.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            if (onEstadoUpdated) onEstadoUpdated(response.data);
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo actualizar el estado de la orden.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        onClose();
    };

    // Handlers for the confirmation buttons in different estados.
    const handleConfirmacionProveedor = () => {
        if (inputCode === randomCode) {
            updateEstado(1);
        } else {
            toast({
                title: "Código incorrecto",
                description: "La operación no se ejecutó, el número aleatorio no coincide.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            onClose();
        }
    };

    const handleConfirmarPrecios = () => {
        if (inputCode === randomCode) {
            updateEstado(2);
        } else {
            toast({
                title: "Código incorrecto",
                description: "La operación no se ejecutó, el número aleatorio no coincide.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            onClose();
        }
    };

    const handleCerrarOrden = () => {
        if (inputCode === randomCode) {
            updateEstado(3);
        } else {
            toast({
                title: "Código incorrecto",
                description: "La operación no se ejecutó, el número aleatorio no coincide.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            onClose();
        }
    };

    // For estado 1: Mark precioCorrecto for an item.
    const markPrecioCorrecto = (index: number) => {
        const updatedItems = localItems?.map((item, idx) => {
            if (idx === index) {
                return { ...item, precioCorrecto: 1 };
            }
            return item;
        });
        setLocalItems(updatedItems);
    };

    // For estado 2: Check that all items have cantidadCorrecta == 1.
    const allCantidadCorrecta = () => {
        return localItems?.every(item => item.cantidadCorrecta === 1);
    };

    // For estado 1: Check that all items have precioCorrecto == 1.
    const allPrecioCorrecto = () => {
        return localItems?.every(item => item.precioCorrecto === 1);
    };

    // Render different content based on the current estado.
    const renderContent = () => {
        if (orden.estado === -1) {
            return (
                <Box textAlign="center" py={4}>
                    <Text>Esta Orden ya ha sido cancelada y no se puede alterar más su estado.</Text>
                    <Button mt={4} colorScheme="blue" onClick={onClose}>Cerrar</Button>
                </Box>
            );
        }
        if (orden.estado === 3) {
            return (
                <Box textAlign="center" py={4}>
                    <Text>Esta Orden de compra fue cerrada exitosamente y ya no se puede cambiar su estado.</Text>
                    <Button mt={4} colorScheme="blue" onClick={onClose}>Cerrar</Button>
                </Box>
            );
        }
        if (orden.estado === 0) {
            // Display order details as in your original OrdenCompraDetails and then a random code input for confirmación proveedor.
            return (
                <>
                    <Box mb={4}>
                        <Text><strong>ID:</strong> {orden.ordenCompraId}</Text>
                        <Text><strong>Fecha Emisión:</strong> {orden.fechaEmision ? new Date(orden.fechaEmision).toLocaleString() : '-'}</Text>
                        <Text><strong>Fecha Vencimiento:</strong> {orden.fechaVencimiento ? new Date(orden.fechaVencimiento).toLocaleDateString() : '-'}</Text>
                        <Text><strong>Proveedor:</strong> {orden.proveedor ? orden.proveedor.nombre : '-'}</Text>
                        <Text><strong>Total a Pagar:</strong> {orden.totalPagar}</Text>
                        <Text><strong>Estado:</strong> {getEstadoText(orden.estado)}</Text>
                        <Text><strong>Condición de Pago:</strong> {getCondicionPagoText(orden.condicionPago)}</Text>
                        <Text><strong>Tiempo de Entrega:</strong> {orden.tiempoEntrega}</Text>
                        <Text><strong>Plazo de Pago:</strong> {orden.plazoPago}</Text>
                    </Box>
                    {orden.itemsOrdenCompra && orden.itemsOrdenCompra.length > 0 && (
                        <Box>
                            <Text fontWeight="bold" mb={2}>Items de la Orden</Text>
                            <Table variant="simple" size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>ID</Th>
                                        <Th>Materia Prima</Th>
                                        <Th>Cantidad</Th>
                                        <Th>Precio Unitario</Th>
                                        <Th>IVA</Th>
                                        <Th>Subtotal</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {orden.itemsOrdenCompra.map((item) => (
                                        <Tr key={item.itemOrdenId}>
                                            <Td>{item.itemOrdenId}</Td>
                                            <Td>{item.materiaPrima ? `${item.materiaPrima.productoId} - ${item.materiaPrima.nombre}` : '-'}</Td>
                                            <Td>{item.cantidad}</Td>
                                            <Td>{item.precioUnitario}</Td>
                                            <Td>{item.iva19}</Td>
                                            <Td>{item.subTotal}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                    <Box mt={4} textAlign="center">
                        <Text fontWeight="bold">Código: {randomCode}</Text>
                        <Input
                            mt={2}
                            placeholder="Digite el código"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            maxW="200px"
                            mx="auto"
                        />
                        <Button mt={4} colorScheme="green" onClick={handleConfirmacionProveedor}>
                            Confirmación Proveedor
                        </Button>
                    </Box>
                </>
            );
        }
        if (orden.estado === 1) {
            // For estado 1, show details plus for each item an "OK" button to mark precioCorrecto.
            return (
                <>
                    <Box mb={4}>
                        <Text><strong>ID:</strong> {orden.ordenCompraId}</Text>
                        <Text><strong>Fecha Emisión:</strong> {orden.fechaEmision ? new Date(orden.fechaEmision).toLocaleString() : '-'}</Text>
                        <Text><strong>Fecha Vencimiento:</strong> {orden.fechaVencimiento ? new Date(orden.fechaVencimiento).toLocaleDateString() : '-'}</Text>
                        <Text><strong>Proveedor:</strong> {orden.proveedor ? orden.proveedor.nombre : '-'}</Text>
                        <Text><strong>Total a Pagar:</strong> {orden.totalPagar}</Text>
                        <Text><strong>Estado:</strong> {getEstadoText(orden.estado)}</Text>
                        <Text><strong>Condición de Pago:</strong> {getCondicionPagoText(orden.condicionPago)}</Text>
                        <Text><strong>Tiempo de Entrega:</strong> {orden.tiempoEntrega}</Text>
                        <Text><strong>Plazo de Pago:</strong> {orden.plazoPago}</Text>
                    </Box>
                    {orden.itemsOrdenCompra && orden.itemsOrdenCompra.length > 0 && (
                        <Box>
                            <Text fontWeight="bold" mb={2}>Items de la Orden</Text>
                            <Table variant="simple" size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>ID</Th>
                                        <Th>Materia Prima</Th>
                                        <Th>Cantidad</Th>
                                        <Th>Precio Unitario</Th>
                                        <Th>IVA</Th>
                                        <Th>Subtotal</Th>
                                        <Th>Confirmar Precio</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {localItems && localItems.map((item, index) => (
                                        <Tr key={item.itemOrdenId}>
                                            <Td>{item.itemOrdenId}</Td>
                                            <Td>{item.materiaPrima ? `${item.materiaPrima.productoId} - ${item.materiaPrima.nombre}` : '-'}</Td>
                                            <Td>{item.cantidad}</Td>
                                            <Td>{item.precioUnitario}</Td>
                                            <Td>{item.iva19}</Td>
                                            <Td>{item.subTotal}</Td>
                                            <Td>
                                                <Button size="xs" colorScheme="blue" onClick={() => markPrecioCorrecto(index)}>
                                                    OK
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                    <Box mt={4} textAlign="center">
                        <Text fontWeight="bold">Código: {randomCode}</Text>
                        <Input
                            mt={2}
                            placeholder="Digite el código"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            maxW="200px"
                            mx="auto"
                        />
                        <Button
                            mt={4}
                            colorScheme="green"
                            onClick={handleConfirmarPrecios}
                            isDisabled={!allPrecioCorrecto()}
                        >
                            Confirmar Precios Concuerdan
                        </Button>
                    </Box>
                </>
            );
        }
        if (orden.estado === 2) {
            // For estado 2, show a simplified table (ID, Materia Prima, cantidadCorrecta)
            return (
                <>
                    <Box mb={4}>
                        <Text><strong>ID:</strong> {orden.ordenCompraId}</Text>
                        <Text><strong>Fecha Emisión:</strong> {orden.fechaEmision ? new Date(orden.fechaEmision).toLocaleString() : '-'}</Text>
                        <Text><strong>Fecha Vencimiento:</strong> {orden.fechaVencimiento ? new Date(orden.fechaVencimiento).toLocaleDateString() : '-'}</Text>
                        <Text><strong>Proveedor:</strong> {orden.proveedor ? orden.proveedor.nombre : '-'}</Text>
                        <Text><strong>Total a Pagar:</strong> {orden.totalPagar}</Text>
                        <Text><strong>Estado:</strong> {getEstadoText(orden.estado)}</Text>
                        <Text><strong>Condición de Pago:</strong> {getCondicionPagoText(orden.condicionPago)}</Text>
                        <Text><strong>Tiempo de Entrega:</strong> {orden.tiempoEntrega}</Text>
                        <Text><strong>Plazo de Pago:</strong> {orden.plazoPago}</Text>
                    </Box>
                    {orden.itemsOrdenCompra && orden.itemsOrdenCompra.length > 0 && (
                        <Box>
                            <Text fontWeight="bold" mb={2}>Items de la Orden (Cantidad Correcta)</Text>
                            <Table variant="simple" size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>ID</Th>
                                        <Th>Materia Prima</Th>
                                        <Th>Cantidad Correcta</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {localItems && localItems.map((item) => (
                                        <Tr key={item.itemOrdenId}>
                                            <Td>{item.itemOrdenId}</Td>
                                            <Td>{item.materiaPrima ? `${item.materiaPrima.productoId} - ${item.materiaPrima.nombre}` : '-'}</Td>
                                            <Td>{item.cantidadCorrecta}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                    <Box mt={4} textAlign="center">
                        <Text fontWeight="bold">Código: {randomCode}</Text>
                        <Input
                            mt={2}
                            placeholder="Digite el código"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            maxW="200px"
                            mx="auto"
                        />
                        <Button
                            mt={4}
                            colorScheme="green"
                            onClick={handleCerrarOrden}
                            isDisabled={!allCantidadCorrecta()}
                        >
                            Cerrar Orden De Compra Exitosamente
                        </Button>
                    </Box>
                </>
            );
        }
        return null;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Actualizar Estado de la Orden de Compra</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {renderContent()}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={onClose}>Cerrar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ActualizarEstadoOrdenCompraDialog;
