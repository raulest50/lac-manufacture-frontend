
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
import StepZeroComponent from "./StepZeroComponent";
import {useState} from "react";
import {IngresoOCM_DTA, OrdenCompra} from "../types";
import StepOneComponent from "./StepOneComponent";
import StepTwoComponent from "./StepTwoComponent";
import StepThreeComponent from "./StepThreeComponent";
import StepFourComponent from "./StepFourComponent";



const steps = [
    { title: 'Primero', description: 'Identificar Orden Compra' },
    { title: 'Segundo', description: 'Verificar Cantidades' },
    { title: 'Tercero', description: 'Subir soporte y Enviar' },
    { title: 'Cuarto', description: 'Finalizacion' },
]


export default function AsistenteIngresoMercancia() {

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    });

    const [selectedOrder, setSelectedOrder] = useState<OrdenCompra|null>(null);

    const [ingresoOCM_DTA, setIngresoOCM_DTA] = useState<IngresoOCM_DTA | null>(null);

    function ConditionalRenderStep() {
        if (activeStep === 0) { // identificar la orden de compra
            return(
                <StepZeroComponent setActiveStep={setActiveStep} setSelectedOrder={setSelectedOrder} />
            );
        }
        if (activeStep === 1) { // verificar cantidades en el pedido
            return(
                <StepOneComponent setActiveStep={setActiveStep} orden={selectedOrder} setIngresoOCM_DTA={setIngresoOCM_DTA} />
            );
        }
        if (activeStep === 2) { // subir documento soporte
            return(
                <StepTwoComponent setActiveStep={setActiveStep} orden={selectedOrder} setIngresoOCM_DTA={setIngresoOCM_DTA}/>
            );
        }
        if (activeStep === 3) { // verificar los datos y enviar a backend
            return(
                <StepThreeComponent setActiveStep={setActiveStep} docIngresoDTA={ingresoOCM_DTA} />
            );
        }
        if (activeStep === 4){ // ventana de finalizacion, no se hace nada, solo notifica al usuario
            return(
                <StepFourComponent setActiveStep={setActiveStep}/>
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
