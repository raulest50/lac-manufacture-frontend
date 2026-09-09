import {
    CloseButton,
    Box,
    Alert,
    Badge,
    Input,
    Stack,
    Text,
    Button,
    Separator,
    Field,
    Dialog,
    Portal,
} from "@chakra-ui/react";
import { useAppToast } from "@/components/ui/use-app-toast";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { effectiveExactTabNivelFromSnapshot } from "../../../auth/accessHelpers.ts";
import { useAccessSnapshot } from "../../../auth/usePermissions.ts";
import EndPointsURL from "../../../api/EndPointsURL.tsx";
import { Modulo } from "../../Usuarios/GestionUsuarios/types.tsx";
import { OrdenProduccionDTO } from "../types.tsx";
import {
    getEstadoDispensacionMaterialesColor,
    getEstadoDispensacionMaterialesLabel,
    getPoliticaDispensacionInicioColor,
    getPoliticaDispensacionInicioLabel,
} from "../components/SeguimientoBoardUI.tsx";

interface OrdenProduccionDialogDetallesProps {
    isOpen: boolean;
    onClose: () => void;
    orden: OrdenProduccionDTO | null;
    onCanceled?: () => void;
}

const formatValue = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) {
        return "-";
    }

    if (typeof value === "string" && value.trim().length === 0) {
        return "-";
    }

    return String(value);
};

const formatDateTimeValue = (value: string | null | undefined): string => {
    if (value === null || value === undefined) {
        return "-";
    }

    const trimmed = value.trim();
    if (trimmed.length === 0) {
        return "-";
    }

    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) {
        return "-";
    }

    const day = String(parsed.getDate()).padStart(2, "0");
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const year = parsed.getFullYear();
    const minutes = String(parsed.getMinutes()).padStart(2, "0");
    const hours24 = parsed.getHours();
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = String(hours24 % 12 || 12).padStart(2, "0");

    return `${day}/${month}/${year}, ${hours12}:${minutes} ${period}`;
};

const getEstadoOrdenLabel = (estadoOrden: number): string => {
    switch (estadoOrden) {
        case -1:
            return "Cancelada";
        case 0:
            return "Abierta";
        case 2:
            return "Terminada";
        case 3:
            return "Fabricacion completada";
        default:
            return `Estado ${estadoOrden}`;
    }
};

export default function OrdenProduccionDialogDetalles({
    isOpen,
    onClose,
    orden,
    onCanceled,
}: OrdenProduccionDialogDetallesProps) {
    const [isCancelable, setIsCancelable] = useState(false);
    const [randomToken, setRandomToken] = useState("");
    const [inputToken, setInputToken] = useState("");
    const [cancelLoading, setCancelLoading] = useState(false);

    const toast = useAppToast();
    const endPoints = useMemo(() => new EndPointsURL(), []);
    const access = useAccessSnapshot();
    const canCancelOrders = useMemo(
        () => effectiveExactTabNivelFromSnapshot(access, Modulo.PRODUCCION, "HISTORIAL") >= 2,
        [access]
    );

    const checkIfCancelable = useCallback(async (ordenId: number) => {
        try {
            const url = endPoints.is_deletable_orden_produccion.replace("{id}", ordenId.toString());
            const response = await axios.get(url);
            setIsCancelable(response.data.cancelable === true);
        } catch (error) {
            setIsCancelable(false);
        }
    }, [endPoints]);

    useEffect(() => {
        if (isOpen && orden) {
            setIsCancelable(false);
            setInputToken("");
            if (canCancelOrders && orden.estadoOrden === 0) {
                const token = Math.floor(1000 + Math.random() * 9000).toString();
                setRandomToken(token);
                void checkIfCancelable(orden.ordenId);
            } else {
                setRandomToken("");
            }
        }
    }, [canCancelOrders, checkIfCancelable, isOpen, orden]);

    const resetState = () => {
        setIsCancelable(false);
        setRandomToken("");
        setInputToken("");
        setCancelLoading(false);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleCancel = async () => {
        if (!orden || cancelLoading || !canCancelOrders) return;

        if (inputToken !== randomToken) {
            toast({
                title: "Token incorrecto",
                description: "El token ingresado no coincide con el token de confirmaci\u00F3n",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setCancelLoading(true);
        try {
            const url = endPoints.cancel_orden_produccion.replace("{id}", orden.ordenId.toString());
            await axios.put(url);

            toast({
                title: "Orden cancelada",
                description: "La orden de producci\u00F3n ha sido cancelada correctamente",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            onCanceled?.();
            handleClose();
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo cancelar la orden de producci\u00F3n",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setCancelLoading(false);
        }
    };

    if (!orden) {
        return null;
    }

    return (
        <Dialog.Root open={isOpen} size='xl' placement='center' onOpenChange={e => {
            if (!e.open) {
                handleClose();
            }
        }}>
            <Portal>

                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header><Dialog.Title>Detalles de Orden #{orden.ordenId}</Dialog.Title></Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton aria-label="Cerrar" size="sm" />
                        </Dialog.CloseTrigger>
                        <Dialog.Body>
                            <Stack gap={4} separator={<Separator />}>
                                <Box>
                                    <Text fontWeight="bold">Producto</Text>
                                    <Text>{orden.productoNombre}</Text>
                                    <Text color="gray.600" fontSize="sm">
                                        ID: {formatValue(orden.productoId)}
                                        {" \u2022 "}
                                        Tipo: {formatValue(orden.productoTipo)}
                                        {" \u2022 "}
                                        Unidad: {formatValue(orden.productoUnidad)}
                                    </Text>
                                    <Text color="gray.600" fontSize="sm">
                                        {"Categor\u00EDa: "}
                                        {formatValue(orden.productoCategoriaNombre ?? orden.productoCategoriaId)}
                                    </Text>
                                </Box>

                                <Box>
                                    <Text fontWeight="bold">Fechas</Text>
                                    <Text fontSize="sm">{"Fecha de creaci\u00F3n: "}{formatDateTimeValue(orden.fechaCreacion)}</Text>
                                    <Text fontSize="sm">Inicio: {formatDateTimeValue(orden.fechaInicio)}</Text>
                                    <Text fontSize="sm">Lanzamiento: {formatDateTimeValue(orden.fechaLanzamiento)}</Text>
                                    <Text fontSize="sm">Fin planificada: {formatDateTimeValue(orden.fechaFinalPlanificada)}</Text>
                                </Box>

                                {orden.estadoOrden === -1 && (
                                    <Box as="section" aria-labelledby={`cancelacion-orden-${orden.ordenId}`}>
                                        <Text id={`cancelacion-orden-${orden.ordenId}`} fontWeight="bold">
                                            {"Cancelaci\u00F3n"}
                                        </Text>
                                        {orden.canceladaEn
                                            && orden.canceladaPorUsername
                                            && orden.canceladaPorNombreCompleto ? (
                                            <>
                                                <Text fontSize="sm">
                                                    Cancelada por: {orden.canceladaPorNombreCompleto}
                                                    {orden.canceladaPorNombreCompleto === orden.canceladaPorUsername
                                                        ? ""
                                                        : ` (${orden.canceladaPorUsername})`}
                                                </Text>
                                                <Text fontSize="sm">
                                                    Fecha de cancelación: {formatDateTimeValue(orden.canceladaEn)}
                                                </Text>
                                            </>
                                        ) : (
                                            <Alert.Root status="info" mt={2}>
                                                <Alert.Indicator />
                                                <Alert.Content>
                                                    <Alert.Description>
                                                        Información de cancelación no disponible para este registro histórico.
                                                    </Alert.Description>
                                                </Alert.Content>
                                            </Alert.Root>
                                        )}
                                    </Box>
                                )}

                                <Box>
                                    <Text fontWeight="bold">{"Informaci\u00F3n de Producci\u00F3n"}</Text>
                                    <Text fontSize="sm">Cantidad a producir: {formatValue(orden.cantidadProducir)}</Text>
                                    <Text fontSize="sm">
                                        Estado: <Badge ml={1} colorPalette={orden.estadoOrden === 2 ? "green" : orden.estadoOrden === -1 ? "red" : orden.estadoOrden === 3 ? "blue" : "yellow"}>{getEstadoOrdenLabel(orden.estadoOrden)}</Badge>
                                    </Text>
                                    <Text fontSize="sm">
                                        Materiales: <Badge ml={1} colorPalette={getEstadoDispensacionMaterialesColor(orden.estadoDispensacionMateriales)}>{getEstadoDispensacionMaterialesLabel(orden.estadoDispensacionMateriales)}</Badge>
                                    </Text>
                                    <Text fontSize="sm">
                                        Politica inicio: <Badge ml={1} colorPalette={getPoliticaDispensacionInicioColor(orden.politicaDispensacionInicio)}>{getPoliticaDispensacionInicioLabel(orden.politicaDispensacionInicio)}</Badge>
                                    </Text>
                                    <Text fontSize="sm">Fecha politica: {formatDateTimeValue(orden.fechaAplicacionPoliticaDispensacion)}</Text>
                                    <Text fontSize="sm">Pedido comercial: {formatValue(orden.numeroPedidoComercial)}</Text>
                                    <Text fontSize="sm">{"\u00C1rea operativa: "}{formatValue(orden.areaOperativa)}</Text>
                                    <Text fontSize="sm">Departamento operativo: {formatValue(orden.departamentoOperativo)}</Text>
                                </Box>

                                {orden.origenOrden === "MPS" && (
                                    <Box>
                                        <Text fontWeight="bold">Origen del plan</Text>
                                        <Text fontSize="sm">Origen: MPS</Text>
                                        <Text fontSize="sm">MPS ID: {formatValue(orden.mpsId)}</Text>
                                        <Text fontSize="sm">Semana MPS: {formatValue(orden.mpsWeekStartDate)}</Text>
                                        <Text fontSize="sm">Item MPS: {formatValue(orden.mpsItemId)}</Text>
                                        <Text fontSize="sm">Lote planificado MPS: {formatValue(orden.mpsLotePlanificadoId)}</Text>
                                        <Text fontSize="sm">Lote ordinal: {formatValue(orden.mpsLoteOrdinal)}</Text>
                                    </Box>
                                )}

                                <Box>
                                    <Text fontWeight="bold">Observaciones</Text>
                                    <Text whiteSpace="pre-wrap">{formatValue(orden.observaciones)}</Text>
                                </Box>

                                {isCancelable && canCancelOrders && (
                                    <Box>
                                        <Text fontWeight="bold" mb={3} color="red.500">
                                            {"Cancelar orden de producci\u00F3n"}
                                        </Text>
                                        <Separator mb={4} />
                                        <Stack gap={4}>
                                            <Alert.Root status="warning">
                                                <Alert.Indicator />
                                                {"Esta acci\u00F3n no se puede deshacer. La orden ser\u00E1 cancelada definitivamente."}
                                            </Alert.Root>

                                            <Text fontWeight="bold">{"Token de confirmaci\u00F3n: "}{randomToken}</Text>

                                            <Field.Root>
                                                <Field.Label>{"Ingrese el token de confirmaci\u00F3n:"}</Field.Label>
                                                <Input
                                                    value={inputToken}
                                                    onChange={(e) => setInputToken(e.target.value)}
                                                    placeholder="Ingrese el token de 4 d\u00EDgitos"
                                                />
                                            </Field.Root>

                                            <Button
                                                colorPalette="red"
                                                onClick={handleCancel}
                                                loading={cancelLoading}
                                                loadingText="Cancelando..."
                                                disabled={cancelLoading || inputToken !== randomToken}
                                            >
                                                {"Cancelar orden de producci\u00F3n"}
                                            </Button>
                                        </Stack>
                                    </Box>
                                )}
                            </Stack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button colorPalette="blue" onClick={handleClose}>
                                Cerrar
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>

            </Portal>
        </Dialog.Root>
    );
}
