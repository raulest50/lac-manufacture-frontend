// BandejaSeleccion.tsx
import React from "react";
import { Insumo } from "../types";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Text,
} from "@chakra-ui/react";

interface BandejaSeleccionProps {
    selectedInsumos: Insumo[];
    onUpdateCantidad: (productoId: number, newCantidad: number) => void;
    onRemoveInsumo: (productoId: number) => void;
}

const BandejaSeleccion: React.FC<BandejaSeleccionProps> = ({
                                                               selectedInsumos,
                                                               onUpdateCantidad,
                                                               onRemoveInsumo,
                                                           }) => {
    return (
        <Box p={4} border="1px solid black" w="full">
            <Text fontSize="xl" mb={4}>
                Bandeja de Selección
            </Text>
            {selectedInsumos.length === 0 ? (
                <Text>No hay insumos seleccionados.</Text>
            ) : (
                <Flex direction="column" gap={4}>
                    {selectedInsumos.map((insumo) => (
                        <Box
                            key={insumo.producto.productoId}
                            borderWidth="1px"
                            borderRadius="md"
                            p={4}
                        >
                            <Text fontWeight="bold">
                                ID: {insumo.producto.productoId} - {insumo.producto.nombre}
                            </Text>
                            <Text>Costo: {insumo.producto.costo}</Text>
                            <FormControl mt={2}>
                                <FormLabel>Cantidad Requerida</FormLabel>
                                <Input
                                    type="number"
                                    value={insumo.cantidadRequerida}
                                    onChange={(e) =>
                                        onUpdateCantidad(
                                            insumo.producto.productoId,
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                />
                            </FormControl>
                            <Button
                                mt={2}
                                colorScheme="red"
                                onClick={() => onRemoveInsumo(insumo.producto.productoId)}
                            >
                                Remover
                            </Button>
                        </Box>
                    ))}
                </Flex>
            )}
        </Box>
    );
};

export default BandejaSeleccion;
