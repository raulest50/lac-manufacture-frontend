// src/components/OrdenCompraItems.tsx
import React from 'react';
import { VStack, HStack, Input, Button, Text } from '@chakra-ui/react';
import { ItemOrdenCompra } from '../types.tsx';

interface OrdenCompraItemsProps {
    items: ItemOrdenCompra[];
    onRemoveItem: (index: number) => void;
    onUpdateItem: (index: number, field: 'cantidad' | 'precioUnitario', value: number) => void;
}

const OrdenCompraItems: React.FC<OrdenCompraItemsProps> = ({
                                                               items,
                                                               onRemoveItem,
                                                               onUpdateItem,
                                                           }) => {
    return (
        <VStack spacing={4} align="stretch" mt={4}>
            {items.map((item, index) => (
                <HStack key={index} spacing={4}>
                    <Text minW="150px">{item.materiaPrima.nombre}</Text>
                    <Input
                        placeholder="Cantidad"
                        type="number"
                        value={item.cantidad}
                        onChange={(e) =>
                            onUpdateItem(index, 'cantidad', parseFloat(e.target.value))
                        }
                    />
                    <Input
                        placeholder="Precio Unitario"
                        type="number"
                        value={item.precioUnitario}
                        onChange={(e) =>
                            onUpdateItem(index, 'precioUnitario', parseFloat(e.target.value))
                        }
                    />
                    <Button colorScheme="red" onClick={() => onRemoveItem(index)}>
                        Eliminar
                    </Button>
                </HStack>
            ))}
        </VStack>
    );
};

export default OrdenCompraItems;
