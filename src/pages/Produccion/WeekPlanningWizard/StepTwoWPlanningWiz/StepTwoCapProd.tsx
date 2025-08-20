import { useState, useEffect } from 'react';
import { 
    Box, 
    Button, 
    HStack, 
    Text, 
    VStack,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Card,
    CardBody,
    SimpleGrid,
    FormErrorMessage,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Tooltip,
    Switch,
    useToast,
    Badge
} from '@chakra-ui/react';
import { CapProductiva, Nececidades } from '../PlanningWizTypes';

type StepTwoCapProdProps = {
    onNext?: () => void;
    onPrev?: () => void;
    necesidades?: Nececidades | null;
    onDataProcessed?: (data: CapProductiva) => void;
};

export function StepTwoCapProd({ onNext, onPrev, necesidades, onDataProcessed }: StepTwoCapProdProps) {
    // Estado local para almacenar la capacidad productiva
    const [capacidad, setCapacidad] = useState<CapProductiva>({
        horasTrabajo: 8,
        diasTrabajo: 5,
        eficiencia: 80,
        modoOptimizacion: 'balanceado',
        considerarHorasExtra: false,
        permitirProduccionParalelo: false
    });

    // Estado para manejar errores de validación
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Estado para mostrar tooltips en sliders
    const [showTooltip, setShowTooltip] = useState(false);

    // Toast para notificaciones
    const toast = useToast();

    // Manejadores de cambio para los campos del formulario
    const handleHorasTrabajoChange = (value: number) => {
        setCapacidad(prev => ({ ...prev, horasTrabajo: value }));
    };

    const handleDiasTrabajoChange = (value: number) => {
        setCapacidad(prev => ({ ...prev, diasTrabajo: value }));
    };

    const handleEficienciaChange = (value: number) => {
        setCapacidad(prev => ({ ...prev, eficiencia: value }));
    };

    const handleModoOptimizacionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as 'tiempo' | 'costo' | 'balanceado';
        setCapacidad(prev => ({ ...prev, modoOptimizacion: value }));
    };

    const handleConsiderarHorasExtraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCapacidad(prev => ({ ...prev, considerarHorasExtra: e.target.checked }));
    };

    const handlePermitirProduccionParaleloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCapacidad(prev => ({ ...prev, permitirProduccionParalelo: e.target.checked }));
    };

    // Función para validar antes de avanzar al siguiente paso
    const handleNext = () => {
        // Validación de los campos
        const newErrors: Record<string, string> = {};

        if (!capacidad.horasTrabajo || capacidad.horasTrabajo < 1) {
            newErrors.horasTrabajo = "Debe definir las horas de trabajo (mínimo 1)";
        }

        if (!capacidad.diasTrabajo || capacidad.diasTrabajo < 1) {
            newErrors.diasTrabajo = "Debe definir los días de trabajo (mínimo 1)";
        }

        if (capacidad.eficiencia === undefined || capacidad.eficiencia < 0) {
            newErrors.eficiencia = "Debe definir la eficiencia (mínimo 0%)";
        }

        if (!capacidad.modoOptimizacion) {
            newErrors.modoOptimizacion = "Debe seleccionar un modo de optimización";
        }

        setErrors(newErrors);

        // Si no hay errores, procesar los datos y avanzar al siguiente paso
        if (Object.keys(newErrors).length === 0) {
            // Notificar al componente padre sobre los datos procesados
            if (onDataProcessed) {
                onDataProcessed(capacidad);
            }

            // Avanzar al siguiente paso
            if (onNext) {
                onNext();
            }

            toast({
                title: 'Capacidad productiva configurada',
                description: 'Los parámetros de capacidad han sido guardados',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Card borderRadius="lg" variant="outline" width="100%">
            <CardBody>
                <VStack spacing={6} align="stretch">
                    <Heading size="md">Configuración de Capacidad Productiva</Heading>

                    {/* Resumen de necesidades si están disponibles */}
                    {necesidades && necesidades.items.length > 0 && (
                        <Box p={4} borderWidth="1px" borderRadius="md" bg="blue.50">
                            <Heading size="sm" mb={2}>Resumen de Necesidades</Heading>
                            <HStack spacing={4} wrap="wrap">
                                <Text>
                                    <strong>Total de productos:</strong> {necesidades.items.length}
                                </Text>
                                <Text>
                                    <strong>Categorías:</strong> {necesidades.categorias.length}
                                </Text>
                                {necesidades.categorias.map(cat => (
                                    <Badge key={cat} colorScheme="blue" m={1}>{cat}</Badge>
                                ))}
                            </HStack>
                        </Box>
                    )}

                    <Text>
                        Configure los parámetros de capacidad productiva para generar el plan semanal.
                        Ajuste los valores según la disponibilidad real de recursos.
                    </Text>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                        <FormControl isInvalid={!!errors.horasTrabajo}>
                            <FormLabel>Horas de Trabajo por Día</FormLabel>
                            <NumberInput 
                                min={1} 
                                max={24} 
                                value={capacidad.horasTrabajo}
                                onChange={(_, value) => handleHorasTrabajoChange(value)}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            {errors.horasTrabajo && (
                                <FormErrorMessage>{errors.horasTrabajo}</FormErrorMessage>
                            )}
                        </FormControl>

                        <FormControl isInvalid={!!errors.diasTrabajo}>
                            <FormLabel>Días de Trabajo por Semana</FormLabel>
                            <NumberInput 
                                min={1} 
                                max={7} 
                                value={capacidad.diasTrabajo}
                                onChange={(_, value) => handleDiasTrabajoChange(value)}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            {errors.diasTrabajo && (
                                <FormErrorMessage>{errors.diasTrabajo}</FormErrorMessage>
                            )}
                        </FormControl>

                        <FormControl isInvalid={!!errors.eficiencia}>
                            <FormLabel>Eficiencia de Producción (%)</FormLabel>
                            <Box px={2}>
                                <Slider 
                                    value={capacidad.eficiencia}
                                    min={0} 
                                    max={100} 
                                    step={5}
                                    onChange={handleEficienciaChange}
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                >
                                    <SliderTrack>
                                        <SliderFilledTrack />
                                    </SliderTrack>
                                    <Tooltip
                                        hasArrow
                                        bg='blue.500'
                                        color='white'
                                        placement='top'
                                        isOpen={showTooltip}
                                        label={`${capacidad.eficiencia}%`}
                                    >
                                        <SliderThumb />
                                    </Tooltip>
                                </Slider>
                            </Box>
                            {errors.eficiencia && (
                                <FormErrorMessage>{errors.eficiencia}</FormErrorMessage>
                            )}
                        </FormControl>

                        <FormControl isInvalid={!!errors.modoOptimizacion}>
                            <FormLabel>Modo de Optimización</FormLabel>
                            <Select 
                                value={capacidad.modoOptimizacion}
                                onChange={handleModoOptimizacionChange}
                            >
                                <option value="tiempo">Optimizar Tiempo</option>
                                <option value="costo">Optimizar Costo</option>
                                <option value="balanceado">Balanceado</option>
                            </Select>
                            {errors.modoOptimizacion && (
                                <FormErrorMessage>{errors.modoOptimizacion}</FormErrorMessage>
                            )}
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                            <FormLabel mb="0">
                                Considerar Horas Extra
                            </FormLabel>
                            <Switch 
                                colorScheme="blue" 
                                isChecked={capacidad.considerarHorasExtra}
                                onChange={handleConsiderarHorasExtraChange}
                            />
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                            <FormLabel mb="0">
                                Permitir Producción en Paralelo
                            </FormLabel>
                            <Switch 
                                colorScheme="blue" 
                                isChecked={capacidad.permitirProduccionParalelo}
                                onChange={handlePermitirProduccionParaleloChange}
                            />
                        </FormControl>
                    </SimpleGrid>

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
                            colorScheme="blue" 
                            onClick={handleNext}
                        >
                            Siguiente
                        </Button>
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    );
}
