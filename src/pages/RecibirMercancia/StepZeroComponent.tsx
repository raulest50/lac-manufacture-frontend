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
import axios from "axios";
import { OrdenCompra } from "./types";
import EndPointsURL from "../../api/EndPointsURL";

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
            const response = await axios.get<OrdenCompra>(endpoint, {
                withCredentials: true, // ensure cookies/credentials are sent
            });

            // Set the selected order and advance to the next step
            setSelectedOrder(response.data);
            setActiveStep(1);
        } catch (error: any) {
            console.error("Error fetching order:", error);
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
