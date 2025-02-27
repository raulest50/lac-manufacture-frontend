
import {
    Box,
    Flex,
    StepStatus,
    StepNumber,
    StepDescription,
    StepSeparator, useSteps
} from "@chakra-ui/react";

import {Step, StepIcon, StepIndicator, Stepper, StepTitle} from "@chakra-ui/icons";
import Step1DefineSaveProc from "./Step1DefineSaveProc.tsx";
import Step0SelectTarget from "./Step0SelectTarget.tsx";
import Step2Finish from "./Step2Finish.tsx";


const steps = [
    { title: 'Primero', description: 'Seleccionar Terminado/Semiterminado' },
    { title: 'Segundo', description: 'Definir Proceso' },
    { title: 'Tercero', description: 'Finalizar' },
]


export default function ProcessDesignTab(){

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    });

    const ConditionalRenderStep = () => {
        if (activeStep === 0){
            return(
                <Step0SelectTarget setActiveStep={setActiveStep}/>
            )
        }
        if (activeStep === 1){
            return(
                <Step1DefineSaveProc setActiveStep={setActiveStep}/>
            )
        }
        if (activeStep === 2){
            return(
                <Step2Finish setActiveStep={setActiveStep}/>
            )
        }
    }

    return(
        <Flex direction={"column"} gap={8} p={"1em"} >


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

            <ConditionalRenderStep/>

        </Flex>
    )

}