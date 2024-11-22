// src/components/MateriaPrimaPicker.tsx

import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    List,
    ListItem,
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
    Radio,
    RadioGroup,
    Select,
} from '@chakra-ui/react';
import axios from 'axios';
import { ServerParams } from '../../api/params.tsx';
import { MiItem } from './types.tsx';

interface MateriaPrimaPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectMateriaPrima: (materiaPrima: MiItem) => void;
}

const MateriaPrimaPicker: React.FC<MateriaPrimaPickerProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   onSelectMateriaPrima,
                                                               }) => {
    const [searchText, setSearchText] = useState('');
    const [tipoBusqueda, setTipoBusqueda] = useState('NOMBRE'); // 'NOMBRE' or 'ID'
    const [materiasPrimas, setMateriasPrimas] = useState<MiItem[]>([]);
    const [selectedMateriaPrimaId, setSelectedMateriaPrimaId] = useState<number | null>(null);
    const toast = useToast();

    const handleSearch = async () => {
        try {
            const response = await axios.get(ServerParams.getMateriaPrimaEndPoint_search(), {
                params: { search: searchText, tipoBusqueda: tipoBusqueda },
            });
            const updatedMateriasPrimas = response.data.content.map((item: MiItem) => ({
                ...item,
                tipo_producto: 'M', // Ensure tipo_producto is set
            }));
            setMateriasPrimas(updatedMateriasPrimas);
            setSelectedMateriaPrimaId(null); // Reset selection on new search
        } catch (error) {
            console.error('Error searching materias primas:', error);
            toast({
                title: 'Error',
                description: 'Failed to search materias primas.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleConfirm = () => {
        if (selectedMateriaPrimaId !== null) {
            const selectedMateriaPrima = materiasPrimas.find(
                (p) => p.productoId === selectedMateriaPrimaId
            );
            if (selectedMateriaPrima) {
                onSelectMateriaPrima(selectedMateriaPrima);
            }
        }
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    const onKeyPress_InputBuscar = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Seleccionar Materia Prima</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel>Buscar Materia Prima</FormLabel>
                            <HStack>
                                <Input
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onKeyDown={onKeyPress_InputBuscar}
                                    placeholder="Ingrese nombre o ID"
                                />
                                <Select
                                    value={tipoBusqueda}
                                    onChange={(e) => setTipoBusqueda(e.target.value)}
                                    width="150px"
                                >
                                    <option value="NOMBRE">Nombre</option>
                                    <option value="ID">ID</option>
                                </Select>
                                <Button onClick={handleSearch}>Buscar</Button>
                            </HStack>
                        </FormControl>
                        <Box w="full">
                            <RadioGroup
                                value={
                                    selectedMateriaPrimaId
                                        ? selectedMateriaPrimaId.toString()
                                        : ''
                                }
                                onChange={(value) =>
                                    setSelectedMateriaPrimaId(parseInt(value))
                                }
                            >
                                <List spacing={2}>
                                    {materiasPrimas.map((materiaPrima) => (
                                        <ListItem
                                            key={materiaPrima.productoId}
                                            borderBottom="1px solid #ccc"
                                        >
                                            <HStack>
                                                <Radio value={materiaPrima.productoId.toString()} />
                                                <Text>
                                                    ID: {materiaPrima.productoId} -{' '}
                                                    {materiaPrima.nombre}
                                                </Text>
                                            </HStack>
                                        </ListItem>
                                    ))}
                                </List>
                            </RadioGroup>
                        </Box>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleConfirm}>
                        Confirmar
                    </Button>
                    <Button variant="ghost" onClick={handleCancel}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default MateriaPrimaPicker;