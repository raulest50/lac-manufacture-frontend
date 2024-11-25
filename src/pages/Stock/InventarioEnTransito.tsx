// src/components/InventarioEnTransito.tsx

import { useState, useEffect } from 'react';
import {
    Flex,
    Text,
    Spinner,
    Box,
    VStack,
    HStack,
    Heading,
    List,
    ListItem,
} from "@chakra-ui/react";
import axios from 'axios';
import { InventarioEnTransitoDTO, PaginatedResponse } from './types.tsx';
import EndPointsURL from "../../api/EndPointsURL.tsx";
import MyPagination from '../../components/MyPagination'; // Adjust the import path if necessary

const endPoints = new EndPointsURL();

export default function InventarioEnTransito() {
    const [inventario, setInventario] = useState<InventarioEnTransitoDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState<number>(0);
    const [size] = useState<number>(5); // Adjust the default page size as needed
    const [totalPages, setTotalPages] = useState<number>(0);

    const fetchInventario = async (currentPage: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<PaginatedResponse<InventarioEnTransitoDTO>>(endPoints.inventario_en_transito, {
                params: {
                    page: currentPage,
                    size: size,
                },
            });
            setInventario(response.data.content);
            setTotalPages(response.data.totalPages);
            setPage(response.data.number); // Ensure we're using the correct page number from response
        } catch (err) {
            setError('Error fetching inventario en tránsito');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventario(0);
    }, []);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            fetchInventario(newPage);
        }
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" my={4}>
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (error) {
        return (
            <Text color="red.500" mb={4}>
                {error}
            </Text>
        );
    }

    return (
        <Flex direction="column" p={4}>
            <Heading size="md" mb={4}>Inventario en Tránsito</Heading>
            {inventario.length === 0 ? (
                <Text>No hay inventario en tránsito.</Text>
            ) : (
                <>
                    <VStack spacing={4} align="stretch">
                        {inventario.map((item) => (
                            <Box
                                key={item.productoId}
                                borderWidth="1px"
                                borderRadius="lg"
                                p={4}
                                boxShadow="sm"
                            >
                                <HStack spacing={4} mb={2}>
                                    <Text fontWeight="bold">Producto ID:</Text>
                                    <Text>{item.productoId}</Text>
                                    <Text fontWeight="bold">Nombre:</Text>
                                    <Text>{item.productoNombre}</Text>
                                </HStack>
                                <HStack spacing={4} mb={2}>
                                    <Text fontWeight="bold">Cantidad Total:</Text>
                                    <Text>{item.cantidadTotal}</Text>
                                </HStack>
                                <Box mt={2}>
                                    <Text fontWeight="bold">Órdenes de Producción:</Text>
                                    <List ml={4} mt={1}>
                                        {item.ordenesProduccionIds.map((id) => (
                                            <ListItem key={id}>Orden de Producción ID: {id}</ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Box>
                        ))}
                    </VStack>
                    {/* Pagination Component */}
                    <MyPagination
                        page={page}
                        totalPages={totalPages}
                        loading={loading}
                        handlePageChange={handlePageChange}
                    />
                </>
            )}
        </Flex>
    );
}
