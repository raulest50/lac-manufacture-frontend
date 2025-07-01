
import {
    Box, Spinner, Text,
    Table, Thead, Tbody, Tr, Th, Td, Flex
} from "@chakra-ui/react";
import { ProductStockDTO } from './types.tsx';
import MyPagination from '../../components/MyPagination';

interface ListaProductosProps {
    productos: ProductStockDTO[];
    loadingProductos: boolean;
    selectedProducto: ProductStockDTO | null;
    pageProductos: number;
    totalPagesProductos: number;
    handleProductoClick: (producto: ProductStockDTO) => void;
    handlePageChangeProductos: (page: number) => void;
}

function ListaProductos({
    productos,
    loadingProductos,
    selectedProducto,
    pageProductos,
    totalPagesProductos,
    handleProductoClick,
    handlePageChangeProductos
}: ListaProductosProps) {
    return (
        <Flex
            direction={"column"}
            flex={1}
            w={"full"}
            mr={{ base: 0, md: 4 }}
            mb={{ base: 4, md: 0 }}
        >
            {loadingProductos ? (
                <Spinner />
            ) : (
                <>
                    <Box w={"full"}>
                        <Table variant="striped" colorScheme="gray" size="sm" width="100%">
                            <Thead position="sticky" top={0} bg="white" zIndex={1}>
                                <Tr>
                                    <Th>ID</Th>
                                    <Th>Nombre</Th>
                                    <Th>Stock</Th>
                                    <Th>Unidades</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {productos.length === 0 ? (
                                    <Tr>
                                        <Td colSpan={4} textAlign="center">
                                            <Text py={2}>No se encontraron productos.</Text>
                                        </Td>
                                    </Tr>
                                ) : (
                                    productos.map((item) => (
                                        <Tr
                                            key={item.producto.productoId}
                                            cursor="pointer"
                                            onClick={() => handleProductoClick(item)}
                                            bg={
                                                selectedProducto && selectedProducto.producto.productoId === item.producto.productoId
                                                    ? 'blue.100'
                                                    : 'white'
                                            }
                                            _hover={{ bg: "blue.50" }}
                                        >
                                            <Td>{item.producto.productoId}</Td>
                                            <Td>{item.producto.nombre}</Td>
                                            <Td>{item.stock}</Td>
                                            <Td>{item.producto.tipoUnidades}</Td>
                                        </Tr>
                                    ))
                                )}
                            </Tbody>
                        </Table>
                    </Box>
                    <MyPagination
                        page={pageProductos}
                        totalPages={totalPagesProductos}
                        loading={loadingProductos}
                        handlePageChange={handlePageChangeProductos}
                    />
                </>
            )}
        </Flex>
    );
}

export default ListaProductos;
