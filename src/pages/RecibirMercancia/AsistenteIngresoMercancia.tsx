
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
import StepZeroComponent from "./StepZeroComponent.tsx";
import {useState} from "react";
import {DocIngresoDTA, OrdenCompra} from "./types.tsx";
import StepOneComponent from "./StepOneComponent.tsx";
import StepTwoComponent from "./StepTwoComponent.tsx";
import StepThreeComponent from "./StepThreeComponent.tsx";



const steps = [
    { title: 'Primero', description: 'Identificar Orden Compra' },
    { title: 'Segundo', description: 'Verificar Cantidades' },
    { title: 'Tercero', description: 'Foto doc. soporte' },
    { title: 'Cuarto', description: 'Confirmar o Rechazar Recepcion' },
]


export default function AsistenteIngresoMercancia() {

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    });

    const [selectedOrder, setSelectedOrder] = useState<OrdenCompra|null>(null);

    const [docIngresoDTA, setDocIngresoDTA] = useState<DocIngresoDTA | null>(null);

    function ConditionalRenderStep() {
        if (activeStep === 0) {
            return(
                <StepZeroComponent setActiveStep={setActiveStep} setSelectedOrder={setSelectedOrder}/>
            );
        }
        if (activeStep === 1) {
            return(
                <StepOneComponent setActiveStep={setActiveStep} orden={selectedOrder} />
            );
        }
        if (activeStep === 2) {
            return(
                <StepTwoComponent setActiveStep={setActiveStep} orden={selectedOrder} setDocIngresoDTA={setDocIngresoDTA}/>
            );
        }
        if (activeStep === 3) {
            return(
                <StepThreeComponent setActiveStep={setActiveStep} docIngresoDTA={docIngresoDTA} />
            );
        }
        if (activeStep === 4){
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