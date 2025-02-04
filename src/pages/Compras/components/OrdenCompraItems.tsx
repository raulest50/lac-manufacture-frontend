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
}

const OrdenCompraItems: React.FC<OrdenCompraItemsProps> = ({
                                                               items,
                                                               onRemoveItem,
                                                               onUpdateItem,
                                                           }) => {
    // Calculate totals based on the items array.
    const totalSubTotal = items.reduce(
        (sum, item) => sum + item.cantidad * item.precioUnitario,
        0
    );
    const totalIVA = Math.round(
        items.reduce(
            (sum, item) => sum + item.cantidad * item.precioUnitario * 0.19,
            0
        )
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
                        <Th isNumeric>IVA (19%)</Th>
                        <Th isNumeric>Subtotal</Th>
                        <Th>Acciones</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {items.map((item, index) => {
                        const itemSubtotal = item.cantidad * item.precioUnitario;
                        const itemIVA = Math.round(itemSubtotal * 0.19);
                        return (
                            <Tr key={index}>
                                <Td>{item.materiaPrima.productoId}</Td>
                                <Td>{item.materiaPrima.nombre}</Td>
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
                                <Td isNumeric>{itemIVA}</Td>
                                <Td isNumeric>{itemSubtotal}</Td>
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
                        <Td colSpan={4} textAlign="right">
                            <strong>SubTotal:</strong>
                        </Td>
                        <Td isNumeric colSpan={3}>
                            {totalSubTotal}
                        </Td>
                    </Tr>
                    <Tr>
                        <Td colSpan={4} textAlign="right">
                            <strong>IVA (19%):</strong>
                        </Td>
                        <Td isNumeric colSpan={3}>
                            {totalIVA}
                        </Td>
                    </Tr>
                    <Tr>
                        <Td colSpan={4} textAlign="right">
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

export default OrdenCompraItems;
