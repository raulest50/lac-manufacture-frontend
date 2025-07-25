import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box
} from '@chakra-ui/react';
import { OrdenCompraActivo, getEstadoOCAFText } from '../types';
import { formatCOP } from '../../../utils/formatters';

interface Props {
    ordenes: OrdenCompraActivo[];
}

const ListaOrdenesOCAF: React.FC<Props> = ({ ordenes }) => {
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
                        <Tr key={orden.ordenCompraActivoId}>
                            <Td>{orden.ordenCompraActivoId}</Td>
                            <Td>
                                {orden.fechaEmision
                                    ? new Date(orden.fechaEmision).toLocaleDateString()
                                    : '-'}
                            </Td>
                            <Td>
                                {orden.fechaVencimiento
                                    ? new Date(orden.fechaVencimiento).toLocaleDateString()
                                    : '-'}
                            </Td>
                            <Td>{orden.proveedor ? orden.proveedor.nombre : '-'}</Td>
                            <Td>{formatCOP(orden.totalPagar)}</Td>
                            <Td>{getEstadoOCAFText(orden.estado)}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default ListaOrdenesOCAF;
