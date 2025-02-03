// ListaOrdenesCompra.tsx
import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box } from '@chakra-ui/react';
import { OrdenCompra } from '../types.tsx';

interface ListaOrdenesCompraProps {
    ordenes: OrdenCompra[];
}

const ListaOrdenesCompra: React.FC<ListaOrdenesCompraProps> = ({ ordenes }) => {
    return (
        <Box overflowX="auto" mt={4}>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Fecha Emisión</Th>
                        <Th>Fecha Vencimiento</Th>
                        <Th>Proveedor</Th>
                        <Th>Total a Pagar</Th>
                        <Th>Estado</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {ordenes.map((orden) => (
                        <Tr key={orden.ordenCompraId}>
                            <Td>{orden.ordenCompraId}</Td>
                            <Td>{orden.fechaEmision ? new Date(orden.fechaEmision).toLocaleString() : '-'}</Td>
                            <Td>{orden.fechaVencimiento ? new Date(orden.fechaVencimiento).toLocaleDateString() : '-'}</Td>
                            <Td>{orden.proveedor ? orden.proveedor.nombre : '-'}</Td>
                            <Td>{orden.totalPagar}</Td>
                            <Td>{orden.estado}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default ListaOrdenesCompra;
