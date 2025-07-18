import {useState} from 'react';
import {Box, Flex, StepDescription, StepNumber, StepSeparator, StepStatus, useSteps} from '@chakra-ui/react';
import {IncorporacionActivoDta, OrdenCompraActivo} from "../types.tsx";
import {Step, StepIcon, StepIndicator, Stepper, StepTitle} from "@chakra-ui/icons";
import {StepZeroTipoIngreso} from "./StepZeroTipoIngreso.tsx";
import {StepOneFormulario} from "./StepOneFormulario.tsx";


const steps = [
    {title:"Cero", description:"Tipo de Ingreso"},
    {title:"Primero", description:"Carga Factura"},
    {title:"Tercero", description:"Formulario Incorporacion"},
    {title:"Cuarto", description:"Enviar y Finalizar"}
];

export function IncorporacionActivosFijos() {

    const [incorporacionActivoDta, setIncorporacionActivoDta] =
        useState<IncorporacionActivoDta>({});

    const [ordenCompraActivo, setOrdenCompraActivo] = useState<OrdenCompraActivo>({});

    const {activeStep, setActiveStep} = useSteps({
        index: 0,
        count: steps.length,
    });


    function ConditionalRender(){
        if(activeStep === 0){
            return(
                <StepZeroTipoIngreso
                    setActiveStep={setActiveStep}
                    setOrdenCompraActivo={setOrdenCompraActivo}
                    setIncorporacionActivoHeader={setIncorporacionActivoDta}
                />
            )
        }
        if(activeStep === 1){
            return(
                <StepOneFormulario
                    setActiveStep={setActiveStep}
                    setIncorporacionActivoHeader={setIncorporacionActivoDta}
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
