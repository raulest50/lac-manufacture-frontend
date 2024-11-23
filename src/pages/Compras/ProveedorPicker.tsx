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
} from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from "../../api/EndPointsURL.tsx";

const endPoints = new EndPointsURL();

interface Proveedor {
    id: number;
    nombre: string;
}

interface ProveedorPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectProveedor: (nit: string) => void;
}

const ProveedorPicker: React.FC<ProveedorPickerProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             onSelectProveedor,
                                                         }) => {
    const [searchText, setSearchText] = useState('');
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [selectedProveedorId, setSelectedProveedorId] = useState<number | null>(null);
    const toast = useToast();

    const handleSearch = async () => {
        try {
            const response = await axios.get(endPoints.search_proveedores, {
                params: { q: searchText },
            });
            setProveedores(response.data);
            setSelectedProveedorId(null); // Reset selection on new search
        } catch (error) {
            console.error('Error searching proveedores:', error);
            toast({
                title: 'Error',
                description: 'Failed to search proveedores.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleConfirm = () => {
        if (selectedProveedorId !== null) {
            const selectedProveedor = proveedores.find(
                (p) => p.id === selectedProveedorId
            );
            if (selectedProveedor) {
                onSelectProveedor(selectedProveedor.id.toString());
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
                <ModalHeader>Select Proveedor</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel>Search Proveedor</FormLabel>
                            <Input
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={onKeyPress_InputBuscar}
                                placeholder="Enter name or NIT"
                            />
                        </FormControl>
                        <Box w="full">
                            <RadioGroup
                                value={selectedProveedorId ? selectedProveedorId.toString() : ''}
                                onChange={(value) => setSelectedProveedorId(parseInt(value))}
                            >
                                <List spacing={2}>
                                    {proveedores.map((proveedor) => (
                                        <ListItem key={proveedor.id} borderBottom="1px solid #ccc">
                                            <HStack>
                                                <Radio value={proveedor.id.toString()} />
                                                <Text>
                                                    NIT: {proveedor.id} - {proveedor.nombre}
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
                        Confirm
                    </Button>
                    <Button variant="ghost" onClick={handleCancel}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ProveedorPicker;
