// src/components/OrdenCompraItems.tsx
import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    Input,
    Button,
    Box,
    Switch,
    Flex,
    Text,
} from '@chakra-ui/react';
import { ItemOrdenCompra } from '../types';

interface OrdenCompraItemsProps {
    items: ItemOrdenCompra[];
    onRemoveItem: (index: number) => void;
    onUpdateItem: (
        index: number,
        field: 'cantidad' | 'precioUnitario',
        value: number
    ) => void;
    ivaEnabled: boolean;
    onToggleIva: (enabled: boolean) => void;
}

const ListaItemsOCM: React.FC<OrdenCompraItemsProps> = ({
                                                               items,
                                                               onRemoveItem,
                                                               onUpdateItem,
                                                               ivaEnabled,
                                                               onToggleIva,
                                                           }) => {
    // Calculate totals based on the items array.
    const totalSubTotal = items.reduce(
        (sum, item) => sum + item.subTotal,
        0
    );
    const totalIVA = items.reduce(
        (sum, item) => sum + item.ivaCOP,
        0
    );
    const totalPagar = totalSubTotal + totalIVA;

    return (
        <Box overflowX="auto" mt={4}>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID Materia Prima</Th>
                        <Th>Nombre</Th>
                        <Th isNumeric>Cantidad</Th>
                        <Th isNumeric>Precio Unitario</Th>
                        <Th isNumeric>IVA %</Th>
                        <Th isNumeric>
                            <Flex alignItems="center" justifyContent="flex-end">
                                <Text mr={2}>IVA (COP)</Text>
                                <Switch 
                                    isChecked={ivaEnabled} 
                                    onChange={(e) => onToggleIva(e.target.checked)}
                                    colorScheme="teal"
                                />
                            </Flex>
                        </Th>
                        <Th isNumeric>Subtotal</Th>
                        <Th>Acciones</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {items.map((item, index) => {
                        return (
                            <Tr key={index}>
                                <Td>{item.material.productoId}</Td>
                                <Td>{item.material.nombre} ({item.material.tipoUnidades}) </Td>
                                <Td isNumeric>
                                    <Input
                                        size="sm"
                                        type="number"
                                        value={item.cantidad}
                                        onChange={(e) =>
                                            onUpdateItem(
                                                index,
                                                'cantidad',
                                                parseFloat(e.target.value)
                                            )
                                        }
                                    />
                                </Td>
                                <Td isNumeric>
                                    <Input
                                        size="sm"
                                        type="number"
                                        value={item.precioUnitario}
                                        onChange={(e) =>
                                            onUpdateItem(
                                                index,
                                                'precioUnitario',
                                                parseFloat(e.target.value)
                                            )
                                        }
                                    />
                                </Td>
                                <Td isNumeric>{item.material.iva_percentual}%</Td>
                                <Td isNumeric>{item.ivaCOP}</Td>
                                <Td isNumeric>{item.subTotal}</Td>
                                <Td>
                                    <Button
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => onRemoveItem(index)}
                                    >
                                        Eliminar
                                    </Button>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
                <Tfoot>
                    <Tr>
                        <Td colSpan={5} textAlign="right">
                            <strong>SubTotal:</strong>
                        </Td>
                        <Td isNumeric colSpan={3}>
                            {totalSubTotal}
                        </Td>
                    </Tr>
                    <Tr>
                        <Td colSpan={5} textAlign="right">
                            <strong>IVA Total:</strong>
                        </Td>
                        <Td isNumeric colSpan={3}>
                            {totalIVA}
                        </Td>
                    </Tr>
                    <Tr>
                        <Td colSpan={5} textAlign="right">
                            <strong>Total a Pagar:</strong>
                        </Td>
                        <Td isNumeric colSpan={3}>
                            {totalPagar}
                        </Td>
                    </Tr>
                </Tfoot>
            </Table>
        </Box>
    );
};

export default ListaItemsOCM;
