
import { useState } from 'react';

import {
    Container,
    VStack,
    FormControl,
    FormLabel,
    HStack,
    Input,
    IconButton,
    Select,
    Button,
    Box,
    Text,
    List,
    ListItem,
    useToast,
} from '@chakra-ui/react';
import { FaSearch, FaTrash } from 'react-icons/fa';

import ProveedorPicker from './ProveedorPicker.tsx';
import MateriaPrimaPicker from './MateriaPrimaPicker.tsx';
import { MiItem, ItemCompra, Compra } from './types.tsx';
import { saveCompra } from './comprasService.tsx';

function RegistrarCompras() {
    // State variables
    const [selectedProveedorId, setSelectedProveedorId] = useState<string | null>(null);
    const [isProveedorPickerOpen, setIsProveedorPickerOpen] = useState(false);
    const [isMateriaPrimaPickerOpen, setIsMateriaPrimaPickerOpen] = useState(false);
    const [itemsCompra, setItemsCompra] = useState<ItemCompra[]>([]);
    const [estadoCompra, setEstadoCompra] = useState(0); // 0: open, 1: closed
    const toast = useToast();

    // Function to handle adding a Materia Prima to itemsCompra
    const handleAddMateriaPrima = (materiaPrima: MiItem) => {
        // Check if the item is already in the list
        const exists = itemsCompra.some(
            (item) => item.materiaPrima.productoId === materiaPrima.productoId
        );
        if (exists) {
            toast({
                title: 'Item ya agregado',
                description: 'La materia prima ya está en la lista',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        setItemsCompra([
            ...itemsCompra,
            {
                materiaPrima,
                cantidad: '',
                precioCompra: '',
            },
        ]);
    };

    // Function to handle removing an item from itemsCompra
    const handleRemoveItem = (productoId: number) => {
        setItemsCompra(
            itemsCompra.filter((item) => item.materiaPrima.productoId !== productoId)
        );
    };

    // Define the type of field to ensure type safety
    type ItemField = 'cantidad' | 'precioCompra';

    // Function to handle changes in cantidad and precioCompra
    const handleItemChange = (index: number, field: ItemField, value: string) => {
        const updatedItems = [...itemsCompra];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setItemsCompra(updatedItems);
    };

    // Function to save the Compra
    const handleSaveCompra = async () => {
        // Validate that a Proveedor is selected
        if (!selectedProveedorId) {
            toast({
                title: 'Proveedor no seleccionado',
                description: 'Debe seleccionar un proveedor',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        // Validate that at least one Materia Prima is selected
        if (itemsCompra.length === 0) {
            toast({
                title: 'No hay materias primas',
                description: 'Debe agregar al menos una materia prima',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        // Validate quantities and prices
        for (const item of itemsCompra) {
            if (
                !item.cantidad ||
                isNaN(Number(item.cantidad)) ||
                Number(item.cantidad) <= 0
            ) {
                toast({
                    title: 'Cantidad inválida',
                    description: `Cantidad inválida para ${item.materiaPrima.nombre}`,
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }
            if (
                !item.precioCompra ||
                isNaN(Number(item.precioCompra)) ||
                Number(item.precioCompra) <= 0
            ) {
                toast({
                    title: 'Precio de compra inválido',
                    description: `Precio inválido para ${item.materiaPrima.nombre}`,
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }
        }

        // Prepare the Compra object
        const compra: Compra = {
            proveedor: {
                id: Number(selectedProveedorId),
                nombre: '', // Include other necessary fields if required
            },
            estado: estadoCompra,
            itemsCompra: itemsCompra.map((item) => ({
                materiaPrima: {
                    productoId: item.materiaPrima.productoId,
                    tipo_producto: 'M', // Include tipo_producto as 'M' for MateriaPrima
                },
                cantidad: Number(item.cantidad),
                precioCompra: Number(item.precioCompra),
            })),
        };

        // Send to backend
        try {
            const responseData = await saveCompra(compra);
            toast({
                title: 'Compra guardada',
                description: `Compra guardada exitosamente con ID: ${responseData.compraId}`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            // Reset form
            setSelectedProveedorId(null);
            setItemsCompra([]);
        } catch (error) {
            console.error('Error saving compra:', error);
            toast({
                title: 'Error',
                description: 'Error al guardar la compra',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>

            <VStack spacing={4} align="stretch">
                {/* Proveedor selection */}
                <FormControl>
                    <FormLabel>Proveedor</FormLabel>
                    <HStack>
                        <IconButton
                            aria-label="Buscar Proveedor"
                            icon={<FaSearch />}
                            onClick={() => setIsProveedorPickerOpen(true)}
                        />
                        <Input
                            isReadOnly
                            value={selectedProveedorId ? `ID: ${selectedProveedorId}` : ''}
                            placeholder="Seleccione un proveedor"
                        />
                    </HStack>
                </FormControl>

                {/* Estado de la compra */}
                <FormControl>
                    <FormLabel>Estado de la Compra</FormLabel>
                    <Select
                        value={estadoCompra}
                        onChange={(e) => setEstadoCompra(Number(e.target.value))}
                    >
                        <option value={0}>Abierta</option>
                        <option value={1}>Cerrada</option>
                    </Select>
                </FormControl>

                {/* Button to open MateriaPrimaPicker */}
                <Button onClick={() => setIsMateriaPrimaPickerOpen(true)}>
                    Agregar Materia Prima
                </Button>

                {/* List of selected Materia Primas */}
                <Box borderWidth="1px" borderRadius="md" p={2}>
                    <Text fontWeight="bold">Materias Primas Seleccionadas:</Text>
                    {itemsCompra.length === 0 ? (
                        <Text>No hay materias primas seleccionadas</Text>
                    ) : (
                        <List spacing={2}>
                            {itemsCompra.map((item, index) => (
                                <ListItem key={item.materiaPrima.productoId}>
                                    <HStack>
                                        <Text>
                                            {item.materiaPrima.nombre} (ID:{' '}
                                            {item.materiaPrima.productoId})
                                        </Text>
                                        <Input
                                            placeholder="Cantidad"
                                            value={item.cantidad}
                                            onChange={(e) =>
                                                handleItemChange(index, 'cantidad', e.target.value)
                                            }
                                            width="100px"
                                        />
                                        <Input
                                            placeholder="Precio Compra"
                                            value={item.precioCompra}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    'precioCompra',
                                                    e.target.value
                                                )
                                            }
                                            width="100px"
                                        />
                                        <IconButton
                                            aria-label="Eliminar"
                                            icon={<FaTrash />}
                                            onClick={() =>
                                                handleRemoveItem(item.materiaPrima.productoId)
                                            }
                                        />
                                    </HStack>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>

                {/* Save Compra button */}
                <Button colorScheme="teal" onClick={handleSaveCompra}>
                    Guardar Compra
                </Button>
            </VStack>

            {/* ProveedorPicker Modal */}
            <ProveedorPicker
                isOpen={isProveedorPickerOpen}
                onClose={() => setIsProveedorPickerOpen(false)}
                onSelectProveedor={(id) => setSelectedProveedorId(id)}
            />

            {/* MateriaPrimaPicker Modal */}
            <MateriaPrimaPicker
                isOpen={isMateriaPrimaPickerOpen}
                onClose={() => setIsMateriaPrimaPickerOpen(false)}
                onSelectMateriaPrima={handleAddMateriaPrima}
            />
        </Container>
    );
}

export default RegistrarCompras;
