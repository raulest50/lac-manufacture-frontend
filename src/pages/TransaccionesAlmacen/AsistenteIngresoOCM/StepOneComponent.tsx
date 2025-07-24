// RecibirMercancia/StepOneComponent.tsx
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Text,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { OrdenCompra, ItemOrdenCompra, IngresoOCM_DTA, TipoEntidadCausante, Movimiento } from "../types";
import { CardIngresoMaterial } from "./componentes/CardIngresoMaterial";

interface StepOneComponentProps {
    setActiveStep: (step: number) => void;
    orden: OrdenCompra | null;
    setIngresoOCM_DTA: (ingresoOCM_DTA: IngresoOCM_DTA) => void;
}

export default function StepOneComponent({
    setActiveStep,
    orden,
    setIngresoOCM_DTA,
}: StepOneComponentProps) {
    const toast = useToast();

    // Token management
    const [token, setToken] = useState<string>("");
    const [inputToken, setInputToken] = useState<string>("");

    // Movimientos por cada item
    const [movimientosPorItem, setMovimientosPorItem] = useState<{[key: number]: Movimiento[]}>({});

    // Initialize token whenever `orden` changes
    useEffect(() => {
        // generate a new 4-digit token
        const newTok = Math.floor(1000 + Math.random() * 9000).toString();
        setToken(newTok);
        setInputToken("");

        // Inicializar movimientos vacíos
        if (orden?.itemsOrdenCompra) {
            const initialMovimientos: {[key: number]: Movimiento[]} = {};
            orden.itemsOrdenCompra.forEach((item, index) => {
                initialMovimientos[index] = [];
            });
            setMovimientosPorItem(initialMovimientos);
        }
    }, [orden]);

    // Actualizar los movimientos para un item específico
    const handleMovimientosChange = (index: number, movimientos: Movimiento[]) => {
        setMovimientosPorItem(prev => ({
            ...prev,
            [index]: movimientos
        }));
    };

    // Check that all movimientos are valid
    const movimientosValidos = () => {
        if (!orden) return false;

        // Verificar que todos los items tengan al menos un movimiento
        return orden.itemsOrdenCompra.every((_, index) => {
            const movimientos = movimientosPorItem[index] || [];
            if (movimientos.length === 0) return false;

            // Verificar que la suma de cantidades sea correcta
            const totalCantidad = movimientos.reduce((sum, mov) => sum + mov.cantidad, 0);
            return totalCantidad > 0 && totalCantidad <= orden.itemsOrdenCompra[index].cantidad;
        });
    };

    const onClickContinuar = () => {
        if (!movimientosValidos()) {
            toast({
                title: "Datos incompletos",
                description: "Verifique que todos los materiales tengan lotes válidos y que las cantidades sean correctas.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

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

        // Inicializar el objeto ingresoOCM_DTA con la orden seleccionada
        if (orden) {
            // Obtener todos los movimientos en un solo array
            const todosLosMovimientos = Object.values(movimientosPorItem).flat();

            const ingresoOCM_DTA: IngresoOCM_DTA = {
                transaccionAlmacen: {
                    movimientosTransaccion: todosLosMovimientos,
                    urlDocSoporte: "",
                    tipoEntidadCausante: TipoEntidadCausante.OCM,
                    idEntidadCausante: orden.ordenCompraId?.toString() || "",
                    observaciones: ""
                },
                ordenCompraMateriales: orden,
                userId: undefined,
                observaciones: "",
                file: new File([], "placeholder") // Se reemplazará en StepTwo
            };

            setIngresoOCM_DTA(ingresoOCM_DTA);
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
                    Verificar Cantidades y Lotes
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
                    Para cada material, ingrese la información de los lotes recibidos. 
                    Puede agregar hasta 3 lotes por material. La suma de las cantidades 
                    no debe exceder la cantidad ordenada.
                </Text>

                {/* Cards de materiales */}
                <Box w="full">
                    {orden.itemsOrdenCompra.map((item, idx) => (
                        <CardIngresoMaterial 
                            key={idx} 
                            item={item} 
                            onMovimientosChange={(movimientos) => handleMovimientosChange(idx, movimientos)}
                        />
                    ))}
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
                        isDisabled={!movimientosValidos()}
                        onClick={onClickContinuar}
                    >
                        Continuar
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
}
