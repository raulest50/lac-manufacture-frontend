// src/pages/Produccion/RecetaPicker.tsx

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
    Box,
    Input,
    Select,
    Button,
    List,
    ListItem,
    HStack,
    Text,
    Spinner,
    Flex,
} from '@chakra-ui/react';
import axios from 'axios';
import MyPagination from '../../components/MyPagination';
import { ServerParams } from '../../api/params';
import { useToast } from '@chakra-ui/react';

// Import your types
import {
    InsumoWithStock,
    Producto,
    ProductoStockDTO,
    ProductoWithInsumos,
} from './types';

interface RecetaPickerProps {
    setCanProduce: (canProduce: boolean) => void;
    setSelectedProducto: (producto: ProductoWithInsumos | null) => void;
}

export interface RecetaPickerRef {
    refresh: () => void;
}

export const RecetaPicker = forwardRef<RecetaPickerRef, RecetaPickerProps>(
    ({ setCanProduce, setSelectedProducto }, ref) => {
        const toast = useToast();

        const [searchTerm, setSearchTerm] = useState('');
        const [tipoBusqueda, setTipoBusqueda] = useState('NOMBRE'); // 'NOMBRE' or 'ID'
        const [productos, setProductos] = useState<ProductoStockDTO[]>([]);
        const [loadingProductos, setLoadingProductos] = useState(false);
        const [pageProductos, setPageProductos] = useState(0);
        const [totalPagesProductos, setTotalPagesProductos] = useState(0);
        const [selectedProducto, setSelectedProductoLocal] = useState<
            ProductoWithInsumos | null
        >(null);

        const [loadingInsumos, setLoadingInsumos] = useState(false);

        // Function to fetch products based on search criteria
        const handleSearch = async () => {
            setLoadingProductos(true);
            try {
                const response = await axios.get(
                    ServerParams.getSearchSemiyTermiEndpoint(),
                    {
                        params: {
                            searchTerm,
                            tipoBusqueda,
                            page: pageProductos,
                            size: 10,
                        },
                    }
                );
                const content: ProductoStockDTO[] = response.data.content || [];
                setProductos(content);
                const totalPages: number = response.data.totalPages || 0;
                setTotalPagesProductos(totalPages);
            } catch (error) {
                console.error('Error fetching products:', error);
                setProductos([]);
                setTotalPagesProductos(0);
                // Show error toast
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

        // Expose the refresh function to parent components
        useImperativeHandle(ref, () => ({
            refresh: () => {
                handleSearch();
            },
        }));

        // Trigger search when searchTerm, tipoBusqueda, or pageProductos changes
        useEffect(() => {
            if (searchTerm.trim() !== '') {
                handleSearch();
            } else {
                // Optionally, you can fetch all products when searchTerm is empty
                handleSearch();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [searchTerm, tipoBusqueda, pageProductos]);

        // Handle Enter key press in the search input
        const onKeyPress_InputBuscar = (
            event: React.KeyboardEvent<HTMLInputElement>
        ) => {
            if (event.key === 'Enter') {
                setPageProductos(0);
                handleSearch();
                setProductos([])
            }
        };

        // Handle product selection
        const handleProductoClick = async (producto: Producto) => {
            setLoadingInsumos(true);
            try {
                const response = await axios.get(
                    `${ServerParams.getDomain()}/productos/${producto.productoId}/insumos_with_stock`
                );
                const insumos: InsumoWithStock[] = response.data;
                const productoWithInsumos: ProductoWithInsumos = {
                    producto,
                    insumos,
                };
                setSelectedProductoLocal(productoWithInsumos);
                setSelectedProducto(productoWithInsumos);
                // Determine if production is possible
                const canProduce = insumos.every(
                    (insumo) => insumo.stockActual >= insumo.cantidadRequerida
                );
                setCanProduce(canProduce);
            } catch (error) {
                console.error('Error fetching insumos:', error);
                // Show error toast
                toast({
                    title: 'Error',
                    description: 'Failed to fetch insumos.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                setSelectedProductoLocal(null);
                setSelectedProducto(null);
                setCanProduce(false);
            } finally {
                setLoadingInsumos(false);
            }
        };

        // Handle page change in pagination
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
                        <Button
                            onClick={() => {
                                setPageProductos(0);
                                handleSearch();
                            }}
                        >
                            Buscar
                        </Button>
                    </HStack>
                    {loadingProductos ? (
                        <Spinner mt={4} />
                    ) : (
                        <>
                            <List spacing={2} maxH="400px" overflowY="auto" mt={4}>
                                {productos.map((item) => (
                                    <ListItem
                                        key={item.producto.productoId}
                                        borderBottom="1px solid #ccc"
                                        p="2"
                                        cursor="pointer"
                                        onClick={() => handleProductoClick(item.producto)}
                                        bg={
                                            selectedProducto &&
                                            selectedProducto.producto.productoId ===
                                            item.producto.productoId
                                                ? 'gray.100'
                                                : 'white'
                                        }
                                    >
                                        <HStack>
                                            <Text>
                                                ID: {item.producto.productoId} - {item.producto.nombre} -{' '}
                                                Tipo: {item.producto.tipo_producto} - Stock: {item.stock}
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
                            <Text fontSize="xl" fontWeight="bold">
                                Insumos for {selectedProducto.producto.nombre}
                            </Text>
                            {loadingInsumos ? (
                                <Spinner mt={4} />
                            ) : (
                                <List spacing={2} maxH="400px" overflowY="auto" mt={4}>
                                    {selectedProducto.insumos.map((insumo) => (
                                        <ListItem
                                            key={insumo.insumoId}
                                            borderBottom="1px solid #ccc"
                                            p="2"
                                            bg={
                                                insumo.stockActual < insumo.cantidadRequerida
                                                    ? 'red.100'
                                                    : 'white'
                                            }
                                        >
                                            <HStack justify="space-between">
                                                <Text>
                                                    ID: {insumo.productoId} - {insumo.productoNombre}
                                                </Text>
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
    }
);
