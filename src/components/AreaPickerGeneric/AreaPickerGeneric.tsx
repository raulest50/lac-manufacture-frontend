// src/components/AreaPickerGeneric/AreaPickerGeneric.tsx

import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useToast,
    VStack,
    HStack,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Flex,
} from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from "../../api/EndPointsURL.tsx";

const endPoints = new EndPointsURL();

// Interface for AreaProduccion based on the backend model
interface AreaProduccion {
    areaId: number;
    nombre: string;
    descripcion: string;
    responsableArea?: any; // We don't need the full User type here
}

// DTO for searching AreaProduccion
interface SearchAreaProduccionDTO {
    nombre: string;
}

interface AreaPickerGenericProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectArea: (area: AreaProduccion) => void;
}

const AreaPickerGeneric: React.FC<AreaPickerGenericProps> = ({
    isOpen,
    onClose,
    onSelectArea,
}) => {
    const [searchText, setSearchText] = useState('');
    const [areas, setAreas] = useState<AreaProduccion[]>([]);
    const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;
    const toast = useToast();

    const handleSearch = async () => {
        if (!searchText.trim()) {
            toast({
                title: 'Error',
                description: 'Por favor ingrese un texto de búsqueda.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);
        try {
            const searchDTO: SearchAreaProduccionDTO = {
                nombre: searchText
            };
            
            const response = await axios.post(endPoints.area_prod_search_by_name, searchDTO, {
                params: {
                    page: 0,
                    size: 100
                }
            });
            setAreas(response.data);
            setSelectedAreaId(null); // Reset selection on new search
            setCurrentPage(1); // Reset to first page on new search
        } catch (error) {
            console.error('Error searching Areas:', error);
            toast({
                title: 'Error',
                description: 'Error al buscar áreas de producción.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = () => {
        if (selectedAreaId !== null) {
            const area = areas.find((a) => a.areaId === selectedAreaId);
            if (area) {
                onSelectArea(area);
            }
        }
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    const onKeyPress_InputBuscar = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !isLoading) {
            handleSearch();
        }
    };

    // Calculate pagination
    const totalPages = Math.ceil(areas.length / resultsPerPage);
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const currentAreas = areas.slice(startIndex, endIndex);

    // Handle pagination
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Seleccionar Área de Producción</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel>Buscar Área</FormLabel>
                            <HStack>
                                <Input
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onKeyDown={onKeyPress_InputBuscar}
                                    placeholder="Ingrese nombre del área"
                                    isDisabled={isLoading}
                                />
                                <Button 
                                    colorScheme="blue" 
                                    onClick={handleSearch} 
                                    isLoading={isLoading}
                                    loadingText="Buscando"
                                >
                                    Buscar
                                </Button>
                            </HStack>
                        </FormControl>
                        <Box w="full" overflowX="auto">
                            {areas.length > 0 ? (
                                <>
                                    <Table variant="simple" size="sm">
                                        <Thead>
                                            <Tr>
                                                <Th>ID</Th>
                                                <Th>Nombre</Th>
                                                <Th>Descripción</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {currentAreas.map((area) => (
                                                <Tr 
                                                    key={area.areaId} 
                                                    onClick={() => setSelectedAreaId(area.areaId)}
                                                    bg={selectedAreaId === area.areaId ? "teal.100" : "transparent"}
                                                    _hover={{ bg: "gray.100", cursor: "pointer" }}
                                                >
                                                    <Td>{area.areaId}</Td>
                                                    <Td>{area.nombre}</Td>
                                                    <Td>{area.descripcion}</Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>

                                    {/* Pagination controls */}
                                    {totalPages > 1 && (
                                        <Flex justifyContent="center" mt={4}>
                                            <Button 
                                                size="sm" 
                                                onClick={() => goToPage(currentPage - 1)} 
                                                isDisabled={currentPage === 1}
                                                mr={2}
                                            >
                                                Anterior
                                            </Button>
                                            <Text alignSelf="center" mx={2}>
                                                Página {currentPage} de {totalPages}
                                            </Text>
                                            <Button 
                                                size="sm" 
                                                onClick={() => goToPage(currentPage + 1)} 
                                                isDisabled={currentPage === totalPages}
                                                ml={2}
                                            >
                                                Siguiente
                                            </Button>
                                        </Flex>
                                    )}
                                </>
                            ) : (
                                <Text textAlign="center">No hay áreas para mostrar</Text>
                            )}
                        </Box>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button 
                        colorScheme="teal" 
                        mr={3} 
                        onClick={handleConfirm}
                        isDisabled={selectedAreaId === null}
                    >
                        Aceptar
                    </Button>
                    <Button variant="ghost" onClick={handleCancel}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AreaPickerGeneric;