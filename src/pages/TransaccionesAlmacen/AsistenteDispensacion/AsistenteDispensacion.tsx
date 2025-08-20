import {Box, Container, Flex, StepDescription, StepNumber, StepSeparator, StepStatus, useSteps} from '@chakra-ui/react';
import {Step, StepIcon, StepIndicator, Stepper, StepTitle} from '@chakra-ui/icons';
import {useState} from 'react';
import StepOneComponent from './StepOneComponent';
import StepTwoComponent from './StepTwoComponent';
import StepThreeComponent from './StepThreeComponent';
import {DispensacionDTO} from '../types';

const steps = [
    {title:'Primero', description:'Identificar Orden'},
    {title:'Segundo', description:'Editar Dispensación'},
    {title:'Tercero', description:'Revisar y Enviar'}
];

export function AsistenteDispensacion(){
    const {activeStep, setActiveStep} = useSteps({index:0, count:steps.length});
    const [dispensacion, setDispensacion] = useState<DispensacionDTO | null>(null);

    const renderStep = () => {
        if(activeStep===0){
            return <StepOneComponent setActiveStep={setActiveStep} setDispensacion={setDispensacion}/>;
        }
        if(activeStep===1){
            return <StepTwoComponent setActiveStep={setActiveStep} dispensacion={dispensacion} setDispensacion={setDispensacion}/>;
        }
        if(activeStep===2){
            return <StepThreeComponent setActiveStep={setActiveStep} dispensacion={dispensacion}/>;
        }
    };

    return (
        <Container minW={['auto','container.lg','container.xl']} w='full' h='full'>
            <Flex direction='column' gap={4}>
                <Stepper index={activeStep} p='1em' backgroundColor='teal.50' w='full'>
                    {steps.map((step, index)=>(
                        <Step key={index}>
                            <StepIndicator>
                                <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />}/>
                            </StepIndicator>
                            <Box flexShrink='0'>
                                <StepTitle>{step.title}</StepTitle>
                                <StepDescription>{step.description}</StepDescription>
                            </Box>
                            <StepSeparator />
                        </Step>
                    ))}
                </Stepper>
                {renderStep()}
            </Flex>
        </Container>
    );
}
