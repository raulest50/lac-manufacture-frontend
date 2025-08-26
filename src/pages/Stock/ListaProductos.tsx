
import {
    Box, Spinner, Text,
    Table, Thead, Tbody, Tr, Th, Td, Flex,
    Menu, MenuButton, MenuList, MenuItem, Button
} from "@chakra-ui/react";
import axios from 'axios';
import EndPointsURL from "../../api/EndPointsURL.tsx";
import { ProductStockDTO } from './types.tsx';
import MyPagination from '../../components/MyPagination';

const endPoints = new EndPointsURL();

interface ListaProductosProps {
    productos: ProductStockDTO[];
    loadingProductos: boolean;
    pageProductos: number;
    totalPagesProductos: number;
    handlePageChangeProductos: (page: number) => void;
}

function ListaProductos({
    productos,
    loadingProductos,
    pageProductos,
    totalPagesProductos,
    handlePageChangeProductos
}: ListaProductosProps) {
    const handleDownloadExcel = async (productoId: number) => {
        try {
            const response = await axios.post(
                endPoints.exportar_movimientos_excel,
                {
                    productoId: productoId.toString(),
                    startDate: '1970-01-01',
                    endDate: new Date().toISOString().split('T')[0],
                },
                { responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'movimientos.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading Excel:', error);
        }
    };

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
                                    <Th>Menu</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {productos.length === 0 ? (
                                    <Tr>
                                        <Td colSpan={5} textAlign="center">
                                            <Text py={2}>No se encontraron productos.</Text>
                                        </Td>
                                    </Tr>
                                ) : (
                                    productos.map((item) => (
                                        <Tr key={item.producto.productoId}>
                                            <Td>{item.producto.productoId}</Td>
                                            <Td>{item.producto.nombre}</Td>
                                            <Td>{item.stock}</Td>
                                            <Td>{item.producto.tipoUnidades}</Td>
                                            <Td>
                                                <Menu>
                                                    <MenuButton as={Button} size="sm" colorScheme="teal">Menu</MenuButton>
                                                    <MenuList>
                                                        <MenuItem onClick={() => handleDownloadExcel(item.producto.productoId)}>
                                                            Descargar Excel de movimientos
                                                        </MenuItem>
                                                    </MenuList>
                                                </Menu>
                                            </Td>
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
