// StepZeroComponent.tsx
import { useState } from "react";
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Text,
    useToast,
} from "@chakra-ui/react";
import { OrdenCompra } from "./types.tsx";
import EndPointsURL from "../../api/EndPointsURL.tsx";

interface StepZeroComponentProps {
    setActiveStep: (step: number) => void;
    setSelectedOrder: (orden: OrdenCompra) => void;
}

export default function StepZeroComponent({
                                              setActiveStep,
                                              setSelectedOrder,
                                          }: StepZeroComponentProps) {
    const toast = useToast();
    const [facturaId, setFacturaId] = useState("");

    const handleOnClickBuscarOrdenByFacturaId = async () => {
        // Validate input
        if (!facturaId) {
            toast({
                title: "Error",
                description: "Ingrese un ID de Factura",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            // Build the endpoint URL using your domain logic
            const endpoint = `${EndPointsURL.getDomain()}/compras/orden_by_factura?facturaCompraId=${facturaId}`;
            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error("Orden de compra no encontrada");
            }

            const data: OrdenCompra = await response.json();

            // Set the selected order and advance to the next step
            setSelectedOrder(data);
            setActiveStep(1);
        } catch (error) {
            toast({
                title: "Orden no encontrada",
                description:
                    "No se encontró una orden de compra para el ID de Factura proporcionado",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Flex
            p="1em"
            direction="column"
            backgroundColor="blue.50"
            gap={4}
            alignItems="center"
        >
            <Heading fontFamily="Comfortaa Variable">
                Identificar Orden de Compra
            </Heading>
            <Text fontFamily="Comfortaa Variable">
                Ingrese el id de la factura para comprobar que está asociada a una orden
                de compra
            </Text>
            <Flex w="40%" direction="column" gap={4}>
                <FormControl isRequired>
                    <FormLabel>Id Factura</FormLabel>
                    <Input
                        value={facturaId}
                        onChange={(e) => setFacturaId(e.target.value)}
                    />
                </FormControl>
                <Button
                    variant="solid"
                    colorScheme="teal"
                    onClick={handleOnClickBuscarOrdenByFacturaId}
                >
                    Buscar
                </Button>
            </Flex>
        </Flex>
    );
}
