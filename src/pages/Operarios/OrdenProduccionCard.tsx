// src/components/OrdenProduccionCard.tsx

import React, { useState } from 'react';
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
    Button,
} from "@chakra-ui/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { OrdenProduccionDTO, OrdenSeguimientoDTO } from "./types.tsx";
import { format } from 'date-fns';
import axios from 'axios';
import EndPointsURL from '../../api/EndPointsURL';

interface OrdenProduccionCardProps {
    ordenProduccion: OrdenProduccionDTO;
}

const endPoints = new EndPointsURL();

const OrdenProduccionCard: React.FC<OrdenProduccionCardProps> = ({ ordenProduccion }) => {
    const { isOpen, onToggle } = useDisclosure();
    const [orden, setOrden] = useState<OrdenProduccionDTO>(ordenProduccion);

    // Helper functions
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

    // Check if all OrdenesSeguimiento are finished
    const allSeguimientosFinished = orden.ordenesSeguimiento.every(os => os.estado === 1);

    // Handle finishing an OrdenSeguimiento
    const handleFinishSeguimiento = async (seguimientoId: number) => {
        try {
            const response = await axios.put<OrdenSeguimientoDTO>(
                endPoints.orden_seguimiento_update_estado.replace("{id}", seguimientoId.toString()),
                null,
                { params: { estado: 1 } }
            );
            // Update local state
            setOrden(prevOrden => {
                const updatedSeguimientos = prevOrden.ordenesSeguimiento.map(os =>
                    os.seguimientoId === seguimientoId ? response.data : os
                );
                return { ...prevOrden, ordenesSeguimiento: updatedSeguimientos };
            });
        } catch (error) {
            console.error('Error updating OrdenSeguimiento', error);
        }
    };

    // Handle finishing the OrdenProduccion
    const handleFinishOrdenProduccion = async () => {
        try {
            const response = await axios.put<OrdenProduccionDTO>(
                endPoints.orden_produccion_update_estado.replace("{id}", orden.ordenId.toString()),
                null,
                { params: { estadoOrden: 1 } }
            );
            // Update local state
            setOrden(response.data);
        } catch (error) {
            console.error('Error updating OrdenProduccion', error);
        }
    };

    const estadoOrdenInfo = getEstadoOrdenInfo(orden.estadoOrden);

    return (
        <Box borderWidth="1px" borderRadius="lg" p={4} mb={4} boxShadow="sm">
            <Flex direction="column">
                {/* Header Information */}
                <HStack spacing={4}>
                    <Text fontWeight="bold">Orden ID:</Text>
                    <Text>{orden.ordenId}</Text>
                    <Text fontWeight="bold">Producto:</Text>
                    <Text>{orden.productoNombre}</Text>
                    <Text fontWeight="bold">Fecha Creación:</Text>
                    <Text>{format(new Date(orden.fechaInicio), 'dd/MM/yyyy HH:mm')}</Text>
                    <Badge colorScheme={estadoOrdenInfo.colorScheme}>{estadoOrdenInfo.label}</Badge>
                </HStack>

                {/* Finish OrdenProduccion Button */}
                <Flex justify="flex-end" mt={2}>
                    <Button
                        colorScheme="green"
                        size="sm"
                        onClick={handleFinishOrdenProduccion}
                        isDisabled={!allSeguimientosFinished || orden.estadoOrden === 1}
                    >
                        Reportar Orden Produccion Terminada
                    </Button>
                    <IconButton
                        aria-label="Toggle Ordenes Seguimiento"
                        icon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
                        size="sm"
                        onClick={onToggle}
                        variant="ghost"
                        ml={2}
                    />
                </Flex>

                {/* Collapsible List of Ordenes Seguimiento */}
                <Collapse in={isOpen} animateOpacity>
                    <VStack align="start" mt={4} spacing={3}>
                        {orden.ordenesSeguimiento.map((seguimiento: OrdenSeguimientoDTO) => {
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
                                    {/* Show button only if estado === 0 */}
                                    {seguimiento.estado === 0 && (
                                        <Flex justify="flex-end" mt={2}>
                                            <Button
                                                colorScheme="green"
                                                size="sm"
                                                onClick={() => handleFinishSeguimiento(seguimiento.seguimientoId)}
                                            >
                                                Marcar como Finalizada
                                            </Button>
                                        </Flex>
                                    )}
                                </Box>
                            );
                        })}
                    </VStack>
                </Collapse>
            </Flex>
        </Box>
    );
};

export default OrdenProduccionCard;
