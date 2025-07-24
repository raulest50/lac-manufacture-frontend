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
import { formatCOP } from '../../../utils/formatters';

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
    currency?: string; // Nueva propiedad para la divisa
}

const ListaItemsOCM: React.FC<OrdenCompraItemsProps> = ({
                                                               items,
                                                               onRemoveItem,
                                                               onUpdateItem,
                                                               ivaEnabled,
                                                               onToggleIva,
                                                               currency = 'COP',
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
                        <Th isNumeric>Precio Unitario ({currency})</Th>
                        <Th isNumeric>IVA %</Th>
                        <Th isNumeric>
                            <Flex alignItems="center" justifyContent="flex-end">
                                <Text mr={2}>IVA ({currency})</Text>
                                <Switch 
                                    isChecked={ivaEnabled} 
                                    onChange={(e) => onToggleIva(e.target.checked)}
                                    colorScheme="teal"
                                />
                            </Flex>
                        </Th>
                        <Th isNumeric>Subtotal ({currency})</Th>
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
                                <Td isNumeric>{item.material.ivaPercentual}%</Td>
                                <Td isNumeric>{formatCOP(item.ivaCOP)}</Td>
                                <Td isNumeric>{formatCOP(item.subTotal)}</Td>
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
                            {formatCOP(totalSubTotal)}
                        </Td>
                    </Tr>
                    <Tr>
                        <Td colSpan={5} textAlign="right">
                            <strong>IVA Total:</strong>
                        </Td>
                        <Td isNumeric colSpan={3}>
                            {formatCOP(totalIVA)}
                        </Td>
                    </Tr>
                    <Tr>
                        <Td colSpan={5} textAlign="right">
                            <strong>Total a Pagar:</strong>
                        </Td>
                        <Td isNumeric colSpan={3}>
                            {formatCOP(totalPagar)}
                        </Td>
                    </Tr>
                </Tfoot>
            </Table>
        </Box>
    );
};

export default ListaItemsOCM;
