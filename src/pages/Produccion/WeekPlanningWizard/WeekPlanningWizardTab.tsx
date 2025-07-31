import {useState} from 'react';
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

type Props = {};

export function WeekPlanningWizardTab(props: Props) {
    const steps = [
        {title: 'DefinirNecesidades', description: 'Select Product'},
        {title: '2', description: 'Configure Parameters'},
        {title: '3', description: 'Review Results'}
    ];

    const {activeStep, setActiveStep} = useSteps({
        index: 0,
        count: steps.length,
    });

    const [activeStepIndex, setActiveStepIndex] = useState(0);

    const ConditionalRender = () => {
        
        
        
    }
    
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

            <ConditionalRender/>

        </Flex>
    );
}
