import { useState, useEffect } from 'react';
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
    CardBody,
    Badge,
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatGroup,
    SimpleGrid,
    Divider,
    useToast,
    Select
} from '@chakra-ui/react';
import { MPS, MPSItem, Nececidades, CapProductiva } from '../PlanningWizTypes';

type StepThreeResultsProps = {
    onPrev?: () => void;
    onFinish?: () => void;
    necesidades?: Nececidades | null;
    capacidadProductiva?: CapProductiva | null;
    onDataProcessed?: (data: MPS) => void;
};

export function StepThreeResults({ 
    onPrev, 
    onFinish, 
    necesidades, 
    capacidadProductiva,
    onDataProcessed 
}: StepThreeResultsProps) {
    // Estado local para almacenar los resultados
    const [results, setResults] = useState<MPS | null>(null);
    const [filteredItems, setFilteredItems] = useState<MPSItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    // Toast para notificaciones
    const toast = useToast();

    // Generar el plan cuando se reciben los datos de necesidades y capacidad
    useEffect(() => {
        if (necesidades && capacidadProductiva) {
            generatePlan();
        }
    }, [necesidades, capacidadProductiva]);

    // Filtrar items cuando cambia la categoría seleccionada o los resultados
    useEffect(() => {
        if (results) {
            if (selectedCategory) {
                setFilteredItems(results.items.filter(item => item.categoria === selectedCategory));
            } else {
                setFilteredItems(results.items);
            }
        }
    }, [selectedCategory, results]);

    // Función para generar el plan basado en necesidades y capacidad
    const generatePlan = () => {
        if (!necesidades || !capacidadProductiva) {
            toast({
                title: 'Error al generar plan',
                description: 'No se han proporcionado los datos necesarios',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            // Simulación de generación de plan
            const items: MPSItem[] = necesidades.items.map((item, index) => {
                // Asignar prioridad basada en algún criterio (ejemplo: cantidad)
                let prioridad: 'Alta' | 'Media' | 'Baja' = 'Media';
                if (item.necesidad > 100) prioridad = 'Alta';
                else if (item.necesidad < 50) prioridad = 'Baja';

                // Asignar semana (para este ejemplo, todos en semana 1)
                const semana = 1;

                // Crear el item del plan
                return {
                    codigo: item.codigo,
                    nombre: item.nombre,
                    cantidad: item.necesidad,
                    semana,
                    prioridad,
                    categoria: item.categoria,
                    fechaInicio: new Date().toISOString().split('T')[0], // Fecha actual como ejemplo
                    fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 días después
                };
            });

            // Calcular horas de producción total (simulación)
            const horasProduccionTotal = items.reduce((total, item) => total + item.cantidad * 0.5, 0);

            // Crear el objeto MPS
            const mps: MPS = {
                items,
                totalProductos: items.length,
                totalCategorias: necesidades.categorias.length,
                horasProduccionTotal,
                fechaGeneracion: new Date().toISOString()
            };

            // Actualizar el estado
            setResults(mps);
            setFilteredItems(items);

            // Notificar al componente padre
            if (onDataProcessed) {
                onDataProcessed(mps);
            }

            toast({
                title: 'Plan generado',
                description: `Se ha generado un plan con ${items.length} productos`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error al generar plan',
                description: error instanceof Error ? error.message : 'Error desconocido',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Función para finalizar el proceso
    const handleFinish = () => {
        if (!results) {
            toast({
                title: 'No hay resultados',
                description: 'Debe generar un plan antes de finalizar',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        // Notificar al componente padre
        if (onFinish) {
            onFinish();
        }

        toast({
            title: 'Proceso finalizado',
            description: 'El plan maestro de producción ha sido finalizado',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <Card borderRadius="lg" variant="outline" width="100%">
            <CardBody>
                <VStack spacing={6} align="stretch">
                    <Heading size="md">Revisión de Resultados</Heading>

                    {/* Resumen de datos de entrada */}
                    {necesidades && capacidadProductiva && (
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            {/* Resumen de necesidades */}
                            <Box p={4} borderWidth="1px" borderRadius="md" bg="blue.50">
                                <Heading size="sm" mb={2}>Resumen de Necesidades</Heading>
                                <Text><strong>Total de productos:</strong> {necesidades.items.length}</Text>
                                <Text><strong>Categorías:</strong> {necesidades.categorias.length}</Text>
                                <HStack mt={2} wrap="wrap">
                                    {necesidades.categorias.map(cat => (
                                        <Badge key={cat} colorScheme="blue" m={1}>{cat}</Badge>
                                    ))}
                                </HStack>
                            </Box>

                            {/* Resumen de capacidad productiva */}
                            <Box p={4} borderWidth="1px" borderRadius="md" bg="green.50">
                                <Heading size="sm" mb={2}>Capacidad Productiva</Heading>
                                <Text><strong>Horas de trabajo:</strong> {capacidadProductiva.horasTrabajo} h/día</Text>
                                <Text><strong>Días de trabajo:</strong> {capacidadProductiva.diasTrabajo} días/semana</Text>
                                <Text><strong>Eficiencia:</strong> {capacidadProductiva.eficiencia}%</Text>
                                <Text><strong>Modo:</strong> {capacidadProductiva.modoOptimizacion}</Text>
                                <Text>
                                    <strong>Horas extra:</strong> {capacidadProductiva.considerarHorasExtra ? 'Sí' : 'No'}
                                </Text>
                                <Text>
                                    <strong>Producción en paralelo:</strong> {capacidadProductiva.permitirProduccionParalelo ? 'Sí' : 'No'}
                                </Text>
                            </Box>
                        </SimpleGrid>
                    )}

                    {/* Estadísticas del plan generado */}
                    {results && (
                        <Box p={4} borderWidth="1px" borderRadius="md" bg="purple.50">
                            <Heading size="sm" mb={3}>Estadísticas del Plan</Heading>
                            <StatGroup>
                                <Stat>
                                    <StatLabel>Total Productos</StatLabel>
                                    <StatNumber>{results.totalProductos}</StatNumber>
                                    <StatHelpText>En plan de producción</StatHelpText>
                                </Stat>
                                <Stat>
                                    <StatLabel>Categorías</StatLabel>
                                    <StatNumber>{results.totalCategorias}</StatNumber>
                                    <StatHelpText>Diferentes tipos</StatHelpText>
                                </Stat>
                                <Stat>
                                    <StatLabel>Horas Totales</StatLabel>
                                    <StatNumber>{results.horasProduccionTotal.toFixed(1)}</StatNumber>
                                    <StatHelpText>De producción</StatHelpText>
                                </Stat>
                            </StatGroup>
                        </Box>
                    )}

                    <Box>
                        <Text mb={4}>
                            A continuación se muestran los resultados del plan de producción semanal 
                            basado en los parámetros configurados en los pasos anteriores.
                        </Text>

                        {/* Botón para regenerar el plan */}
                        <Button 
                            colorScheme="blue" 
                            mb={4}
                            onClick={generatePlan}
                            isDisabled={!necesidades || !capacidadProductiva}
                        >
                            Regenerar Plan
                        </Button>

                        {results && results.items.length > 0 ? (
                            <>
                                {/* Filtro de categorías */}
                                {necesidades && necesidades.categorias.length > 0 && (
                                    <Flex justify="flex-end" mb={4}>
                                        <HStack>
                                            <Text>Filtrar por categoría:</Text>
                                            <Select 
                                                value={selectedCategory} 
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                placeholder="Todas las categorías"
                                                width="auto"
                                            >
                                                {necesidades.categorias.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </Select>
                                        </HStack>
                                    </Flex>
                                )}

                                {/* Tabla de resultados */}
                                <Box overflowX="auto">
                                    <Table variant="simple">
                                        <Thead>
                                            <Tr>
                                                <Th>Código</Th>
                                                <Th>Producto</Th>
                                                <Th isNumeric>Cantidad</Th>
                                                <Th>Semana</Th>
                                                <Th>Prioridad</Th>
                                                <Th>Categoría</Th>
                                                <Th>Fecha Inicio</Th>
                                                <Th>Fecha Fin</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {filteredItems.map((item, index) => (
                                                <Tr key={`${item.codigo}-${index}`}>
                                                    <Td>{item.codigo}</Td>
                                                    <Td>{item.nombre}</Td>
                                                    <Td isNumeric>{item.cantidad}</Td>
                                                    <Td>Semana {item.semana}</Td>
                                                    <Td>
                                                        <Badge 
                                                            colorScheme={
                                                                item.prioridad === 'Alta' ? 'red' : 
                                                                item.prioridad === 'Media' ? 'yellow' : 'green'
                                                            }
                                                        >
                                                            {item.prioridad}
                                                        </Badge>
                                                    </Td>
                                                    <Td>
                                                        <Badge colorScheme="blue">{item.categoria}</Badge>
                                                    </Td>
                                                    <Td>{item.fechaInicio}</Td>
                                                    <Td>{item.fechaFin}</Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </Box>
                            </>
                        ) : (
                            <Center p={8} borderWidth="1px" borderRadius="md" borderStyle="dashed">
                                <Text color="gray.500">
                                    {!necesidades || !capacidadProductiva 
                                        ? 'No hay datos de entrada disponibles. Por favor complete los pasos anteriores.'
                                        : 'No se ha generado ningún plan. Haga clic en "Regenerar Plan" para generar uno.'}
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
                            isDisabled={!results}
                        >
                            Finalizar
                        </Button>
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    );
}
