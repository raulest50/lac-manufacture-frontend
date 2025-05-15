import {useState} from 'react';
import {Box, Flex, StepDescription, StepNumber, StepSeparator, StepStatus, useSteps} from '@chakra-ui/react';
import {IncorporacionActivoHeader, OrdenCompraActivo} from "../types.tsx";
import {Step, StepIcon, StepIndicator, Stepper, StepTitle} from "@chakra-ui/icons";
import {StepZero} from "./StepZero.tsx";
import {StepOne} from "./StepOne.tsx";


const steps = [
    {title:"Cero", description:"Identificacion Numero OCA"},
    {title:"Primero", description:"Carga Factura"},
    {title:"Tercero", description:"Formulario Incorporacion"},
    {title:"Cuarto", description:"Enviar y Finalizar"}
];

export function RegistroActivosMainComp() {

    const [incorporacionActivoHeader, setIncorporacionActivoHeader] =
        useState<IncorporacionActivoHeader>({});

    const [ordenCompraActivo, setOrdenCompraActivo] = useState<OrdenCompraActivo>({});

    const {activeStep, setActiveStep} = useSteps({
        index: 0,
        count: steps.length,
    });


    function ConditionalRender(){
        if(activeStep === 0){
            return(
                <StepZero
                    setActiveStep={setActiveStep}
                    setOrdenCompraActivo={setOrdenCompraActivo}
                />
            )
        }
        if(activeStep === 1){
            return(
                <StepOne
                    setActiveStep={setActiveStep}
                    setOrdenCompraActivo={setOrdenCompraActivo}
                />
            )
        }
    }


    return (
        <Flex direction={"column"} gap={4}>
            <Stepper index={activeStep} p={'1em'} backgroundColor={"teal.50"} w={'full'} >
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepIndicator>
                            <StepStatus
                                complete={<StepIcon />}
                                incomplete={<StepNumber />}
                                active={<StepNumber />}
                            />
                        </StepIndicator>

                        <Box flexShrink='0'>
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription>{step.description}</StepDescription>
                        </Box>

                        <StepSeparator />
                    </Step>
                ))}
            </Stepper>

            <ConditionalRender />

        </Flex>
    );
}
