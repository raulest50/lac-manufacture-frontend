// OrdenCompraDetails.tsx
import React from 'react';
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
    Td, Tfoot
} from '@chakra-ui/react';
import {getCondicionPagoText, getEstadoText, OrdenCompraMateriales} from '../types';

interface OrdenCompraDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    orden: OrdenCompraMateriales;
}

const OrdenCompraDetails: React.FC<OrdenCompraDetailsProps> = ({ isOpen, onClose, orden }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Detalles de la Orden de Compra</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box mb={4}>
                        <Text><strong>ID:</strong> {orden.ordenCompraId}</Text>
                        <Text>
                            <strong>Fecha Emisión:</strong>{' '}
                            {orden.fechaEmision ? new Date(orden.fechaEmision).toLocaleString() : '-'}
                        </Text>
                        <Text>
                            <strong>Fecha Vencimiento:</strong>{' '}
                            {orden.fechaVencimiento ? new Date(orden.fechaVencimiento).toLocaleDateString() : '-'}
                        </Text>
                        <Text>
                            <strong>Proveedor:</strong>{' '}
                            {orden.proveedor ? orden.proveedor.nombre : '-'}
                        </Text>
                        <Text><strong>Total a Pagar:</strong> {orden.totalPagar}</Text>
                        <Text><strong>Estado:</strong> {getEstadoText(orden.estado)}</Text>
                        <Text><strong>Condición de Pago:</strong> {getCondicionPagoText(orden.condicionPago)}</Text>
                        <Text><strong>Tiempo de Entrega:</strong> {orden.tiempoEntrega}</Text>
                        <Text><strong>Plazo de Pago:</strong> {orden.plazoPago}</Text>
                    </Box>
                    <Box>
                        <Text fontWeight="bold" mb={2}>Items de la Orden</Text>
                        {orden.itemsOrdenCompra && orden.itemsOrdenCompra.length > 0 ? (
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
                                            <Td>{item.materiaPrima ? `${item.materiaPrima.productoId} - ${item.materiaPrima.nombre} - (${item.materiaPrima.tipoUnidades}) ` : '-'}</Td>
                                            <Td>{item.cantidad}</Td>
                                            <Td>{item.precioUnitario}</Td>
                                            <Td>{item.iva19}</Td>
                                            <Td>{item.subTotal}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                                <Tfoot>
                                    <Tr>
                                        <Td colSpan={4} textAlign="right">
                                            <strong>SubTotal:</strong>
                                        </Td>
                                        <Td isNumeric colSpan={3}>
                                            {orden.subTotal}
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td colSpan={4} textAlign="right">
                                            <strong>IVA (19%):</strong>
                                        </Td>
                                        <Td isNumeric colSpan={3}>
                                            {orden.iva19}
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td colSpan={4} textAlign="right">
                                            <strong>Total a Pagar:</strong>
                                        </Td>
                                        <Td isNumeric colSpan={3}>
                                            {orden.totalPagar}
                                        </Td>
                                    </Tr>
                                </Tfoot>
                            </Table>
                        ) : (
                            <Text>No hay items en esta orden.</Text>
                        )}
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default OrdenCompraDetails;
