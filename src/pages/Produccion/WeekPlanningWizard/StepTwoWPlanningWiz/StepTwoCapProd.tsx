import { useState } from 'react';
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
    Switch
} from '@chakra-ui/react';
import { CapProductiva } from '../PlanningWizTypes';

type StepTwoCapProdProps = {
    onNext?: () => void;
    onPrev?: () => void;
};

export function StepTwoCapProd({ onNext, onPrev }: StepTwoCapProdProps) {
    // Estado local para almacenar la capacidad productiva
    const [capacidad, setCapacidad] = useState<CapProductiva>({});

    // Estado para manejar errores de validación
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Estado para mostrar tooltips en sliders
    const [showTooltip, setShowTooltip] = useState(false);

    // Función para validar antes de avanzar al siguiente paso
    const handleNext = () => {
        // Validación de ejemplo (puedes personalizar según tus necesidades)
        const newErrors: Record<string, string> = {};

        // Aquí irían las validaciones específicas
        // Por ejemplo:
        // if (!capacidad.horasTrabajo) {
        //     newErrors.horasTrabajo = "Debe definir las horas de trabajo";
        // }

        setErrors(newErrors);

        // Si no hay errores, avanzar al siguiente paso
        if (Object.keys(newErrors).length === 0 && onNext) {
            onNext();
        }
    };

    return (
        <Card borderRadius="lg" variant="outline" width="100%">
            <CardBody>
                <VStack spacing={6} align="stretch">
                    <Heading size="md">Configuración de Capacidad Productiva</Heading>

                    <Text>
                        Configure los parámetros de capacidad productiva para generar el plan semanal.
                        Ajuste los valores según la disponibilidad real de recursos.
                    </Text>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                        <FormControl isInvalid={!!errors.horasTrabajo}>
                            <FormLabel>Horas de Trabajo por Día</FormLabel>
                            <NumberInput min={1} max={24} defaultValue={8}>
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
                            <NumberInput min={1} max={7} defaultValue={5}>
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
                                    defaultValue={80} 
                                    min={0} 
                                    max={100} 
                                    step={5}
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
                                        label="80%"
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
                            <Select defaultValue="balanceado">
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
                            <Switch colorScheme="blue" />
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                            <FormLabel mb="0">
                                Permitir Producción en Paralelo
                            </FormLabel>
                            <Switch colorScheme="blue" />
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
