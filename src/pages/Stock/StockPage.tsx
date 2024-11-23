// src/pages/Stock/StockPage.tsx

import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

import {
    Container, VStack, HStack, Flex, Box,
    Tabs, TabList, Tab, TabPanels, TabPanel,
    FormControl, Input,
    Button, Text,
    List,
    ListItem,
    Spinner,
    Select,
} from "@chakra-ui/react";

import MyHeader from "../../components/MyHeader";
import '@fontsource-variable/league-spartan';
import '@fontsource/anton';
import { my_style_tab } from "../../styles/styles_general";

import axios from 'axios';

const endPoints = new EndPointsURL();

import MyPagination from '../../components/MyPagination';
import { ProductStockDTO, Movimiento } from './types.tsx';
import EndPointsURL from "../../api/EndPointsURL.tsx";

function StockPage() {

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
            <MyHeader title={'Movimientos y Stock'} />

            <Tabs>
                <TabList>
                    <Tab sx={my_style_tab}>Inventario</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
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
                                            <List spacing={2} maxH="400px" overflowY="auto">
                                                {productos.map((item) => (
                                                    <ListItem
                                                        key={item.producto.productoId}
                                                        borderBottom="1px solid #ccc"
                                                        p="2"
                                                        cursor="pointer"
                                                        onClick={() => handleProductoClick(item)}
                                                        bg={
                                                            selectedProducto && selectedProducto.producto.productoId === item.producto.productoId
                                                                ? 'gray.100'
                                                                : 'white'
                                                        }
                                                    >
                                                        <HStack>
                                                            <Text>
                                                                ID: {item.producto.productoId} - {item.producto.nombre} - Stock: {item.stock}
                                                            </Text>
                                                        </HStack>
                                                    </ListItem>
                                                ))}
                                            </List>
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
                                <Box flex="1" ml="4">
                                    {selectedProducto ? (
                                        <>
                                            <Text fontSize="xl" fontWeight="bold">Movimientos for {selectedProducto.producto.nombre}</Text>
                                            {loadingMovimientos ? (
                                                <Spinner />
                                            ) : (
                                                <>
                                                    <List spacing={2} maxH="400px" overflowY="auto">
                                                        {movimientos.map((mov) => (
                                                            <ListItem
                                                                key={mov.movimientoId}
                                                                borderBottom="1px solid #ccc"
                                                                p="2"
                                                            >
                                                                <Text>
                                                                    Fecha: {new Date(mov.fechaMovimiento).toLocaleString()} - Cantidad: {mov.cantidad} - Causa: {mov.causa} - Observaciones: {mov.observaciones}
                                                                </Text>
                                                            </ListItem>
                                                        ))}
                                                    </List>
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
                    </TabPanel>

                </TabPanels>
            </Tabs>

        </Container>
    );
}

export default StockPage;
