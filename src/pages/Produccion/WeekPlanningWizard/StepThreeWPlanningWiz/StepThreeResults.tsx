import { useState } from 'react';
import { 
    Box, 
    Button, 
    HStack, 
    Text, 
    Center, 
    VStack,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Card,
    CardBody
} from '@chakra-ui/react';
import { MPS } from '../PlanningWizTypes';

type StepThreeResultsProps = {
    onPrev?: () => void;
    onFinish?: () => void;
};

export function StepThreeResults({ onPrev, onFinish }: StepThreeResultsProps) {
    // Estado local para almacenar los resultados
    const [results, setResults] = useState<MPS[]>([]);

    // Función para validar antes de finalizar
    const handleFinish = () => {
        // Aquí puedes agregar validaciones si es necesario
        if (onFinish) {
            onFinish();
        }
    };

    return (
        <Card borderRadius="lg" variant="outline" width="100%">
            <CardBody>
                <VStack spacing={6} align="stretch">
                    <Heading size="md">Revisión de Resultados</Heading>

                    <Box>
                        <Text mb={4}>
                            A continuación se muestran los resultados del plan de producción semanal 
                            basado en los parámetros configurados en los pasos anteriores.
                        </Text>

                        {results.length > 0 ? (
                            <Box overflowX="auto">
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Producto</Th>
                                            <Th>Cantidad</Th>
                                            <Th>Semana</Th>
                                            <Th>Prioridad</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {/* Aquí se renderizarían los resultados */}
                                        <Tr>
                                            <Td>Ejemplo Producto</Td>
                                            <Td>100</Td>
                                            <Td>Semana 1</Td>
                                            <Td>Alta</Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </Box>
                        ) : (
                            <Center p={8} borderWidth="1px" borderRadius="md" borderStyle="dashed">
                                <Text color="gray.500">
                                    No hay resultados disponibles. Por favor complete los pasos anteriores.
                                </Text>
                            </Center>
                        )}
                    </Box>

                    {/* Controles de navegación */}
                    <HStack spacing={4} justifyContent="flex-end" mt={4}>
                        {onPrev && (
                            <Button 
                                colorScheme="gray" 
                                onClick={onPrev}
                            >
                                Anterior
                            </Button>
                        )}
                        <Button 
                            colorScheme="green" 
                            onClick={handleFinish}
                        >
                            Finalizar
                        </Button>
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    );
}
