import { useState } from 'react';
import {
    Flex,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
    Box,
    useToast
} from '@chakra-ui/react';

// Import step components
import { StepOneWPlanningWiz } from './StepOneWPlanningWiz/StepOneWPlanningWiz';
import { StepTwoCapProd } from './StepTwoWPlanningWiz/StepTwoCapProd';
import { StepThreeResults } from './StepThreeWPlanningWiz/StepThreeResults';

// Import types
import { Nececidades, CapProductiva, MPS } from './PlanningWizTypes';

type Props = {};

export function WeekPlanningWizardTab(props: Props) {
    // Estado para almacenar los datos de cada paso
    const [necesidades, setNecesidades] = useState<Nececidades | null>(null);
    const [capacidadProductiva, setCapacidadProductiva] = useState<CapProductiva | null>(null);
    const [resultados, setResultados] = useState<MPS | null>(null);

    // Toast para notificaciones
    const toast = useToast();

    const steps = [
        { title: 'Definir Necesidades', description: 'Seleccionar Productos' },
        { title: 'Capacidad Producción', description: 'Configurar Parámetros' },
        { title: 'Resultados', description: 'Revisar Resultados' }
    ];

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    });

    // Función para manejar los datos de necesidades
    const handleNecesidadesProcessed = (data: Nececidades) => {
        setNecesidades(data);
        toast({
            title: 'Necesidades procesadas',
            description: `Se han procesado ${data.items.length} items de necesidad`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    // Función para manejar los datos de capacidad productiva
    const handleCapacidadProcessed = (data: CapProductiva) => {
        setCapacidadProductiva(data);
        toast({
            title: 'Capacidad productiva configurada',
            description: 'Los parámetros de capacidad han sido guardados',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    // Función para manejar los resultados
    const handleResultadosProcessed = (data: MPS) => {
        setResultados(data);
        toast({
            title: 'Resultados generados',
            description: 'El plan maestro de producción ha sido generado',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    // Función para finalizar el proceso
    const handleFinish = () => {
        toast({
            title: 'Proceso finalizado',
            description: 'El plan maestro de producción ha sido finalizado',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        console.log('Finalizar proceso con datos:', { necesidades, capacidadProductiva, resultados });
    };

    // Renderizado condicional basado en el paso activo
    const ConditionalRender = () => {
        switch (activeStep) {
            case 0:
                return (
                    <StepOneWPlanningWiz 
                        onNext={() => setActiveStep(activeStep + 1)} 
                        onDataProcessed={handleNecesidadesProcessed}
                    />
                );
            case 1:
                return (
                    <StepTwoCapProd 
                        onNext={() => setActiveStep(activeStep + 1)} 
                        onPrev={() => setActiveStep(activeStep - 1)}
                        necesidades={necesidades}
                        onDataProcessed={handleCapacidadProcessed}
                    />
                );
            case 2:
                return (
                    <StepThreeResults 
                        onPrev={() => setActiveStep(activeStep - 1)} 
                        onFinish={handleFinish}
                        necesidades={necesidades}
                        capacidadProductiva={capacidadProductiva}
                        onDataProcessed={handleResultadosProcessed}
                    />
                );
            default:
                return <StepOneWPlanningWiz onNext={() => setActiveStep(1)} onDataProcessed={handleNecesidadesProcessed} />;
        }
    };

    return (
        <Flex direction="column" width="100%">
            <Stepper index={activeStep} gap='0'>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepIndicator>
                            <StepStatus
                                complete={<StepIcon/>}
                                incomplete={<StepNumber/>}
                                active={<StepNumber/>}
                            />
                        </StepIndicator>
                        <Box flexShrink='0'>
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription>{step.description}</StepDescription>
                        </Box>
                        <StepSeparator/>
                    </Step>
                ))}
            </Stepper>

            <Box mt={8} mb={4}>
                <ConditionalRender/>
            </Box>

        </Flex>
    );
}
