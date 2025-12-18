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
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { OrdenCompra, ItemOrdenCompra, IngresoOCM_DTA, TipoEntidadCausante, Movimiento } from "../types";
import { CardIngresoMaterial } from "./componentes/CardIngresoMaterial";
import { ListaTransaccionesAlmacen } from "./StepTwoComponent_IngOCM/ListaTransaccionesAlmacen";

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

    // Materiales excluidos de la recepción
    const [materialesExcluidos, setMaterialesExcluidos] = useState<{[key: number]: boolean}>({});

    // Initialize token whenever `orden` changes
    useEffect(() => {
        // generate a new 4-digit token
        const newTok = Math.floor(1000 + Math.random() * 9000).toString();
        setToken(newTok);
        setInputToken("");

        // Inicializar movimientos vacíos y materiales no excluidos
        if (orden?.itemsOrdenCompra) {
            const initialMovimientos: {[key: number]: Movimiento[]} = {};
            const initialExcluidos: {[key: number]: boolean} = {};
            orden.itemsOrdenCompra.forEach((item, index) => {
                initialMovimientos[index] = [];
                initialExcluidos[index] = false;
            });
            setMovimientosPorItem(initialMovimientos);
            setMaterialesExcluidos(initialExcluidos);
        }
    }, [orden]);

    // Actualizar los movimientos para un item específico
    const handleMovimientosChange = (index: number, movimientos: Movimiento[]) => {
        setMovimientosPorItem(prev => ({
            ...prev,
            [index]: movimientos
        }));
    };

    // Manejar cambio de exclusión de material
    const handleExcludedChange = (index: number, excluded: boolean) => {
        setMaterialesExcluidos(prev => ({
            ...prev,
            [index]: excluded
        }));
        // Si se excluye, limpiar movimientos
        if (excluded) {
            setMovimientosPorItem(prev => ({
                ...prev,
                [index]: []
            }));
        }
    };

    // Check that all movimientos are valid (permitir recepciones parciales)
    const movimientosValidos = () => {
        if (!orden) return false;

        // Verificar que al menos un material tenga movimientos válidos
        let tieneAlMenosUnoValido = false;

        for (let index = 0; index < orden.itemsOrdenCompra.length; index++) {
            const estaExcluido = materialesExcluidos[index] || false;
            
            // Si está excluido, continuar con el siguiente
            if (estaExcluido) continue;

            const movimientos = movimientosPorItem[index] || [];
            
            // Si no tiene movimientos y no está excluido, es inválido
            if (movimientos.length === 0) {
                return false;
            }

            // Verificar que la suma de cantidades sea correcta
            const totalCantidad = movimientos.reduce((sum, mov) => sum + mov.cantidad, 0);
            if (totalCantidad <= 0 || totalCantidad > orden.itemsOrdenCompra[index].cantidad) {
                return false;
            }

            tieneAlMenosUnoValido = true;
        }

        // Debe haber al menos un material válido recibido
        return tieneAlMenosUnoValido;
    };

    const onClickContinuar = () => {
        if (!movimientosValidos()) {
            toast({
                title: "Datos incompletos",
                description: "Debe recibir al menos un material con lotes válidos. Los materiales excluidos no se recibirán en esta transacción.",
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
            // Obtener todos los movimientos en un solo array (solo de materiales no excluidos)
            const todosLosMovimientos = Object.entries(movimientosPorItem)
                .filter(([index]) => !materialesExcluidos[parseInt(index)])
                .flatMap(([, movimientos]) => movimientos);

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
                    Para cada material, ingrese la información de los lotes recibidos o márquelo como excluido si no será recibido en esta transacción. 
                    Puede agregar hasta 3 lotes por material. La suma de las cantidades no debe exceder la cantidad ordenada.
                </Text>

                {/* Resumen de recepción */}
                {(() => {
                    const materialesRecibidos = orden.itemsOrdenCompra.filter((_, idx) => 
                        !materialesExcluidos[idx] && (movimientosPorItem[idx]?.length || 0) > 0
                    ).length;
                    const materialesExcluidosCount = Object.values(materialesExcluidos).filter(Boolean).length;
                    
                    if (materialesExcluidosCount > 0 || materialesRecibidos < orden.itemsOrdenCompra.length) {
                        return (
                            <Box p={3} bg="yellow.50" borderRadius="md" borderWidth="1px" borderColor="yellow.200">
                                <Text fontFamily="Comfortaa Variable" fontSize="sm">
                                    <strong>Recepción Parcial:</strong> {materialesRecibidos} de {orden.itemsOrdenCompra.length} materiales serán recibidos.
                                    {materialesExcluidosCount > 0 && ` ${materialesExcluidosCount} material(es) excluido(s).`}
                                </Text>
                            </Box>
                        );
                    }
                    return null;
                })()}

                {/* Tabla de materiales */}
                <Box w="full" bg="white" borderRadius="md" boxShadow="sm" overflowX="auto">
                    <Table size="sm" variant="simple">
                        <Thead bg="gray.50">
                            <Tr>
                                <Th>Material</Th>
                                <Th>ID</Th>
                                <Th>Cantidad Ordenada</Th>
                                <Th>Cantidad Ingresada</Th>
                                <Th>Estado</Th>
                                <Th textAlign="center">Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {orden.itemsOrdenCompra.map((item, idx) => (
                                <CardIngresoMaterial 
                                    key={idx} 
                                    item={item} 
                                    onMovimientosChange={(movimientos) => handleMovimientosChange(idx, movimientos)}
                                    onExcludedChange={(excluded) => handleExcludedChange(idx, excluded)}
                                    isExcluded={materialesExcluidos[idx] || false}
                                />
                            ))}
                        </Tbody>
                    </Table>
                </Box>

                {/* Lista de transacciones de almacén */}
                <ListaTransaccionesAlmacen ordenCompraId={orden.ordenCompraId} />

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
