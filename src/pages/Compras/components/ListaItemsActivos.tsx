// components/ListaItemsActivos.tsx
import {
    Table, Thead, Tbody, Tr, Th, Td,
    Input, NumberInput, NumberInputField,
    Button, IconButton, Flex, Text
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { ItemOCActivo } from "../types.tsx";
import { Dispatch, FC, SetStateAction } from "react";

interface Props {
    items: ItemOCActivo[];
    setItems: Dispatch<SetStateAction<ItemOCActivo[]>>;
}

const ListaItemsActivos: FC<Props> = ({ items, setItems }) => {
    // add empty row
    const addRow = () => {
        setItems([
            ...items,
            {
                itemOrdenId: Date.now(),
                activo: {
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
                        <Th>Descripción</Th>
                        <Th isNumeric>Precio</Th>
                        <Th isNumeric>% IVA</Th>
                        <Th isNumeric>Valor IVA</Th>
                        <Th isNumeric>Cantidad</Th>
                        <Th isNumeric>Subtotal</Th>
                        <Th>Acción</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {items.map((item, idx) => (
                        <Tr key={item.itemOrdenId}>
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
            </Table>
        </Flex>
    );
};

export default ListaItemsActivos;
