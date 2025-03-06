
import {
    Box,
    Container,
    Flex,
    StepDescription,
    StepNumber,
    StepSeparator,
    StepStatus,
    useSteps,
} from "@chakra-ui/react";
import {Step, StepIcon, StepIndicator, Stepper, StepTitle} from "@chakra-ui/icons";
import StepOne from "./StepOne.tsx";
import {useState} from "react";
import {ProductoSemiter} from "./types.tsx";



const steps = [
    { title: 'Primero', description: 'Definir Insumos y Otros Campos' },
    { title: 'Segundo', description: 'Definir Proceso de Produccion' },
    { title: 'Tercero', description: 'Definir Parametros de Salida' },
    { title: 'Cuarto', description: 'Finalizacion' },
]


export default function CodificarSemioTermi() {

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    });


    const [semioter, setSemioter] = useState<ProductoSemiter>();



    function ConditionalRenderStep() {
        if (activeStep === 0) { // identificar la orden de compra
            return(
                <StepOne setActiveStep={setActiveStep} setSemioter={setSemioter} />
            );
        }
        if (activeStep === 1) { // verificar cantidades en el pedido
            return(
                <></>
            );
        }
        if (activeStep === 2) { // subir documento soporte
            return(
                <></>
            );
        }
        if (activeStep === 3) { // verificar los datos y enviar a backend
            return(
                <></>
            );
        }
        if (activeStep === 4){ // ventana de finalizacion, no se hace nada, solo notifica al usuario
            return(
                <></>
            );
        }
    }

    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
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
                <ConditionalRenderStep/>
            </Flex>

        </Container>
    )
}