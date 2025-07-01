
import {
    Box, Spinner, Text, TableContainer,
    Table, Thead, Tbody, Tr, Th, Td
} from "@chakra-ui/react";
import { ProductStockDTO, Movimiento } from './types.tsx';
import MyPagination from '../../components/MyPagination';

interface ListaMovimientosProps {
    selectedProducto: ProductStockDTO | null;
    movimientos: Movimiento[];
    loadingMovimientos: boolean;
    pageMovimientos: number;
    totalPagesMovimientos: number;
    handlePageChangeMovimientos: (page: number) => void;
}

function ListaMovimientos({
    selectedProducto,
    movimientos,
    loadingMovimientos,
    pageMovimientos,
    totalPagesMovimientos,
    handlePageChangeMovimientos
}: ListaMovimientosProps) {
    return (
        <Box
            flex={{ base: 'none', md: 2 }}
            w={{ base: '100%', md: 'auto' }}
            ml={{ base: 0, md: 4 }}
        >
            {selectedProducto ? (
                <>
                    <Text fontSize="xl" fontWeight="bold">Movimientos for {selectedProducto.producto.nombre}</Text>
                    {loadingMovimientos ? (
                        <Spinner />
                    ) : (
                        <>
                            <TableContainer maxH="400px" overflowY="auto" overflowX="auto">
                                <Table variant="striped" colorScheme="gray" size="sm">
                                    <Thead position="sticky" top={0} bg="white" zIndex={1}>
                                        <Tr>
                                            <Th>Fecha</Th>
                                            <Th>Cantidad</Th>
                                            <Th>Unidades</Th>
                                            <Th>Causa</Th>
                                            <Th>Observaciones</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {movimientos.length === 0 ? (
                                            <Tr>
                                                <Td colSpan={5} textAlign="center">
                                                    <Text py={2}>No hay movimientos para este producto.</Text>
                                                </Td>
                                            </Tr>
                                        ) : (
                                            movimientos.map((mov) => (
                                                <Tr key={mov.movimientoId}>
                                                    <Td>{new Date(mov.fechaMovimiento).toLocaleString()}</Td>
                                                    <Td>{mov.cantidad}</Td>
                                                    <Td>{mov.producto.tipoUnidades}</Td>
                                                    <Td>{mov.causa}</Td>
                                                    <Td>{mov.observaciones}</Td>
                                                </Tr>
                                            ))
                                        )}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            <MyPagination
                                page={pageMovimientos}
                                totalPages={totalPagesMovimientos}
                                loading={loadingMovimientos}
                                handlePageChange={handlePageChangeMovimientos}
                            />
                        </>
                    )}
                </>
            ) : (
                <Text>Select a product to view its movements.</Text>
            )}
        </Box>
    );
}

export default ListaMovimientos;