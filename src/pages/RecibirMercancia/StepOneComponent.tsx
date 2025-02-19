// StepOneComponent.tsx
import {
    Box,
    Button,
    Flex,
    Heading,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { OrdenCompra, ItemOrdenCompra } from "./types.tsx";

interface StepOneComponentProps {
    setActiveStep: (step: number) => void;
    orden: OrdenCompra | null;
}

export default function StepOneComponent({
                                             setActiveStep,
                                             orden,
                                         }: StepOneComponentProps) {
    // Local copy of the order's items to track verification state.
    const [items, setItems] = useState<ItemOrdenCompra[]>([]);

    // When the order is received (or changes), initialize local items state.
    useEffect(() => {
        if (orden && orden.itemsOrdenCompra) {
            // Make a shallow copy so that changes here don’t affect the original object.
            setItems(orden.itemsOrdenCompra.map((item) => ({ ...item })));
        }
    }, [orden]);

    // When a user verifies an item (1: concuerda, -1: no concuerda)
    const handleVerify = (index: number, result: number) => {
        setItems((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], cantidadCorrecta: result };
            return updated;
        });
    };

    const onClickContinuar = () => {
        // Proceed to the next step.
        setActiveStep(2);
    };

    const onClickReportarDiscrepancia = () => {

    };

    // If no order is loaded, show a friendly message.
    if (!orden) {
        return <Text>No se ha seleccionado ninguna orden.</Text>;
    }

    // Helper function to format date strings.
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString();
    };

    return (
        <Box p="1em" bg="blue.50">
            <Flex direction="column" gap={4} align="center">
                <Heading fontFamily="Comfortaa Variable">
                    Verificar Cantidades
                </Heading>
                {/* Top Section: Proveedor & Order Dates */}
                <Flex direction="column" align="center" gap={2}>
                    <Text fontFamily="Comfortaa Variable">
                        <strong>Proveedor:</strong> {orden.proveedor.nombre}
                    </Text>
                    <Text fontFamily="Comfortaa Variable">
                        <strong>Fecha Emisión:</strong> {formatDate(orden.fechaEmision)}
                    </Text>
                    <Text fontFamily="Comfortaa Variable">
                        <strong>Fecha Vencimiento:</strong> {formatDate(orden.fechaVencimiento)}
                    </Text>
                </Flex>
                <Text fontFamily="Comfortaa Variable" textAlign="center">
                    Para cada item, verifique que las cantidades concuerdan. Si alguna no
                    coincide, deberá indicarlo para poder generar correctamente el ingreso
                    a almacén.
                </Text>
                {/* Table with Order Items */}
                <Box w="full" overflowX="auto">
                    <Table variant="striped">
                        <Thead>
                            <Tr>
                                <Th>Producto ID</Th>
                                <Th>Nombre</Th>
                                <Th isNumeric>Cantidad</Th>
                                <Th>Verificar</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {items.map((item, index) => (
                                <Tr key={index}>
                                    <Td>{item.materiaPrima.productoId}</Td>
                                    <Td>{item.materiaPrima.nombre}</Td>
                                    <Td isNumeric>{item.cantidad}</Td>
                                    <Td>
                                        {item.cantidadCorrecta === 0 ? (
                                            <Flex gap={2}>
                                                <Button
                                                    size="sm"
                                                    colorScheme="green"
                                                    onClick={() => handleVerify(index, 1)}
                                                >
                                                    Sí
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    colorScheme="red"
                                                    onClick={() => handleVerify(index, -1)}
                                                >
                                                    No
                                                </Button>
                                            </Flex>
                                        ) : (
                                            <Button
                                                size="sm"
                                                isDisabled
                                                colorScheme={
                                                    item.cantidadCorrecta === 1 ? "green" : "red"
                                                }
                                            >
                                                {item.cantidadCorrecta === 1
                                                    ? "Concuerda"
                                                    : "No Concuerda"}
                                            </Button>
                                        )}
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
                {/* Global Confirm Button */}
                <Flex w="40%" direction="column" gap={4}>
                    <Button
                        variant="solid"
                        colorScheme="teal"
                        isDisabled={!items.every((item) => item.cantidadCorrecta === 1)}
                        onClick={onClickContinuar}
                        hidden={ items.some((item) => item.cantidadCorrecta === -1) }
                    >
                        Confirmar Las Cantidades Concuerdan
                    </Button>
                </Flex>
                <Flex direction={"column"} gap={5} hidden={!items.some((item) => item.cantidadCorrecta === -1)}>
                    <Text fontFamily={"Comfortaa Variable"} textAlign="center"> Si almenos una de las cantidades no coincide con la orden de compra, no se puede dar ingreso a almacen </Text>
                    <Text fontFamily={"Comfortaa Variable"} textAlign="center"> termine de contar las otras cantidades y haga el reporte de que la mercancia no puede ser recibida </Text>
                    <Button
                        colorScheme={"red"}
                        variant={"solid"}
                        onClick={onClickReportarDiscrepancia}
                        isDisabled={ items.some((item) => item.cantidadCorrecta === 0) }
                    >
                        Reportar Discrepancia
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
}
