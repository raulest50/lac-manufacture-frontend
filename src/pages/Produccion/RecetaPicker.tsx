// src/components/RecetaPicker.tsx

import React, { useState, useEffect } from 'react';
import {
    Box, Input, Select, Button, List, ListItem, HStack, Text, Spinner, Flex
} from "@chakra-ui/react";
import axios from 'axios';
import MyPagination from '../../components/MyPagination.tsx';

interface RecetaPickerProps {
    setCanProduce: (canProduce: boolean) => void;
    setSelectedProducto: (producto: ProductoWithInsumos | null) => void;
}

interface Producto {
    productoId: number;
    nombre: string;
    tipo_producto: string; // 'T' or 'S'
    // Other fields...
}

interface InsumoWithStock {
    insumoId: number;
    productoId: number;
    productoNombre: string;
    cantidadRequerida: number;
    stockActual: number;
}

interface ProductoWithInsumos {
    producto: Producto;
    insumos: InsumoWithStock[];
}

export const RecetaPicker: React.FC<RecetaPickerProps> = ({ setCanProduce, setSelectedProducto }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [tipoBusqueda, setTipoBusqueda] = useState('NOMBRE'); // 'NOMBRE' or 'ID'
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loadingProductos, setLoadingProductos] = useState(false);
    const [pageProductos, setPageProductos] = useState(0);
    const [totalPagesProductos, setTotalPagesProductos] = useState(0);
    const [selectedProducto, setSelectedProductoLocal] = useState<ProductoWithInsumos | null>(null);

    const [loadingInsumos, setLoadingInsumos] = useState(false);

    const handleSearch = async () => {
        setLoadingProductos(true);
        try {
            const response = await axios.get('/productos/search', {
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
            // Handle error (e.g., show a toast)
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

    const handleProductoClick = async (producto: Producto) => {
        setLoadingInsumos(true);
        try {
            const response = await axios.get(`/productos/${producto.productoId}/insumos_with_stock`);
            const insumos: InsumoWithStock[] = response.data;
            const productoWithInsumos: ProductoWithInsumos = {
                producto,
                insumos,
            };
            setSelectedProductoLocal(productoWithInsumos);
            setSelectedProducto(productoWithInsumos);
            // Determine canProduce
            const canProduce = insumos.every(insumo => insumo.stockActual >= insumo.cantidadRequerida);
            setCanProduce(canProduce);
        } catch (error) {
            console.error('Error fetching insumos:', error);
            // Handle error
        } finally {
            setLoadingInsumos(false);
        }
    };

    const handlePageChangeProductos = (page: number) => {
        setPageProductos(page);
    };

    return (
        <Flex mt={4}>
            {/* Left Panel: Product List */}
            <Box flex="1" mr="4">
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
                {loadingProductos ? (
                    <Spinner mt={4} />
                ) : (
                    <>
                        <List spacing={2} maxH="400px" overflowY="auto" mt={4}>
                            {productos.map((producto) => (
                                <ListItem
                                    key={producto.productoId}
                                    borderBottom="1px solid #ccc"
                                    p="2"
                                    cursor="pointer"
                                    onClick={() => handleProductoClick(producto)}
                                    bg={
                                        selectedProducto && selectedProducto.producto.productoId === producto.productoId
                                            ? 'gray.100'
                                            : 'white'
                                    }
                                >
                                    <HStack>
                                        <Text>
                                            ID: {producto.productoId} - {producto.nombre} - Tipo: {producto.tipo_producto}
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
            {/* Right Panel: Insumos */}
            <Box flex="1" ml="4">
                {selectedProducto ? (
                    <>
                        <Text fontSize="xl" fontWeight="bold">Insumos for {selectedProducto.producto.nombre}</Text>
                        {loadingInsumos ? (
                            <Spinner mt={4} />
                        ) : (
                            <List spacing={2} maxH="400px" overflowY="auto" mt={4}>
                                {selectedProducto.insumos.map((insumo) => (
                                    <ListItem
                                        key={insumo.insumoId}
                                        borderBottom="1px solid #ccc"
                                        p="2"
                                        bg={insumo.stockActual < insumo.cantidadRequerida ? 'red.100' : 'white'}
                                    >
                                        <HStack justify="space-between">
                                            <Text>ID: {insumo.productoId} - {insumo.productoNombre}</Text>
                                            <Text>Requerido: {insumo.cantidadRequerida}</Text>
                                            <Text>Stock: {insumo.stockActual}</Text>
                                        </HStack>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </>
                ) : (
                    <Text>Select a product to view its insumos.</Text>
                )}
            </Box>
        </Flex>
    );
};
