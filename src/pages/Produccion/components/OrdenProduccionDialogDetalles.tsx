import {
    Box,
    Divider,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Tr,
    Button,
} from "@chakra-ui/react";
import { OrdenProduccionDTO } from "../types";

interface OrdenProduccionDialogDetallesProps {
    isOpen: boolean;
    onClose: () => void;
    orden: OrdenProduccionDTO | null;
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

export default function OrdenProduccionDialogDetalles({
    isOpen,
    onClose,
    orden,
}: OrdenProduccionDialogDetallesProps) {
    if (!orden) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Detalles de Orden #{orden.ordenId}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={4} divider={<Divider />}>
                        <Box>
                            <Text fontWeight="bold">Producto</Text>
                            <Text>{orden.productoNombre}</Text>
                            <Text color="gray.600" fontSize="sm">
                                ID: {formatValue(orden.productoId)} • Tipo: {formatValue(orden.productoTipo)} • Unidad: {formatValue(orden.productoUnidad)}
                            </Text>
                            <Text color="gray.600" fontSize="sm">
                                Categoría: {formatValue(orden.productoCategoriaNombre ?? orden.productoCategoriaId)}
                            </Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold">Fechas</Text>
                            <Text fontSize="sm">Inicio: {formatValue(orden.fechaInicio)}</Text>
                            <Text fontSize="sm">Lanzamiento: {formatValue(orden.fechaLanzamiento)}</Text>
                            <Text fontSize="sm">Fin planificada: {formatValue(orden.fechaFinalPlanificada)}</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold">Información de Producción</Text>
                            <Text fontSize="sm">Cantidad a producir: {formatValue(orden.cantidadProducir)}</Text>
                            <Text fontSize="sm">Estado: {formatValue(orden.estadoOrden)}</Text>
                            <Text fontSize="sm">Pedido comercial: {formatValue(orden.numeroPedidoComercial)}</Text>
                            <Text fontSize="sm">Área operativa: {formatValue(orden.areaOperativa)}</Text>
                            <Text fontSize="sm">Departamento operativo: {formatValue(orden.departamentoOperativo)}</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold">Observaciones</Text>
                            <Text whiteSpace="pre-wrap">{formatValue(orden.observaciones)}</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold" mb={2}>
                                Seguimiento de insumos
                            </Text>
                            {orden.ordenesSeguimiento.length === 0 ? (
                                <Text fontSize="sm" color="gray.600">
                                    No hay seguimiento registrado.
                                </Text>
                            ) : (
                                <Table size="sm" variant="simple">
                                    <Tbody>
                                        {orden.ordenesSeguimiento.map((seguimiento) => (
                                            <Tr key={seguimiento.seguimientoId}>
                                                <Td>{seguimiento.insumoNombre}</Td>
                                                <Td>Cant.: {seguimiento.cantidadRequerida}</Td>
                                                <Td>Estado: {seguimiento.estado}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            )}
                        </Box>
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={onClose}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
