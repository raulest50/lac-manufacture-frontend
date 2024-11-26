// src/components/WorkLoad.tsx

import React, { useEffect, useState } from 'react';
import { Flex, VStack, Spinner, Text, Button } from "@chakra-ui/react";
import axios from 'axios';
import OrdenProduccionCard from './OrdenProduccionCard';
import { OrdenProduccionDTO, PaginatedResponse } from './types.tsx';
import EndPointsURL from '../../api/EndPointsURL.tsx';
import MyPagination from '../../components/MyPagination'; // Adjust the import path as needed

interface WorkLoadProps {
    responsableId: number;
}

const endPoints = new EndPointsURL();

const WorkLoad: React.FC<WorkLoadProps> = ({ responsableId }) => {
    const [ordenesProduccion, setOrdenesProduccion] = useState<OrdenProduccionDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [page, setPage] = useState<number>(0);
    const [size] = useState<number>(5); // Adjust page size as needed
    const [totalPages, setTotalPages] = useState<number>(0);

    const fetchOrdenes = async (currentPage: number) => {
        setLoading(true);
        try {
            const response = await axios.get<PaginatedResponse<OrdenProduccionDTO>>(endPoints.search_ordenes_by_responsable.replace('{responsableId}', responsableId.toString()), {
                params: {
                    page: currentPage,
                    size: size,
                },
            });
            setOrdenesProduccion(response.data.content);
            setTotalPages(response.data.totalPages);
            setPage(response.data.number);
        } catch (err) {
            setError('Error fetching ordenes de producción');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdenes(0);
    }, [responsableId]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            fetchOrdenes(newPage);
        }
    };

    const handleRefresh = () => {
        fetchOrdenes(page);
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
            <Button onClick={handleRefresh} mb={4} colorScheme="blue">
                Refresh
            </Button>
            {ordenesProduccion.length === 0 ? (
                <Text>No hay órdenes de producción asignadas.</Text>
            ) : (
                <>
                    <VStack spacing={4} align="stretch">
                        {ordenesProduccion.map((orden) => (
                            <OrdenProduccionCard key={orden.ordenId} ordenProduccion={orden} />
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
};

export default WorkLoad;
