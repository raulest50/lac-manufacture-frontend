import { useState } from "react";
import { Button, Flex, Box, Heading, useToast } from "@chakra-ui/react";
import axios from "axios";
import EndPointsURL from "../../../../../api/EndPointsURL.tsx";
import { ProductoSemiter } from "../../../types.tsx";

interface Props {
    setActiveStep: (step: number) => void;
    semioter3: ProductoSemiter;
    onReset: () => void;
}

export default function StepFour({ setActiveStep, semioter3, onReset }: Props) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const endPoints = new EndPointsURL();

    const handleGuardar = async () => {
        try {
            setLoading(true);
            await axios.post(endPoints.save_producto, semioter3);
            toast({
                title: "Producto guardado",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onReset();
        } catch (e) {
            toast({
                title: "Error",
                description: "No se pudo guardar el producto",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAtras = () => {
        setActiveStep(2);
    };

    return (
        <Flex direction="column" align="center" gap={4} w="full">
            <Heading size="md">Resumen del Producto</Heading>
            <Box w="full" bg="gray.50" p={4} borderRadius="md" maxH="300px" overflowY="auto">
                <pre>{JSON.stringify(semioter3, null, 2)}</pre>
            </Box>
            <Flex gap={10}>
                <Button variant="solid" colorScheme="yellow" onClick={handleAtras} isDisabled={loading}>
                    Atras
                </Button>
                <Button variant="solid" colorScheme="teal" onClick={handleGuardar} isLoading={loading}>
                    Guardar
                </Button>
            </Flex>
        </Flex>
    );
}
