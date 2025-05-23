// components/ListaItemsActivos.tsx
import {
    Table, Thead, Tbody, Tr, Th, Td,
    Input, NumberInput, NumberInputField,
    Button, IconButton, Flex, Text, Tfoot
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { ItemOCActivo } from "../types.tsx";
import {Dispatch, FC, SetStateAction, useMemo} from "react";

interface Props {
    items: ItemOCActivo[];
    setItems: Dispatch<SetStateAction<ItemOCActivo[]>>;
}

const ListaItemsOCA: FC<Props> = ({ items, setItems }) => {
    // add empty row
    const addRow = () => {
        setItems([
            ...items,
            {
                itemOrdenId: Date.now(),
                activo: {
                    idActivo: "",
                    descripcion: "",
                    precio: 0,
                    ivaValue: 0,
                    ivaPercentage: 0
                },
                cantidad: 1,
                subTotal: 0
            }
        ]);
    };

    // remove a row by its unique id
    const removeRow = (id: number) => {
        setItems(items.filter(i => i.itemOrdenId !== id));
    };

    // update a cell and recompute IVA & subtotal
    const updateRow = (
        idx: number,
        field: keyof ItemOCActivo["activo"] | "cantidad",
        raw: string | number
    ) => {
        const newItems = [...items];
        const row = newItems[idx];

        if (field === "cantidad") {
            row.cantidad = Number(raw);
        } else {

            row.activo[field] = typeof raw === "string" ? raw : Number(raw);
        }

        // recompute ivaValue and subTotal
        const { precio, ivaPercentage } = row.activo;
        const ivaValue = precio * (ivaPercentage / 100);
        row.activo.ivaValue = ivaValue;
        row.subTotal = (precio + ivaValue) * row.cantidad;

        setItems(newItems);
    };

    // 1. Totals
    const { totalIva, totalBeforeIva, totalAfterIva } = useMemo(() => {
        const totIva   = items.reduce((sum, row) => sum + row.activo.ivaValue * row.cantidad, 0);
        const totBase  = items.reduce((sum, row) => sum + row.activo.precio    * row.cantidad, 0);
        const totAll   = items.reduce((sum, row) => sum + row.subTotal, 0);
        return {
            totalIva:     totIva,
            totalBeforeIva: totBase,
            totalAfterIva:  totAll,
        };
    }, [items]);

    return (
        <Flex direction="column" p="1em" boxShadow="sm" mb="4">
            <Flex justify="space-between" mb="2">
                <Text fontWeight="bold">Items Activos</Text>
                <Button size="sm" leftIcon={<AddIcon />} onClick={addRow}>
                    Agregar activo
                </Button>
            </Flex>

            <Table variant="striped" size="sm">
                <Thead>
                    <Tr>
                        <Th w={"15%"}>Id Activo</Th>
                        <Th w={"30%"}>Descripción</Th>
                        <Th w={"15%"} isNumeric>Precio</Th>
                        <Th w={"10%"} isNumeric>% IVA</Th>
                        <Th w={"10%"} isNumeric>Valor IVA</Th>
                        <Th w={"5%"} isNumeric>Cantidad</Th>
                        <Th w={"10%"} isNumeric>Subtotal</Th>
                        <Th w={"5%"}>Acción</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {items.map((item, idx) => (
                        <Tr key={item.itemOrdenId}>
                            <Td>
                                <Input
                                    size="sm"
                                    value={item.activo.idActivo}
                                    onChange={e =>
                                        updateRow(idx, "idActivo", e.target.value)
                                    }
                                />
                            </Td>
                            <Td>
                                <Input
                                    size="sm"
                                    value={item.activo.descripcion}
                                    onChange={e =>
                                        updateRow(idx, "descripcion", e.target.value)
                                    }
                                />
                            </Td>
                            <Td isNumeric>
                                <NumberInput
                                    size="sm"
                                    value={item.activo.precio}
                                    onChange={(_, val) => updateRow(idx, "precio", val)}
                                    min={0}
                                >
                                    <NumberInputField />
                                </NumberInput>
                            </Td>
                            <Td isNumeric>
                                <NumberInput
                                    size="sm"
                                    value={item.activo.ivaPercentage}
                                    onChange={(_, val) =>
                                        updateRow(idx, "ivaPercentage", val)
                                    }
                                    min={0}
                                >
                                    <NumberInputField />
                                </NumberInput>
                            </Td>
                            <Td isNumeric>
                                {item.activo.ivaValue.toFixed(2)}
                            </Td>
                            <Td isNumeric>
                                <NumberInput
                                    size="sm"
                                    value={item.cantidad}
                                    onChange={(_, val) => updateRow(idx, "cantidad", val)}
                                    min={1}
                                >
                                    <NumberInputField />
                                </NumberInput>
                            </Td>
                            <Td isNumeric>{item.subTotal.toFixed(2)}</Td>
                            <Td>
                                <IconButton
                                    size="xs"
                                    aria-label="Eliminar"
                                    icon={<DeleteIcon />}
                                    onClick={() => removeRow(item.itemOrdenId)}
                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>

                <Tfoot>
                    {/* Total before IVA */}
                    <Tr>
                        <Td colSpan={6} textAlign="right">
                            <strong>Total antes de IVA</strong>
                        </Td>
                        <Td isNumeric fontWeight="bold">
                            {totalBeforeIva.toFixed(2)}
                        </Td>
                        <Td />
                    </Tr>
                    {/* Total IVA row */}
                    <Tr>
                        <Td colSpan={6} textAlign={"right"}>
                            <strong>Total IVA</strong>
                        </Td>
                        <Td isNumeric fontWeight="bold">
                            {totalIva.toFixed(2)}
                        </Td>
                    </Tr>
                    {/* Total with IVA */}
                    <Tr>
                        <Td colSpan={6} textAlign={"right"}>
                            <strong>Total despues de IVA</strong>
                        </Td>
                        <Td isNumeric fontWeight="bold">{totalAfterIva.toFixed(2)}</Td>
                        <Td />
                    </Tr>
                </Tfoot>

            </Table>
        </Flex>
    );
};

export default ListaItemsOCA;
