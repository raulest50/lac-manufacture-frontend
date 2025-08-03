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
    Box
} from '@chakra-ui/react';

// Import step components
import { StepOneWPlanningWiz } from './StepOneWPlanningWiz/StepOneWPlanningWiz';
import { StepTwoCapProd } from './StepTwoWPlanningWiz/StepTwoCapProd';
import { StepThreeResults } from './StepThreeWPlanningWiz/StepThreeResults';

type Props = {};

export function WeekPlanningWizardTab(props: Props) {
    const steps = [
        { title: 'DefinirNecesidades', description: 'Select Product' },
        { title: 'CapacidadProducción', description: 'Configure Parameters' },
        { title: 'Resultados', description: 'Review Results' }
    ];

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    });

    // Renderizado condicional basado en el paso activo
    const ConditionalRender = () => {
        switch (activeStep) {
            case 0:
                // Arquitectura de control delegado: Pasamos setActiveStep a los hijos
                return (
                    <StepOneWPlanningWiz 
                        onNext={() => setActiveStep(activeStep + 1)} 
                    />
                );
            case 1:
                return (
                    <StepTwoCapProd 
                        onNext={() => setActiveStep(activeStep + 1)} 
                        onPrev={() => setActiveStep(activeStep - 1)} 
                    />
                );
            case 2:
                return (
                    <StepThreeResults 
                        onPrev={() => setActiveStep(activeStep - 1)} 
                        onFinish={() => console.log('Finalizar proceso')} 
                    />
                );
            default:
                return <StepOneWPlanningWiz onNext={() => setActiveStep(1)} />;
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
