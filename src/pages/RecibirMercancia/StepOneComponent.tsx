// RecibirMercancia/StepOneComponent.tsx
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { OrdenCompra, ItemOrdenCompra } from "./types.tsx";

type LocalItem = ItemOrdenCompra & { entrada: number };

interface StepOneComponentProps {
    setActiveStep: (step: number) => void;
    orden: OrdenCompra | null;
}

export default function StepOneComponent({
                                             setActiveStep,
                                             orden,
                                         }: StepOneComponentProps) {
    const toast = useToast();

    // Local items with an extra `entrada` field
    const [items, setItems] = useState<LocalItem[]>([]);

    // Token management
    const [token, setToken] = useState<string>("");
    const [inputToken, setInputToken] = useState<string>("");

    // Initialize items & token whenever `orden` changes
    useEffect(() => {
        if (orden?.itemsOrdenCompra) {
            setItems(
                orden.itemsOrdenCompra.map((it) => ({
                    ...it,
                    entrada: it.cantidad,
                }))
            );
        }
        // generate a new 4-digit token
        const newTok = Math.floor(1000 + Math.random() * 9000).toString();
        setToken(newTok);
        setInputToken("");
    }, [orden]);

    // Handle changes to the entrada field
    const handleEntradaChange = (
        idx: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const val = parseInt(e.target.value, 10);
        setItems((prev) => {
            const upd = [...prev];
            upd[idx] = { ...upd[idx], entrada: isNaN(val) ? 0 : val };
            return upd;
        });
    };

    // Check that all cantidades are valid:
    // - integer
    // - ≥ 0
    // - ≤ the corresponding original purchase-order cantidad
    const cantidades_validas = () => {
        if (!orden) return false;
        return items.every((it, idx) => {
            const originalQty = orden.itemsOrdenCompra[idx].cantidad;
            return (
                Number.isInteger(it.entrada) &&
                it.entrada > 0 &&
                it.entrada <= originalQty
            );
        });
    };

    const onClickContinuar = () => {
        if (!cantidades_validas()) return;

        if (inputToken !== token) {
            toast({
                title: "Token incorrecto",
                description: "El token ingresado no coincide.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setActiveStep(2);
    };

    if (!orden) {
        return <Text>No se ha seleccionado ninguna orden.</Text>;
    }

    const formatDate = (d?: string) => (d ? new Date(d).toLocaleDateString() : "");

    return (
        <Box p="1em" bg="blue.50">
            <Flex direction="column" gap={4} align="center">
                <Heading fontFamily="Comfortaa Variable">
                    Verificar Cantidades
                </Heading>

                {/* Proveedor & fechas */}
                <Flex direction="column" align="center" gap={2}>
                    <Text fontFamily="Comfortaa Variable">
                        <strong>Proveedor:</strong> {orden.proveedor.nombre}
                    </Text>
                    <Text fontFamily="Comfortaa Variable">
                        <strong>Fecha Emisión:</strong> {formatDate(orden.fechaEmision)}
                    </Text>
                    <Text fontFamily="Comfortaa Variable">
                        <strong>Fecha Vencimiento:</strong>{" "}
                        {formatDate(orden.fechaVencimiento)}
                    </Text>
                </Flex>

                <Text fontFamily="Comfortaa Variable" textAlign="center">
                    Ajuste la “Cantidad” según lo realmente recibido. Sólo podrá
                    continuar si todas las cantidades son enteros, entre 0 y lo ordenado
                    (inclusive).
                </Text>

                {/* Tabla editable */}
                <Box w="full" overflowX="auto">
                    <Table variant="striped">
                        <Thead>
                            <Tr>
                                <Th>Producto ID</Th>
                                <Th>Nombre</Th>
                                <Th isNumeric>Cantidad Recibida</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {items.map((it, idx) => (
                                <Tr key={idx}>
                                    <Td>{it.material.productoId}</Td>
                                    <Td>{it.material.nombre}</Td>
                                    <Td isNumeric>
                                        <Input
                                            type="number"
                                            value={it.entrada}
                                            onChange={(e) => handleEntradaChange(idx, e)}
                                            min={0}
                                        />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>

                {/* Token Input */}
                <FormControl w="40%" isRequired>
                    <FormLabel>Token de verificación</FormLabel>
                    <Input
                        placeholder="Ingrese el token"
                        value={inputToken}
                        onChange={(e) => setInputToken(e.target.value)}
                    />
                </FormControl>

                {/* Display the token as text */}
                <Text fontFamily="Comfortaa Variable">
                    Token: <strong>{token}</strong>
                </Text>

                {/* Continuar */}
                <Flex w="40%">
                    <Button
                        colorScheme="teal"
                        w="full"
                        isDisabled={!cantidades_validas()}
                        onClick={onClickContinuar}
                    >
                        Continuar
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
}
