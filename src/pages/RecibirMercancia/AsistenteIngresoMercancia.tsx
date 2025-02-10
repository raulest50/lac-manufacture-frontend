
import {
    Box,
    Container,
    Flex, Heading,
    Input,
    Text,
    StepDescription,
    StepNumber,
    StepSeparator,
    StepStatus,
    useSteps, FormControl, FormLabel, Button
} from "@chakra-ui/react";
import {Step, StepIcon, StepIndicator, Stepper, StepTitle} from "@chakra-ui/icons";



const steps = [
    { title: 'Primero', description: 'Identificar Orden Compra' },
    { title: 'Segundo', description: 'Revisar cantidades de cada Item' },
    { title: 'Tercero', description: 'Confirmar o Rechazar Recepcion' },
]


export default function AsistenteIngresoMercancia() {

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    });

    function ConditionalRenderStep() {
        if (activeStep === 1) {
            return(
                <Flex p={"1em"} direction={"column"} backgroundColor={"blue.50"} gap={4} alignItems={"center"}>
                    <Heading fontFamily={'Comfortaa Variable'}>Identificar Orden de Compra</Heading>
                    <Text fontFamily={'Comfortaa Variable'}>Ingrese el id de la factura para comprobar que esta asociada a una orden de compra</Text>
                    <Flex w={"40%"} direction={"column"} gap={4}>
                        <FormControl isRequired>
                            <FormLabel >Id Factura</FormLabel>
                            <Input />
                        </FormControl>
                        <Button variant={"solid"} colorScheme={"teal"}>Buscar</Button>
                    </Flex>
                </Flex>
            );
        }
        if (activeStep === 2) {
            return(
                <>
                </>
            );
        }
        if (activeStep === 3) {
            return(
                <>
                </>
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
                <Input
                    value={activeStep}
                    onChange={(e) => {setActiveStep(Number(e.target.value))}}
                />
                <ConditionalRenderStep/>

            </Flex>

        </Container>
    )
}