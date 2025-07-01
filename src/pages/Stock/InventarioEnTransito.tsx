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
    Table, Thead, Tbody, Tr, Th, Td, TableContainer
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
                    <Box overflowX="auto" width="100%" maxH="400px" overflowY="auto">
                        <Table variant="striped" colorScheme="gray" size="sm" width="100%">
                            <Thead>
                                <Tr>
                                    <Th>ID Producto</Th>
                                    <Th>Nombre</Th>
                                    <Th>Cantidad Total</Th>
                                    <Th>Unidades</Th>
                                    <Th>Órdenes de Producción</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {inventario.map((item) => (
                                    <Tr key={item.productoId}>
                                        <Td>{item.productoId}</Td>
                                        <Td>{item.productoNombre}</Td>
                                        <Td>{item.cantidadTotal}</Td>
                                        <Td>{item.tipoUnidades}</Td>
                                        <Td>
                                            {item.ordenesProduccionIds.map((id) => (
                                                <Text key={id}>ID: {id}</Text>
                                            ))}
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
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
