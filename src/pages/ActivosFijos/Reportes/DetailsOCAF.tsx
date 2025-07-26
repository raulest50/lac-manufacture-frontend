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
    Td,
    Tfoot
} from '@chakra-ui/react';
import { OrdenCompraActivo, getEstadoOCAFText } from '../types';
import { formatCOP } from '../../../utils/formatters';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    orden: OrdenCompraActivo;
}

const DetailsOCAF: React.FC<Props> = ({ isOpen, onClose, orden }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size='xl' scrollBehavior='inside'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Detalles Orden Compra AF</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box mb={4}>
                        <Text><strong>ID:</strong> {orden.ordenCompraActivoId}</Text>
                        <Text><strong>Fecha Emisión:</strong> {orden.fechaEmision ? new Date(orden.fechaEmision).toLocaleString() : '-'}</Text>
                        <Text><strong>Fecha Vencimiento:</strong> {orden.fechaVencimiento ? new Date(orden.fechaVencimiento).toLocaleDateString() : '-'}</Text>
                        <Text><strong>Proveedor:</strong> {orden.proveedor?.nombre ?? '-'}</Text>
                        <Text><strong>Total a Pagar:</strong> {formatCOP(orden.totalPagar)}</Text>
                        <Text><strong>Estado:</strong> {getEstadoOCAFText(orden.estado)}</Text>
                        <Text><strong>Condición de Pago:</strong> {orden.condicionPago}</Text>
                        <Text><strong>Tiempo de Entrega:</strong> {orden.tiempoEntrega}</Text>
                        <Text><strong>Plazo de Pago:</strong> {orden.plazoPago}</Text>
                    </Box>
                    {orden.itemsOrdenCompra && orden.itemsOrdenCompra.length > 0 ? (
                        <Table variant='simple' size='sm'>
                            <Thead>
                                <Tr>
                                    <Th>ID</Th>
                                    <Th>Descripción</Th>
                                    <Th isNumeric>Cantidad</Th>
                                    <Th isNumeric>Precio Unitario</Th>
                                    <Th isNumeric>IVA</Th>
                                    <Th isNumeric>Subtotal</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {orden.itemsOrdenCompra.map(item => (
                                    <Tr key={item.itemOrdenId}>
                                        <Td>{item.itemOrdenId}</Td>
                                        <Td>{item.nombre}</Td>
                                        <Td isNumeric>{item.cantidad}</Td>
                                        <Td isNumeric>{formatCOP(item.precioUnitario)}</Td>
                                        <Td isNumeric>{formatCOP(item.ivaValue)}</Td>
                                        <Td isNumeric>{formatCOP(item.subTotal)}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                            <Tfoot>
                                <Tr>
                                    <Td colSpan={4} textAlign='right'><strong>SubTotal:</strong></Td>
                                    <Td isNumeric colSpan={2}>{formatCOP(orden.subTotal)}</Td>
                                </Tr>
                                <Tr>
                                    <Td colSpan={4} textAlign='right'><strong>IVA:</strong></Td>
                                    <Td isNumeric colSpan={2}>{formatCOP(orden.iva)}</Td>
                                </Tr>
                                <Tr>
                                    <Td colSpan={4} textAlign='right'><strong>Total a Pagar:</strong></Td>
                                    <Td isNumeric colSpan={2}>{formatCOP(orden.totalPagar)}</Td>
                                </Tr>
                            </Tfoot>
                        </Table>
                    ) : (
                        <Text>No hay items en esta orden.</Text>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>Cerrar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DetailsOCAF;
