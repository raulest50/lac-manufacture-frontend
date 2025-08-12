import React from "react";
import { Insumo } from "../../../types.tsx";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
} from "@chakra-ui/react";

interface ItemBandejaSeleccionProps {
    insumo: Insumo;
    onUpdateCantidad: (productoId: number, newCantidad: number) => void;
    onRemoveInsumo: (productoId: number) => void;
}

const ItemBandejaSeleccion: React.FC<ItemBandejaSeleccionProps> = ({
                                                                           insumo,
                                                                           onUpdateCantidad,
                                                                           onRemoveInsumo,
                                                                       }) => {
    return (
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
    );
};

export default ItemBandejaSeleccion;