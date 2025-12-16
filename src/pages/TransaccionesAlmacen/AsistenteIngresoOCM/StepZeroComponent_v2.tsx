import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    FormControl,
    FormLabel,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import {useMemo, useState} from "react";
import ProveedorFilterOCM from "../../Compras/components/ProveedorFilterOCM";
import ProveedorPicker from "../../Compras/components/ProveedorPicker";
import EndPointsURL from "../../../api/EndPointsURL";
import {OrdenCompra, Proveedor} from "../types";

interface StepOneComponentProps {
    setActiveStep: (step: number) => void;
    setSelectedOrder: (orden: OrdenCompra) => void;
}



export default function StepZeroComponent_v2({
    setActiveStep,
    setSelectedOrder,
}: StepOneComponentProps) {
    const toast = useToast();
    const endpoints = useMemo(() => new EndPointsURL(), []);
    const [isLoading, setIsLoading] = useState(false);
    const [proveedor, setProveedor] = useState<Proveedor | null>(null);
    const [fechaInicio, setFechaInicio] = useState<string>(() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split("T")[0];
    });
    const [fechaFin, setFechaFin] = useState<string>(() => new Date().toISOString().split("T")[0]);
    const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const serializeDate = (date: string, endOfDay = false) => {
        if (!date) return null;
        const timeSuffix = endOfDay ? "T23:59:59" : "T00:00:00";
        return `${date}${timeSuffix}`;
    };

    const fetchOrdenesPendientes = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get<OrdenCompra[]>(
                endpoints.consulta_ocm_pendientes,
                {
                    withCredentials: true,
                    params: {
                        page: 0,
                        size: 10,
                        fechaInicio: serializeDate(fechaInicio),
                        fechaFin: serializeDate(fechaFin, true),
                        proveedorId: proveedor?.id ?? undefined,
                    },
                }
            );
            const ordenesPendientes = response.data || [];

            if (ordenesPendientes.length === 0) {
                toast({
                    title: "No se encontraron órdenes",
                    description: "No hay órdenes que coincidan con el filtro seleccionado.",
                    status: "info",
                    duration: 4000,
                    isClosable: true,
                });
            }

            setOrdenes(ordenesPendientes);
        } catch (error: any) {
            console.error("Error fetching órdenes pendientes", error);
            toast({
                title: "No se pudieron cargar las órdenes",
                description: "Intente nuevamente o verifique su conexión.",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };


    const onRegistrarIngreso = (orden: OrdenCompra) => {
        setSelectedOrder(orden);
        setActiveStep(1);
    };

    const tableRows = useMemo(() => ordenes.map((orden) => (
        <Tr key={orden.ordenCompraId}>
            <Td>{orden.ordenCompraId}</Td>
            <Td>{orden.proveedor?.nombre}</Td>
            <Td>{orden.fechaEmision ? new Date(orden.fechaEmision).toLocaleDateString() : ""}</Td>
            <Td>{orden.fechaVencimiento ? new Date(orden.fechaVencimiento).toLocaleDateString() : ""}</Td>
            <Td>{orden.totalPagar?.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</Td>
            <Td textAlign="center">
                <Button size="sm" colorScheme="teal" onClick={() => onRegistrarIngreso(orden)}>
                    Registrar Ingreso
                </Button>
            </Td>
        </Tr>
    )), [ordenes]);

    return (
        <Box p="1em" bg="blue.50">
            <VStack spacing={6} align="stretch">
                <Heading fontFamily="Comfortaa Variable" textAlign="center">
                    Órdenes de compra pendientes por recibir
                </Heading>

                <Flex gap={4} wrap="wrap" alignItems="flex-end">
                    <ProveedorFilterOCM
                        selectedProveedor={proveedor}
                        onOpenPicker={onOpen}
                        onClearFilter={() => setProveedor(null)}
                    />

                    <VStack spacing={2} alignItems="stretch">
                        <FormControl minW="220px">
                            <FormLabel>Fecha inicial</FormLabel>
                            <Input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                            />
                        </FormControl>
                        <FormControl minW="220px">
                            <FormLabel>Fecha final</FormLabel>
                            <Input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                            />
                        </FormControl>
                    </VStack>

                    <Button
                        colorScheme="teal"
                        onClick={fetchOrdenesPendientes}
                        isLoading={isLoading}
                    >
                        Buscar
                    </Button>
                </Flex>

                <Box bg="white" borderRadius="md" boxShadow="sm" overflowX="auto">
                    <Table size="sm">
                        <Thead bg="gray.50">
                            <Tr>
                                <Th>ID</Th>
                                <Th>Proveedor</Th>
                                <Th>Fecha emisión</Th>
                                <Th>Fecha vencimiento</Th>
                                <Th>Total</Th>
                                <Th textAlign="center">Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {tableRows.length > 0 ? (
                                tableRows
                            ) : (
                                <Tr>
                                    <Td colSpan={6} textAlign="center" py={6}>
                                        {isLoading ? "Cargando órdenes..." : "No se encontraron órdenes pendientes."}
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </Box>
            </VStack>

            <ProveedorPicker
                isOpen={isOpen}
                onClose={onClose}
                onSelectProveedor={(prov) => setProveedor(prov)}
            />
        </Box>
    );
}
