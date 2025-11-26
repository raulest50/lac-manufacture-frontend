import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { Producto } from "../../Productos/types.tsx";

interface Step3SendAjusteProps {
    selectedProducts: Producto[];
    quantities: Record<string, number | "">;
    lotNumbers: Record<string, string>;
    observaciones?: string;
    currentUserName?: string;
    onBack: () => void;
    onSend: () => Promise<void>;
    isSending: boolean;
    error?: string | null;
}

export default function Step3SendAjuste({
    selectedProducts,
    quantities,
    lotNumbers,
    observaciones,
    currentUserName,
    onBack,
    onSend,
    isSending,
    error,
}: Step3SendAjusteProps) {
    const renderObservaciones = () => {
        if (!observaciones || observaciones.trim() === "") {
            return <Text color={"gray.500"}>Sin observaciones adicionales.</Text>;
        }

        return <Text whiteSpace={"pre-line"}>{observaciones}</Text>;
    };

    return (
        <Flex direction={{ base: "column" }} gap={4}>
            <Box p={4} borderWidth={"1px"} borderRadius={"md"} borderColor={"gray.200"} w={"full"}>
                <Heading as={"h3"} size={"md"} mb={3}>
                    Resumen del ajuste
                </Heading>

                <Stack spacing={3} mb={4}>
                    <Flex alignItems={"center"} justifyContent={"space-between"}>
                        <Text fontWeight={"semibold"}>Usuario</Text>
                        <Text>{currentUserName ?? "No disponible"}</Text>
                    </Flex>
                    <Divider />
                    <Box>
                        <Text fontWeight={"semibold"} mb={2}>
                            Observaciones
                        </Text>
                        {renderObservaciones()}
                    </Box>
                </Stack>

                <Box overflowX={"auto"}>
                    <Table size={"sm"} variant={"simple"}>
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th>Nombre</Th>
                                <Th>Tipo</Th>
                                <Th isNumeric>Unidades de ajuste</Th>
                                <Th>Número de lote</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {selectedProducts.map((producto) => (
                                <Tr key={producto.productoId}>
                                    <Td>{producto.productoId}</Td>
                                    <Td>{producto.nombre}</Td>
                                    <Td textTransform={"capitalize"}>{producto.tipo_producto}</Td>
                                    <Td isNumeric>{quantities[producto.productoId]?.toString() ?? ""}</Td>
                                    <Td>{lotNumbers[producto.productoId]}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>

                {error && (
                    <Alert status={"error"} mt={4} borderRadius={"md"}>
                        <AlertIcon />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Flex mt={4} justifyContent={"flex-end"} gap={3}>
                    <Button onClick={onBack} variant={"outline"} isDisabled={isSending}>
                        Regresar
                    </Button>
                    <Button
                        colorScheme={"teal"}
                        onClick={onSend}
                        isLoading={isSending}
                        loadingText={"Enviando"}
                    >
                        Enviar ajuste
                    </Button>
                </Flex>
            </Box>
        </Flex>
    );
}
