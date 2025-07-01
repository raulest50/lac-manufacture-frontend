// src/pages/Stock/StockPage.tsx

import React, { useState, useEffect } from 'react';
import {Box, useToast} from '@chakra-ui/react';

import {
    Container, VStack, HStack, Flex,
    FormControl, Input,
    Button,
    Select
} from "@chakra-ui/react";


import '@fontsource-variable/league-spartan';
import '@fontsource/anton';

import axios from 'axios';

const endPoints = new EndPointsURL();

import { ProductStockDTO, Movimiento } from './types.tsx';
import EndPointsURL from "../../api/EndPointsURL.tsx";
import ListaProductos from './ListaProductos';
import ListaMovimientos from './ListaMovimientos';

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
                <VStack h={'full'} w={'full'} >
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
                            <Flex w={"full"} mt={4} direction={"row"}>
                                {/* Left Panel: Product List */}
                                <Box minW={0} flex={1}>
                                    <ListaProductos
                                        productos={productos}
                                        loadingProductos={loadingProductos}
                                        selectedProducto={selectedProducto}
                                        pageProductos={pageProductos}
                                        totalPagesProductos={totalPagesProductos}
                                        handleProductoClick={handleProductoClick}
                                        handlePageChangeProductos={handlePageChangeProductos}
                                    />
                                </Box >
                                <Box minW={0} flex={1} >
                                    <ListaMovimientos
                                        selectedProducto={selectedProducto}
                                        movimientos={movimientos}
                                        loadingMovimientos={loadingMovimientos}
                                        pageMovimientos={pageMovimientos}
                                        totalPagesMovimientos={totalPagesMovimientos}
                                        handlePageChangeMovimientos={handlePageChangeMovimientos}
                                    />
                                </Box>
                            </Flex>
                    </VStack>
        </Container>
    );
}

export default Inventario;



{/* Right Panel: Movimientos */}
