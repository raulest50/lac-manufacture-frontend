import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    useColorModeValue
} from '@chakra-ui/react';
import { FiMoreVertical, FiEye, FiXCircle } from 'react-icons/fi';
import { OrdenCompraActivo, getEstadoOCAFText } from '../types';
import { formatCOP } from '../../../utils/formatters';

interface Props {
    ordenes: OrdenCompraActivo[];
}

const ListaOrdenesOCAF: React.FC<Props> = ({ ordenes }) => {
    // Color para el efecto hover
    const hoverBg = useColorModeValue('gray.100', 'gray.700');

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
                        <Th>Acciones</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {ordenes.map((orden) => (
                        <Tr 
                            key={orden.ordenCompraActivoId}
                            _hover={{ bg: hoverBg, transition: 'background-color 0.2s' }}
                        >
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
                            <Td>
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        aria-label='Opciones'
                                        icon={<FiMoreVertical />}
                                        variant='ghost'
                                        size='sm'
                                    />
                                    <MenuList>
                                        <MenuItem icon={<FiEye />}>
                                            Ver detalle
                                        </MenuItem>
                                        <MenuItem icon={<FiXCircle />}>
                                            Cancelar orden de compra AF
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default ListaOrdenesOCAF;
