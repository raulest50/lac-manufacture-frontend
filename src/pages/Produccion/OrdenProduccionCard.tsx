// src/components/OrdenProduccionCard.tsx

import React from 'react';
import {
    Box,
    Flex,
    HStack,
    Text,
    IconButton,
    Collapse,
    VStack,
    Badge,
    useDisclosure,
} from "@chakra-ui/react";
import { FaChevronDown, FaChevronUp} from "react-icons/fa";
import { OrdenProduccionDTO, OrdenSeguimientoDTO } from "./types.tsx"; // Adjust the import path as needed
import { format } from 'date-fns';

interface OrdenProduccionCardProps {
    ordenProduccion: OrdenProduccionDTO;
}

const OrdenProduccionCard: React.FC<OrdenProduccionCardProps> = ({ ordenProduccion }) => {
    const { isOpen, onToggle } = useDisclosure();

    const formatDate = (value: string | null): string => {
        if (!value) {
            return "No disponible";
        }

        const parsedDate = new Date(value);

        if (Number.isNaN(parsedDate.getTime())) {
            return "No disponible";
        }

        return format(parsedDate, 'dd/MM/yyyy HH:mm');
    };

    // Helper to map estadoOrden to label and color
    const getEstadoOrdenInfo = (estado: number): { label: string; colorScheme: string } => {
        switch (estado) {
            case 0:
                return { label: 'En Producción', colorScheme: 'blue' };
            case 1:
                return { label: 'Terminada', colorScheme: 'green' };
            default:
                return { label: 'Desconocido', colorScheme: 'gray' };
        }
    };

    // Helper to map estadoSeguimiento to label and color
    const getEstadoSeguimientoInfo = (estado: number): { label: string; colorScheme: string } => {
        switch (estado) {
            case 0:
                return { label: 'Pendiente', colorScheme: 'yellow' };
            case 1:
                return { label: 'Finalizada', colorScheme: 'green' };
            default:
                return { label: 'Desconocido', colorScheme: 'gray' };
        }
    };

    const estadoOrdenInfo = getEstadoOrdenInfo(ordenProduccion.estadoOrden);

    return (
        <Box borderWidth="1px" borderRadius="lg" p={4} mb={4} boxShadow="sm">
            <Flex direction="column">
                {/* Header Information */}
                <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={2}>
                    <VStack align="flex-start" spacing={1}>
                        <HStack spacing={2}>
                            <Text fontWeight="bold">Orden ID:</Text>
                            <Text>{ordenProduccion.ordenId}</Text>
                        </HStack>
                        <HStack spacing={2}>
                            <Text fontWeight="bold">Producto:</Text>
                            <Text>{ordenProduccion.productoNombre}</Text>
                        </HStack>
                        <HStack spacing={2}>
                            <Text fontWeight="bold">Fecha creación:</Text>
                            <Text>{formatDate(ordenProduccion.fechaInicio)}</Text>
                        </HStack>
                        <HStack spacing={2}>
                            <Text fontWeight="bold">Fecha lanzamiento:</Text>
                            <Text>{formatDate(ordenProduccion.fechaLanzamiento)}</Text>
                        </HStack>
                        <HStack spacing={2}>
                            <Text fontWeight="bold">Fecha final planificada:</Text>
                            <Text>{formatDate(ordenProduccion.fechaFinalPlanificada)}</Text>
                        </HStack>
                    </VStack>
                    <Badge alignSelf={{ base: 'flex-start', md: 'center' }} colorScheme={estadoOrdenInfo.colorScheme}>{estadoOrdenInfo.label}</Badge>
                </Flex>

                <Flex mt={4} direction={{ base: 'column', md: 'row' }} gap={6}>
                    <VStack align="flex-start" spacing={1} flex={1}>
                        <HStack spacing={2}>
                            <Text fontWeight="bold">Número de lotes:</Text>
                            <Text>{ordenProduccion.numeroLotes ?? 'No especificado'}</Text>
                        </HStack>
                        <HStack spacing={2}>
                            <Text fontWeight="bold">Pedido comercial:</Text>
                            <Text>{ordenProduccion.numeroPedidoComercial ?? 'No especificado'}</Text>
                        </HStack>
                    </VStack>
                    <VStack align="flex-start" spacing={1} flex={1}>
                        <HStack spacing={2}>
                            <Text fontWeight="bold">Área operativa:</Text>
                            <Text>{ordenProduccion.areaOperativa ?? 'No especificada'}</Text>
                        </HStack>
                        <HStack spacing={2}>
                            <Text fontWeight="bold">Departamento operativo:</Text>
                            <Text>{ordenProduccion.departamentoOperativo ?? 'No especificado'}</Text>
                        </HStack>
                    </VStack>
                </Flex>

                <Box mt={4}>
                    <Text fontWeight="bold">Observaciones:</Text>
                    <Text>
                        {ordenProduccion.observaciones && ordenProduccion.observaciones.trim().length > 0
                            ? ordenProduccion.observaciones
                            : 'Sin observaciones'}
                    </Text>
                </Box>

                {/* Toggle Button */}
                <Flex justify="flex-end" mt={2}>
                    <IconButton
                        aria-label="Toggle Ordenes Seguimiento"
                        icon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
                        size="sm"
                        onClick={onToggle}
                        variant="ghost"
                    />
                </Flex>

                {/* Collapsible List of Ordenes Seguimiento */}
                <Collapse in={isOpen} animateOpacity>
                    <VStack align="start" mt={4} spacing={3}>
                        {(ordenProduccion.ordenesSeguimiento ?? []).map((seguimiento: OrdenSeguimientoDTO) => {
                            const estadoSeguimientoInfo = getEstadoSeguimientoInfo(seguimiento.estado);
                            return (
                                <Box key={seguimiento.seguimientoId} p={3} borderWidth="1px" borderRadius="md" width="100%">
                                    <HStack spacing={2} mb={2}>
                                        <Text fontWeight="bold">Seguimiento ID:</Text>
                                        <Text>{seguimiento.seguimientoId}</Text>
                                        <Badge colorScheme={estadoSeguimientoInfo.colorScheme}>{estadoSeguimientoInfo.label}</Badge>
                                    </HStack>
                                    <HStack spacing={2}>
                                        <Text fontWeight="bold">Insumo:</Text>
                                        <Text>{seguimiento.insumoNombre}</Text>
                                    </HStack>
                                    <HStack spacing={2}>
                                        <Text fontWeight="bold">Cantidad Requerida:</Text>
                                        <Text>{seguimiento.cantidadRequerida}</Text>
                                    </HStack>
                                </Box>
                            );
                        })}
                    </VStack>
                </Collapse>
            </Flex>
        </Box>
    );
}

export default OrdenProduccionCard;
