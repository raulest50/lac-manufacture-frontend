import { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Flex,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Heading,
    Spinner,
    useToast,
    Badge,
} from '@chakra-ui/react';
import axios from 'axios';
import { ConsolidadoOCMResponse } from '../../types';
import EndPointsURL from '../../../../api/EndPointsURL';

interface ListaMaterialesIngresoDesgloceProps {
    ordenCompraId: number | undefined;
}

export function ListaMaterialesIngresoDesgloce({ ordenCompraId }: ListaMaterialesIngresoDesgloceProps) {
    const [consolidado, setConsolidado] = useState<ConsolidadoOCMResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();
    const endpoints = useMemo(() => new EndPointsURL(), []);

    useEffect(() => {
        if (!ordenCompraId) {
            setConsolidado(null);
            return;
        }

        const fetchConsolidado = async () => {
            setLoading(true);
            setError(null);
            try {
                const url = endpoints.consolidado_materiales_ocm.replace('{ordenCompraId}', String(ordenCompraId));
                const response = await axios.get<ConsolidadoOCMResponse>(url, {
                    withCredentials: true
                });
                setConsolidado(response.data);
            } catch (error: any) {
                console.error('Error fetching consolidado:', error);
                const errorMessage = error.response?.data?.message || 
                    error.message || 
                    'No se pudo cargar el consolidado de materiales';
                setError(errorMessage);
                toast({
                    title: 'Error al cargar consolidado',
                    description: errorMessage,
                    status: 'error',
                    duration: 4000,
                    isClosable: true
                });
            } finally {
                setLoading(false);
            }
        };

        fetchConsolidado();
    }, [ordenCompraId, endpoints, toast]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('es-CO');
        } catch {
            return dateString;
        }
    };

    if (!ordenCompraId) {
        return null;
    }

    if (loading) {
        return (
            <Flex direction="column" gap={4} mt={6} w="full">
                <Heading size="md" fontFamily="Comfortaa Variable">
                    Consolidado de Materiales Recibidos
                </Heading>
                <Flex justify="center" align="center" p={8}>
                    <Spinner size="xl" color="teal.500" />
                </Flex>
            </Flex>
        );
    }

    if (error) {
        return (
            <Flex direction="column" gap={4} mt={6} w="full">
                <Heading size="md" fontFamily="Comfortaa Variable">
                    Consolidado de Materiales Recibidos
                </Heading>
                <Box p={4} bg="red.50" borderRadius="md">
                    <Text color="red.600">{error}</Text>
                </Box>
            </Flex>
        );
    }

    if (!consolidado || !consolidado.materiales || consolidado.materiales.length === 0) {
        return (
            <Flex direction="column" gap={4} mt={6} w="full">
                <Heading size="md" fontFamily="Comfortaa Variable">
                    Consolidado de Materiales Recibidos
                </Heading>
                <Box p={4} bg="gray.50" borderRadius="md">
                    <Text color="gray.600" textAlign="center">
                        No hay materiales recibidos para esta orden de compra.
                    </Text>
                </Box>
            </Flex>
        );
    }

    return (
        <Flex direction="column" gap={4} mt={6} w="full">
            <Heading size="md" fontFamily="Comfortaa Variable">
                Consolidado de Materiales Recibidos
            </Heading>
            <Text fontSize="sm" color="gray.600">
                Total de transacciones: <strong>{consolidado.totalTransacciones}</strong>
            </Text>
            
            <Box w="full" bg="white" borderRadius="md" boxShadow="sm" overflowX="auto">
                <Table size="sm" variant="simple">
                    <Thead bg="gray.50">
                        <Tr>
                            <Th>Material</Th>
                            <Th>ID Producto</Th>
                            <Th>Cantidad Total</Th>
                            <Th>Unidad</Th>
                            <Th># Lotes</Th>
                            <Th>Detalle Lotes</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {consolidado.materiales.map((material) => (
                            <Tr key={material.productoId}>
                                <Td fontWeight="semibold">{material.productoNombre}</Td>
                                <Td>{material.productoId}</Td>
                                <Td>
                                    <Badge colorScheme="green" fontSize="md">
                                        {material.cantidadTotal.toFixed(2)}
                                    </Badge>
                                </Td>
                                <Td>{material.tipoUnidades}</Td>
                                <Td textAlign="center">
                                    <Badge colorScheme="blue">
                                        {material.lotes.length}
                                    </Badge>
                                </Td>
                                <Td>
                                    <Box>
                                        {material.lotes.map((lote, idx) => (
                                            <Flex key={idx} gap={2} mb={1} fontSize="xs" alignItems="center">
                                                {lote.batchNumber ? (
                                                    <Badge colorScheme="teal" fontSize="xs">
                                                        {lote.batchNumber}
                                                    </Badge>
                                                ) : (
                                                    <Badge colorScheme="gray" fontSize="xs">
                                                        Sin lote
                                                    </Badge>
                                                )}
                                                <Text>
                                                    {lote.cantidad.toFixed(2)} {material.tipoUnidades}
                                                </Text>
                                                {lote.expirationDate && (
                                                    <Text color="gray.600">
                                                        (Vence: {formatDate(lote.expirationDate)})
                                                    </Text>
                                                )}
                                            </Flex>
                                        ))}
                                    </Box>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Flex>
    );
}
