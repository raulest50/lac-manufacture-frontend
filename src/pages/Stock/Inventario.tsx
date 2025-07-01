// src/pages/Stock/StockPage.tsx

import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

import {
    Container, VStack, HStack, Flex, Box,
    FormControl, Input,
    Button, Text,
    List,
    ListItem,
    Spinner,
    Select,
    Table, Thead, Tbody, Tr, Th, Td, TableContainer
} from "@chakra-ui/react";


import '@fontsource-variable/league-spartan';
import '@fontsource/anton';

import axios from 'axios';

const endPoints = new EndPointsURL();

import MyPagination from '../../components/MyPagination';
import { ProductStockDTO, Movimiento } from './types.tsx';
import EndPointsURL from "../../api/EndPointsURL.tsx";

function Inventario() {

    const toast = useToast();

    const [searchTerm, setSearchTerm] = useState('');
    const [tipoBusqueda, setTipoBusqueda] = useState('NOMBRE'); // 'NOMBRE' or 'ID'
    const [productos, setProductos] = useState<ProductStockDTO[]>([]);
    const [selectedProducto, setSelectedProducto] = useState<ProductStockDTO | null>(null);
    const [pageProductos, setPageProductos] = useState(0);
    const [totalPagesProductos, setTotalPagesProductos] = useState(0);
    const [loadingProductos, setLoadingProductos] = useState(false);

    const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
    const [pageMovimientos, setPageMovimientos] = useState(0);
    const [totalPagesMovimientos, setTotalPagesMovimientos] = useState(0);
    const [loadingMovimientos, setLoadingMovimientos] = useState(false);

    const handleSearch = async () => {
        setLoadingProductos(true);
        try {
            const response = await axios.get(endPoints.search_products_with_stock, {
                params: {
                    searchTerm,
                    tipoBusqueda,
                    page: pageProductos,
                    size: 10,
                },
            });
            setProductos(response.data.content);
            setTotalPagesProductos(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch products.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoadingProductos(false);
        }
    };

    useEffect(() => {
        if (searchTerm !== '') {
            handleSearch();
        }
    }, [pageProductos]);

    const onKeyPress_InputBuscar = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setPageProductos(0);
            handleSearch();
        }
    };

    const handleProductoClick = (producto: ProductStockDTO) => {
        setSelectedProducto(producto);
        setPageMovimientos(0);
        fetchMovimientos(producto.producto.productoId, 0);
    };

    const fetchMovimientos = async (productoId: number, page: number) => {
        setLoadingMovimientos(true);
        try {
            const response = await axios.get(endPoints.get_movimientos_by_producto, {
                params: {
                    productoId,
                    page,
                    size: 10,
                },
            });
            setMovimientos(response.data.content);
            setTotalPagesMovimientos(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching movimientos:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch movimientos.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoadingMovimientos(false);
        }
    };

    const handlePageChangeProductos = (page: number) => {
        setPageProductos(page);
    };

    const handlePageChangeMovimientos = (page: number) => {
        setPageMovimientos(page);
        if (selectedProducto) {
            fetchMovimientos(selectedProducto.producto.productoId, page);
        }
    };

    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'} >

                <VStack h={'full'} w={'full'} align="stretch">
                            <FormControl>
                                <HStack>
                                    <Input
                                        placeholder="Buscar producto por nombre o ID"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={onKeyPress_InputBuscar}
                                    />
                                    <Select
                                        value={tipoBusqueda}
                                        onChange={(e) => setTipoBusqueda(e.target.value)}
                                        width="150px"
                                    >
                                        <option value="NOMBRE">Nombre</option>
                                        <option value="ID">ID</option>
                                    </Select>
                                    <Button onClick={() => {
                                        setPageProductos(0);
                                        handleSearch();
                                    }}>Buscar</Button>
                                </HStack>
                            </FormControl>
                            <Flex mt={4}>
                                {/* Left Panel: Product List */}
                                <Box flex="1" mr="4">
                                    {loadingProductos ? (
                                        <Spinner />
                                    ) : (
                                        <>
                                            <Box overflowX="auto" width="100%" maxH="400px" overflowY="auto">
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
                                                                            ? 'gray.100'
                                                                            : 'white'
                                                                    }
                                                                    _hover={{ bg: "gray.50" }}
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
                                </Box>
                                {/* Right Panel: Movimientos */}
                                <Box flex="2" ml="4">
                                    {selectedProducto ? (
                                        <>
                                            <Text fontSize="xl" fontWeight="bold">Movimientos for {selectedProducto.producto.nombre}</Text>
                                            {loadingMovimientos ? (
                                                <Spinner />
                                            ) : (
                                                <>
                                                    <TableContainer maxH="400px" overflowY="auto">
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
                            </Flex>
                    </VStack>
        </Container>
    );
}

export default Inventario;
