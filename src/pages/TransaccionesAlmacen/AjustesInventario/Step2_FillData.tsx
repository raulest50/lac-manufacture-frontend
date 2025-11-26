import {
    Box,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    Input,
} from "@chakra-ui/react";
import { Producto } from "../../Productos/types.tsx";

interface Step2FillDataProps {
    selectedProducts: Producto[];
    quantities: Record<string, number | "">;
    onChangeQuantity: (productoId: string, value: string) => void;
}

export default function Step2FillData({
    selectedProducts,
    quantities,
    onChangeQuantity,
}: Step2FillDataProps) {
    return (
        <Box p={4} borderWidth={"1px"} borderRadius={"md"} borderColor={"gray.200"} w={"full"}>
            <Text fontSize={"lg"} fontWeight={"semibold"} mb={3}>
                Ajustar unidades
            </Text>
            {selectedProducts.length > 0 ? (
                <Table size={"sm"} variant={"simple"}>
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Nombre</Th>
                            <Th>Tipo</Th>
                            <Th>Stock actual</Th>
                            <Th>Unidades de ajuste</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {selectedProducts.map((producto) => (
                            <Tr key={producto.productoId}>
                                <Td>{producto.productoId}</Td>
                                <Td>{producto.nombre}</Td>
                                <Td textTransform={"capitalize"}>{producto.tipo_producto}</Td>
                                <Td></Td>
                                <Td>
                                    <Input
                                        type={"number"}
                                        value={quantities[producto.productoId] ?? ""}
                                        onChange={(e) => onChangeQuantity(producto.productoId, e.target.value)}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            ) : (
                <Text color={"gray.500"}>Selecciona productos para ajustar su inventario.</Text>
            )}
        </Box>
    );
}
