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
    useToast,
    HStack, VStack, FormControl, FormLabel
} from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from '../../../api/EndPointsURL';
import { OrdenCompra, getEstadoText, getCondicionPagoText, getCantidadCorrectaText } from '../types';

interface ActualizarEstadoOrdenCompraDialogProps {
    isOpen: boolean;
    onClose: () => void;
    orden: OrdenCompra;
    onEstadoUpdated?: (updatedOrden: OrdenCompra) => void;
}

const ActualizarEstadoOrdenCompraDialog: React.FC<ActualizarEstadoOrdenCompraDialogProps> = ({
                                                                                                 isOpen,
                                                                                                 onClose,
                                                                                                 orden,
                                                                                                 onEstadoUpdated
                                                                                             }) => {
    const toast = useToast();

    // Generate a random 7-digit code and hold the user input.
    const [randomCode, setRandomCode] = useState<string>('');
    const [inputCode, setInputCode] = useState<string>('');
    // New state for storing the FacturaCompra id input (used when estado is 0).
    const [facturaIdInput, setFacturaIdInput] = useState<string>('');

    // For estados 1 and 2, keep a local copy of the items (to update precioCorrecto or check cantidadCorrecta).
    const [localItems, setLocalItems] = useState(orden.itemsOrdenCompra);

    /**
     * Cada item de la orden de compra debe tener cantidadCorrecta = 1 para que se considere
     * recibida en bodega y se pueda proceder al cierre de la orden.
     */
    const [cantidadesFisicasOk, setCantidadesFisicasOk] = useState(false);

    const checkVerificacionFisica = () => {
        let cantidadIsOk = true;
        for (let i = 0; i < localItems.length; i++) {
            if (localItems[i].cantidadCorrecta !== 1) cantidadIsOk = false;
        }
        setCantidadesFisicasOk(cantidadIsOk);
    };

    // Generate a random code and reset inputs when the modal opens.
    useEffect(() => {
        checkVerificacionFisica();
        if (isOpen) {
            const code = Math.floor(1000000 + Math.random() * 9000000).toString();
            setRandomCode(code);
            setInputCode('');
            setFacturaIdInput('');
            // Clone the items array for local updates.
            setLocalItems(orden.itemsOrdenCompra);
        }
    }, [isOpen, orden.itemsOrdenCompra]);

    interface EstadoUpdate{
        newEstado: number;
        facturaCompraId?: number;
    }

    // Function to update order estado via backend.
    // When newEstado === 1 and a facturaId is provided, include it in the request.
    const updateEstado = async (newEstado: number, facturaId?: string) => {
        try {
            const requestBody:EstadoUpdate = { newEstado: newEstado };
            if (newEstado === 1 && facturaId) {
                requestBody.facturaCompraId = parseInt(facturaId, 10);
            }
            const response = await axios.put(
                `${EndPointsURL.getDomain()}/compras/orden_compra/${orden.ordenCompraId}/updateEstado`,
                requestBody
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

    // Handler for confirmar proveedor (estado transition from 0 to 1).
    // It passes the facturaCompra id along with the confirmation token.
    const handleConfirmacionProveedor = () => {
        if (inputCode === randomCode) {
            updateEstado(1, facturaIdInput);
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

    // Handler for confirming precios (estado 1 -> 2).
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

    // Handler for closing the order (estado 2 -> 3).
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

    // For estado 2: Check that all items have cantidadCorrecta === 1.
    const allCantidadCorrecta = () => {
        return localItems?.every(item => item.cantidadCorrecta === 1);
    };

    // For estado 1: Check that all items have precioCorrecto === 1.
    const allPrecioCorrecto = () => {
        return localItems?.every(item => item.precioCorrecto === 1);
    };

    function OrdenDetailsComponent(){
        return(
            <>
                <Box mb={4}>
                    <Text><strong>ID:</strong> {orden.ordenCompraId}</Text>
                    <Text><strong>Fecha Emisión:</strong> {orden.fechaEmision ? new Date(orden.fechaEmision).toLocaleString() : '-'}</Text>
                    <Text><strong>Fecha Vencimiento:</strong> {orden.fechaVencimiento ? new Date(orden.fechaVencimiento).toLocaleDateString() : '-'}</Text>
                    <Text><strong>Id Factura Correspondiente:</strong> {orden.facturaCompraId ? orden.facturaCompraId : 'Pendiente por asignacion proveedor'}</Text>
                    <Text><strong>Proveedor:</strong> {orden.proveedor ? orden.proveedor.nombre : '-'}</Text>
                    <Text><strong>Total a Pagar:</strong> {orden.totalPagar}</Text>
                    <Text><strong>Estado:</strong> {getEstadoText(orden.estado)}</Text>
                    <Text><strong>Condición de Pago:</strong> {getCondicionPagoText(orden.condicionPago)}</Text>
                    <Text><strong>Tiempo de Entrega:</strong> {orden.tiempoEntrega}</Text>
                    <Text><strong>Plazo de Pago:</strong> {orden.plazoPago}</Text>
                </Box>
            </>
        )
    }

    // Component to render the order details and items table.
    function OrdenCompraItemListComponent() {
        return (
            <>
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
                                    <Th hidden={orden.estado !== 1}>Confirmar Precio</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {localItems && localItems.map((item, index) => (
                                    <Tr key={item.itemOrdenId}>
                                        <Td>{item.itemOrdenId}</Td>
                                        <Td>{item.materiaPrima ? `${item.materiaPrima.productoId} - ${item.materiaPrima.nombre}` : '-'}</Td>
                                        <Td hidden={orden.estado === 2}>{item.cantidad}</Td>
                                        <Td hidden={orden.estado === 2}>{item.precioUnitario}</Td>
                                        <Td hidden={orden.estado === 2}>{item.iva19}</Td>
                                        <Td hidden={orden.estado === 2}>{item.subTotal}</Td>
                                        <Td>
                                            <Button
                                                hidden={orden.estado !== 1}
                                                size="xs"
                                                colorScheme="blue"
                                                isDisabled={item.precioCorrecto === 1}
                                                onClick={() => markPrecioCorrecto(index)}
                                            >
                                                {item.precioCorrecto === 1 ? "Correcto" : "OK"}
                                            </Button>
                                        </Td>
                                        <Td hidden={orden.estado!=2}>{getCantidadCorrectaText(item.cantidadCorrecta)}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                )}
            </>
        );
    }

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
            // Estado 0: show full order details plus an extra input for FacturaCompra id and token confirmation.
            return (
                <>
                    <OrdenDetailsComponent />
                    <OrdenCompraItemListComponent/>

                    <Box mt={4} textAlign="center" p="1em" >
                        <HStack justifyContent={"center"} alignItems="flex-start" mt={2} >
                            <VStack alignItems="center" mt={2} >
                                <FormControl isRequired>
                                    <FormLabel>Id Factura Reportada por Proveedor</FormLabel>
                                    <Input
                                        placeholder="Digite ID de Factura"
                                        value={facturaIdInput}
                                        onChange={(e) => setFacturaIdInput(e.target.value)}
                                        maxW="200px"
                                    />
                                </FormControl>
                            </VStack>

                            <VStack alignItems="center" mt={2} >
                                <Text fontWeight="bold">Token dinámico de confirmación: {randomCode}</Text>
                                <FormControl isRequired>
                                    <FormLabel>Token Dinamico de Confirmacion:</FormLabel>
                                    <Input
                                        placeholder="Digite token dinámico"
                                        value={inputCode}
                                        onChange={(e) => setInputCode(e.target.value)}
                                        maxW="200px"
                                    />
                                </FormControl>
                                <Button colorScheme="green" onClick={handleConfirmacionProveedor}>
                                    Confirmación Proveedor
                                </Button>
                            </VStack>
                        </HStack>
                    </Box>
                </>
            );
        }
        if (orden.estado === 1) {
            // Estado 1: show order details with token confirmation for precios.
            return (
                <>
                    <OrdenDetailsComponent />
                    <OrdenCompraItemListComponent/>
                    <Box mt={4} textAlign="center">
                        <Text fontWeight="bold">Código: {randomCode}</Text>
                        <HStack p="1em">
                            <Input
                                placeholder="Digite el código"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                maxW="200px"
                            />
                            <Button
                                colorScheme="green"
                                onClick={handleConfirmarPrecios}
                                isDisabled={!allPrecioCorrecto()}
                            >
                                Confirmar Precios Concuerdan
                            </Button>
                        </HStack>
                    </Box>
                </>
            );
        }
        if (orden.estado === 2) {
            // Estado 2: show simplified order details (info and a table with only cantidadCorrecta) and token confirmation for cerrar la orden.
            return (
                <>
                    <OrdenDetailsComponent />
                    <OrdenCompraItemListComponent/>

                    <Box mt={4} textAlign="center">
                        <Text fontWeight="bold" hidden={cantidadesFisicasOk}>En espera del reporte de almacén</Text>
                        <Text fontWeight="bold" hidden={!cantidadesFisicasOk}>Token dinámico de confirmación: {randomCode}</Text>
                        <HStack hidden={!cantidadesFisicasOk}>
                            <Input
                                placeholder="Digite token dinámico"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                maxW="200px"
                            />
                            <Button
                                colorScheme="green"
                                onClick={handleCerrarOrden}
                                isDisabled={!allCantidadCorrecta()}
                            >
                                Cerrar Orden De Compra Exitosamente
                            </Button>
                        </HStack>
                    </Box>
                </>
            );
        }
        return null;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={["auto", "4xl"]} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Actualizar Estado de la Orden de Compra</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{renderContent()}</ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={onClose}>Cerrar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ActualizarEstadoOrdenCompraDialog;
