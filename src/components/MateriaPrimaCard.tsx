// components/MateriaPrimaCard.tsx

import React, { useState } from 'react';
import {
    Card,
    Heading,
    Text,
    Flex,
    Divider,
    Box,
    Button,
    Collapse,
} from '@chakra-ui/react';
import {
    FaMoneyBillAlt,
    FaBoxes,
    FaBalanceScale,
    FaCalendarAlt,
    FaStickyNote,
} from 'react-icons/fa';

import { MateriaPrima } from '../models/Interfaces';

interface MateriaPrimaCardProps {
    materiaPrima: MateriaPrima;
    isSelected?: boolean;
    onClick: (materiaPrima: MateriaPrima) => void;
}

const MateriaPrimaCard: React.FC<MateriaPrimaCardProps> = ({
                                                               materiaPrima,
                                                               isSelected = false,
                                                               onClick,
                                                           }) => {
    const [showObservaciones, setShowObservaciones] = useState(false);

    const toggleObservaciones = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Prevent card's onClick when clicking the button
        setShowObservaciones(!showObservaciones);
    };

    return (
        <Card
            border="1px"
            borderColor="gray.200"
            boxShadow="md"
            p={4}
            bg={isSelected ? 'green.100' : 'white'}
            _hover={{ bg: 'blue.100' }}
            _active={{ bg: 'blue.200' }}
            onClick={() => onClick(materiaPrima)}
        >
            <Flex direction="column">
                {/* Header Section */}
                <Flex justify="space-between" align="center" mb={2}>
                    <Heading size="sm">Ref: {materiaPrima.referencia}</Heading>
                    <Text fontWeight="bold" mb={2}>
                        {materiaPrima.descripcion}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                        <FaCalendarAlt />{' '}
                        {new Date(materiaPrima.fechaCreacion).toLocaleDateString('es-CO')}
                    </Text>
                </Flex>

                <Divider mb={2} />

                {/* Details Section */}
                <Flex wrap="wrap" justify="space-between" fontSize="sm">
                    <Box w={['100%', '48%']} mb={2}>
                        <Flex align="center">
                            <FaMoneyBillAlt />
                            <Text ml={1}>
                                <strong>Costo:</strong> ${materiaPrima.costo.toLocaleString('es-CO')}
                            </Text>
                        </Flex>
                        <Flex align="center">
                            <FaBoxes />
                            <Text ml={1}>
                                <strong>Cantidad:</strong>{' '}
                                {materiaPrima.cantidad.toLocaleString('es-CO')}
                            </Text>
                        </Flex>
                    </Box>
                    <Box w={['100%', '48%']} mb={2}>
                        <Flex align="center">
                            <FaBalanceScale />
                            <Text ml={1}>
                                <strong>Tipo Unidades:</strong>{' '}
                                {materiaPrima.tipoUnidades || 'No especificado'}
                            </Text>
                        </Flex>
                        <Flex align="center">
                            <FaBalanceScale />
                            <Text ml={1}>
                                <strong>Contenido/U:</strong> {materiaPrima.contenidoPorUnidad}
                            </Text>
                        </Flex>
                    </Box>
                </Flex>

                {/* Observaciones Collapse Section */}
                {materiaPrima.observaciones && (
                    <>
                        <Button
                            size="sm"
                            variant="link"
                            mt={2}
                            onClick={toggleObservaciones}
                            alignSelf="flex-end"
                        >
                            {showObservaciones ? 'Ocultar Observaciones' : 'Mostrar Observaciones'}
                        </Button>
                        <Collapse in={showObservaciones} animateOpacity>
                            <Box
                                p={2}
                                mt={2}
                                borderWidth="1px"
                                borderRadius="md"
                                borderColor="gray.200"
                                bg="gray.50"
                            >
                                <Flex align="center">
                                    <FaStickyNote />
                                    <Text ml={1}>{materiaPrima.observaciones}</Text>
                                </Flex>
                            </Box>
                        </Collapse>
                    </>
                )}
            </Flex>
        </Card>
    );
};

export default MateriaPrimaCard;
