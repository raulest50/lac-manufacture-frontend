// src/pages/Stock/StockPage.tsx

import React, { useState, useEffect } from 'react';
import {Box, useToast} from '@chakra-ui/react';

import {
    Container, VStack, HStack,
    FormControl, Input,
    Button,
    Select
} from "@chakra-ui/react";


import '@fontsource-variable/league-spartan';
import '@fontsource/anton';

import axios from 'axios';

const endPoints = new EndPointsURL();

import { ProductStockDTO } from './types.tsx';
import EndPointsURL from "../../api/EndPointsURL.tsx";
import ListaProductos from './ListaProductos';

function Inventario() {

    const toast = useToast();

    const [searchTerm, setSearchTerm] = useState('');
    const [tipoBusqueda, setTipoBusqueda] = useState('NOMBRE'); // 'NOMBRE' or 'ID'
    const [productos, setProductos] = useState<ProductStockDTO[]>([]);
    const [pageProductos, setPageProductos] = useState(0);
    const [totalPagesProductos, setTotalPagesProductos] = useState(0);
    const [loadingProductos, setLoadingProductos] = useState(false);

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

    const handlePageChangeProductos = (page: number) => {
        setPageProductos(page);
    };

    const handleDownloadInventario = async () => {
        try {
            const response = await axios.post(
                endPoints.exportar_inventario_excel,
                { categories: [], searchTerm },
                { responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'inventario.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading Excel:', error);
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
                                    <Button colorScheme="teal" onClick={handleDownloadInventario}>Reporte inventario</Button>
                                </HStack>
                            </FormControl>
                            <Box w={"full"} mt={4}>
                                <ListaProductos
                                    productos={productos}
                                    loadingProductos={loadingProductos}
                                    pageProductos={pageProductos}
                                    totalPagesProductos={totalPagesProductos}
                                    handlePageChangeProductos={handlePageChangeProductos}
                                />
                            </Box>
                    </VStack>
        </Container>
    );
}

export default Inventario;
