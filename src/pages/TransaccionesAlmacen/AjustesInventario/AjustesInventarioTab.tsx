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
    useSteps,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import EndPointsURL from "../../../api/EndPointsURL.tsx";
import { Producto } from "../../Productos/types.tsx";
import Step1SelProdAdjInv from "./Step1_SelProd_AdjInv.tsx";

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
    const [chkbox, setChkbox] = useState<string[]>(["material empaque"]);
    const [searchText, setSearchText] = useState("");
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState<Producto[]>([]);
    const pageSize = 10;

    const endpoints = new EndPointsURL();

    const fetchProductos = async (pageNumber: number) => {
        setLoading(true);
        try {
            const response = await axios.post(endpoints.consulta_productos, {
                search: searchText,
                categories: chkbox,
                page: pageNumber,
                size: pageSize,
            });
            setProductos(response.data.content);
            setTotalPages(response.data.totalPages);
            setPage(response.data.number);
        } catch (error) {
            console.error("Error searching productos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchProductos(0);
    };

    const handlePageChange = (newPage: number) => {
        fetchProductos(newPage);
    };

    const handleAddProduct = (producto: Producto) => {
        setSelectedProducts((prevSelected) => {
            if (prevSelected.some((item) => item.productoId === producto.productoId)) {
                return prevSelected;
            }

            return [...prevSelected, producto];
        });
    };

    const handleRemoveProduct = (productoId: string) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.filter((item) => item.productoId !== productoId)
        );
    };

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
                    <Box mb={4}>
                        <CurrentStepComponent />
                    </Box>

                    <Step1SelProdAdjInv
                        searchText={searchText}
                        setSearchText={setSearchText}
                        chkbox={chkbox}
                        setChkbox={setChkbox}
                        productos={productos}
                        loading={loading}
                        page={page}
                        totalPages={totalPages}
                        handleSearch={handleSearch}
                        handlePageChange={handlePageChange}
                        handleAddProduct={handleAddProduct}
                        handleRemoveProduct={handleRemoveProduct}
                        selectedProducts={selectedProducts}
                    />
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
