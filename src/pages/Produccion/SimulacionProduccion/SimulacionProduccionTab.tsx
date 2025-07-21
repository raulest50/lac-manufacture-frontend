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

export function SimulacionProduccionTab(props: Props) {
    const steps = [
        {title: 'First', description: 'Select Product'},
        {title: 'Second', description: 'Configure Parameters'},
        {title: 'Third', description: 'Review Results'}
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
