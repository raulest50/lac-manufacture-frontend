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
                <HStack spacing={4}>
                    <Text fontWeight="bold">Orden ID:</Text>
                    <Text>{ordenProduccion.ordenId}</Text>
                    <Text fontWeight="bold">Producto:</Text>
                    <Text>{ordenProduccion.productoNombre}</Text>
                    <Text fontWeight="bold">Fecha Creación:</Text>
                    <Text>{format(new Date(ordenProduccion.fechaInicio), 'dd/MM/yyyy HH:mm')}</Text>
                    <Badge colorScheme={estadoOrdenInfo.colorScheme}>{estadoOrdenInfo.label}</Badge>
                </HStack>

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
                        {ordenProduccion.ordenesSeguimiento.map((seguimiento: OrdenSeguimientoDTO) => {
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
