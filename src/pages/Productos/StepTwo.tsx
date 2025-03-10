// StepTwo.tsx
import React, { useState } from "react";
import { Producto, Insumo, ProductoSemiter } from "./types";
import { Button, Flex, HStack, useToast } from "@chakra-ui/react";
import SemioterBriefCard from "./components/SemioterBriefCard";
import BandejaBusqueda from "./components/BandejaBusqueda";
import BandejaSeleccion from "./components/BandejaSeleccion";

interface Props {
    setActiveStep: (step: number) => void;
    semioter: ProductoSemiter;
}

const StepTwo: React.FC<Props> = ({ setActiveStep, semioter }) => {
    const toast = useToast();
    const [selectedInsumos, setSelectedInsumos] = useState<Insumo[]>([]);

    // Function to add a new insumo if not already added
    const handleAddInsumo = (producto: Producto) => {
        const exists = selectedInsumos.some(
            (insumo) => insumo.producto.productoId === producto.productoId
        );
        if (exists) {
            toast({
                title: "Insumo ya agregado",
                description: "El insumo ya está en la lista de selección.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        const newInsumo: Insumo = {
            producto: producto,
            cantidadRequerida: 0,
            subtotal: 0,
        };
        setSelectedInsumos([...selectedInsumos, newInsumo]);
    };

    // Function to update the quantity of an insumo
    const handleUpdateCantidad = (productoId: number, newCantidad: number) => {
        setSelectedInsumos((prev) =>
            prev.map((insumo) =>
                insumo.producto.productoId === productoId
                    ? {
                        ...insumo,
                        cantidadRequerida: newCantidad,
                        subtotal: newCantidad * insumo.producto.costo,
                    }
                    : insumo
            )
        );
    };

    // Function to remove an insumo from the selection
    const handleRemoveInsumo = (productoId: number) => {
        setSelectedInsumos((prev) =>
            prev.filter((insumo) => insumo.producto.productoId !== productoId)
        );
    };

    const onClickSiguiente = () => {
        setActiveStep(2);
    };

    const onClickCleanLists = () => {
        setSelectedInsumos([]);
    };

    return (
        <Flex direction="column" gap={4} align="center" w="full" border="1px solid blue">
            <SemioterBriefCard semioter={semioter} />

            <HStack gap={8} w="full">
                <BandejaBusqueda onAddInsumo={handleAddInsumo} />
                <BandejaSeleccion
                    selectedInsumos={selectedInsumos}
                    onUpdateCantidad={handleUpdateCantidad}
                    onRemoveInsumo={handleRemoveInsumo}
                />
            </HStack>

            <Flex direction="row" gap={10}>
                <Button variant="solid" colorScheme="teal" onClick={onClickSiguiente}>
                    Siguiente
                </Button>
                <Button variant="solid" colorScheme="red" onClick={onClickCleanLists}>
                    Limpiar Bandeja Seleccion
                </Button>
            </Flex>
        </Flex>
    );
};

export default StepTwo;
