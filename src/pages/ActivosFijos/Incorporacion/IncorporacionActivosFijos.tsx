import {useState} from 'react';
import {Box, Flex, StepDescription, StepNumber, StepSeparator, StepStatus, useSteps} from '@chakra-ui/react';
import {IncorporacionActivoDto, OrdenCompraActivo} from "../types.tsx";
import {Step, StepIcon, StepIndicator, Stepper, StepTitle} from "@chakra-ui/icons";
import {StepZeroTipoIngreso} from "./step_zero/StepZeroTipoIngreso.tsx";
import {StepOneFormulario} from "./step_one/StepOneFormulario.tsx";
import {StepTwoDocSuppIaf} from "./step_two/StepTwoDocSuppIAF.tsx";
import {StepThreeValSend} from "./step_three/StepThreeValSend.tsx";


const steps = [
    {title:"0", description:"Tipo de Incorporacion"},
    {title:"1", description:"Formulario de Activos"},
    {title:"2", description:"Factura / Doc Soporte"},
    {title:"3", description:"Validar y Enviar"}
];

export function IncorporacionActivosFijos() {

    const [incorporacionActivoDto, setIncorporacionActivoDto] =
        useState<IncorporacionActivoDto>({});

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
                    setIncorporacionActivoHeader={setIncorporacionActivoDto}
                />
            )
        }
        if(activeStep === 1){
            return(
                <StepOneFormulario
                    setActiveStep={setActiveStep}
                    setIncorporacionActivoHeader={setIncorporacionActivoDto}
                    incorporacionActivoDto={incorporacionActivoDto}
                    ordenCompraActivo={ordenCompraActivo}
                />
            )
        }
        if(activeStep === 2){
            return(
                <StepTwoDocSuppIaf
                    setActiveStep={setActiveStep}
                    setIncorporacionActivoHeader={setIncorporacionActivoDto}
                    incorporacionActivoDto={incorporacionActivoDto}
                />
            )
        }
        if(activeStep === 3){
            return(
                <StepThreeValSend
                    setActiveStep={setActiveStep}
                    incorporacionActivoDto={incorporacionActivoDto}
                    ordenCompraActivo={ordenCompraActivo}
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
