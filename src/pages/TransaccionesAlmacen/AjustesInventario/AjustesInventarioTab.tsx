import {
    Box,
    Button,
    Container,
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
    Text,
    useSteps
} from "@chakra-ui/react";

const steps = [
    {title: "AjusteInvStep_Zero", description: "Selección de productos"},
    {title: "AjusteInvStep_One", description: "Especificar cantidades"},
    {title: "AjusteInvStep_Two", description: "Enviar"}
];

const AjusteInvStep_Zero = () => (
    <Text>Selecciona los productos que deseas ajustar.</Text>
);

const AjusteInvStep_One = () => (
    <Text>Define las cantidades que se actualizarán para cada producto.</Text>
);

const AjusteInvStep_Two = () => (
    <Text>Revisa la información y envía el ajuste de inventario.</Text>
);

const stepComponents = [AjusteInvStep_Zero, AjusteInvStep_One, AjusteInvStep_Two];

export default function AjustesInventarioTab(){
    const {activeStep, setActiveStep} = useSteps({index: 0, count: steps.length});
    const CurrentStepComponent = stepComponents[activeStep];

    const goToNext = () => {
        setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const goToPrevious = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
    };

    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <Flex direction={'column'} gap={4}>
                <Stepper index={activeStep} p={'1em'} backgroundColor={'teal.50'} w={'full'}>
                    {steps.map((step, index) => (
                        <Step key={step.title}>
                            <StepIndicator>
                                <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />}/>
                            </StepIndicator>
                            <Box flexShrink={'0'}>
                                <StepTitle>{step.title}</StepTitle>
                                <StepDescription>{step.description}</StepDescription>
                            </Box>
                            {index < steps.length - 1 && <StepSeparator />}
                        </Step>
                    ))}
                </Stepper>

                <Box backgroundColor={'white'} p={4} borderRadius={'md'} boxShadow={'sm'}>
                    <CurrentStepComponent />
                </Box>

                <Flex gap={2} justifyContent={'flex-end'}>
                    <Button onClick={goToPrevious} isDisabled={activeStep === 0} variant={'outline'}>
                        Anterior
                    </Button>
                    <Button onClick={goToNext} isDisabled={activeStep === steps.length - 1} colorScheme={'teal'}>
                        Siguiente
                    </Button>
                </Flex>
            </Flex>
        </Container>
    );
}
