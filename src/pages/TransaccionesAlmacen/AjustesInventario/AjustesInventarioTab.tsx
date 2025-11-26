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
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import axios from "axios";
import EndPointsURL from "../../../api/EndPointsURL.tsx";
import { Producto } from "../../Productos/types.tsx";
import Step1SelProdAdjInv from "./Step1_SelProd_AdjInv.tsx";
import Step2FillData from "./Step2_FillData.tsx";
import Step3SendAjuste from "./Step3_SendAjuste.tsx";
import { useAuth } from "../../../context/AuthContext.tsx";

const steps = [
    {title: "AjusteInvStep_Zero", description: "Selección de productos"},
    {title: "AjusteInvStep_One", description: "Especificar cantidades"},
    {title: "AjusteInvStep_Two", description: "Revisar y enviar"},
    {title: "AjusteInvStep_Confirmation", description: "Confirmación"}
];

export default function AjustesInventarioTab(){
    const [chkbox, setChkbox] = useState<string[]>(["material empaque"]);
    const [searchText, setSearchText] = useState("");
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState<Producto[]>([]);
    const [quantities, setQuantities] = useState<Record<string, number | "">>({});
    const [lotNumbers, setLotNumbers] = useState<Record<string, string>>({});
    const [activeStep, setActiveStep] = useState(0);
    const [observaciones, setObservaciones] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const pageSize = 10;

    const endpoints = useMemo(() => new EndPointsURL(), []);
    const { user } = useAuth();

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
        setQuantities((prev) => {
            const {[productoId]: _, ...rest} = prev;
            return rest;
        });
        setLotNumbers((prev) => {
            const {[productoId]: _, ...rest} = prev;
            return rest;
        });
    };

    const handleChangeQuantity = (productoId: string, value: string) => {
        const parsedValue = value === "" ? "" : Number(value);
        setQuantities((prev) => ({
            ...prev,
            [productoId]: parsedValue,
        }));
    };

    const handleChangeLotNumber = (productoId: string, value: string) => {
        setLotNumbers((prev) => ({
            ...prev,
            [productoId]: value,
        }));
    };

    const handleSendAdjustment = async () => {
        setSubmissionError(null);
        setIsSubmitting(true);

        try {
            const movimientos = selectedProducts.map((producto) => {
                const cantidad = quantities[producto.productoId];
                const numeroLote = lotNumbers[producto.productoId]?.trim();

                const movimiento: { productoId: string; cantidad: number; numeroLote?: string } = {
                    productoId: producto.productoId,
                    cantidad: typeof cantidad === "number" ? cantidad : 0,
                };

                if (numeroLote) {
                    movimiento.numeroLote = numeroLote;
                }

                return movimiento;
            });

            const payload = {
                movimientos,
                motivo: "AJUSTE_DE_INVENTARIO",
                almacen: "GENERAL",
                usuarioId: user ?? "",
                ...(observaciones.trim() ? {observaciones: observaciones.trim()} : {}),
                urlDocSoporte: undefined,
            };

            await axios.post(endpoints.save_ajuste_inventario, payload);
            setSubmissionSuccess(true);
            setActiveStep(steps.length - 1);
        } catch (error) {
            console.error("Error enviando el ajuste de inventario:", error);
            setSubmissionError("No se pudo enviar el ajuste. Intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const goToNext = () => {
        setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const goToStart = () => {
        if (submissionSuccess) {
            resetFlow();
        } else {
            setActiveStep(0);
            setSubmissionError(null);
        }
    };

    const goToPrevious = () => {
        if (submissionSuccess) {
            return;
        }

        setActiveStep((prev) => Math.max(prev - 1, 0));
        setSubmissionError(null);
    };

    const resetFlow = () => {
        setSelectedProducts([]);
        setQuantities({});
        setLotNumbers({});
        setObservaciones("");
        setSubmissionError(null);
        setSubmissionSuccess(false);
        setActiveStep(0);
    };

    const areQuantitiesValid =
        selectedProducts.length > 0 &&
        selectedProducts.every(({productoId}) => {
            const quantity = quantities[productoId];
            const lotNumber = lotNumbers[productoId] ?? "";
            const trimmedLotNumber = lotNumber.trim();
            const isValidQuantity =
                typeof quantity === "number" && !Number.isNaN(quantity) && quantity !== 0;
            const isValidLot = !(lotNumber.length > 0 && trimmedLotNumber === "");

            return isValidQuantity && isValidLot;
        });

    const renderStepContent = () => {
        if (activeStep === 0) {
            return (
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
            );
        }

        if (activeStep === 1) {
            return (
                <Step2FillData
                    selectedProducts={selectedProducts}
                    quantities={quantities}
                    onChangeQuantity={handleChangeQuantity}
                    lotNumbers={lotNumbers}
                    onChangeLotNumber={handleChangeLotNumber}
                    observaciones={observaciones}
                    onChangeObservaciones={setObservaciones}
                />
            );
        }

        if (activeStep === steps.length - 1) {
            return (
                <Flex direction={{ base: "column" }} gap={4}>
                    <Box p={4} borderWidth={"1px"} borderRadius={"md"} borderColor={"green.200"} w={"full"} bg={"green.50"}>
                        <Text fontSize={"lg"} fontWeight={"bold"} color={"green.700"}>
                            Ajuste enviado correctamente
                        </Text>
                        <Text mt={2} color={"green.800"}>
                            El ajuste de inventario se registró. Puedes iniciar un nuevo ajuste cuando lo necesites.
                        </Text>
                        <Flex mt={4} justifyContent={{ base: "flex-start", md: "flex-end" }}>
                            <Button colorScheme={"teal"} onClick={resetFlow}>
                                Iniciar nuevo ajuste
                            </Button>
                        </Flex>
                    </Box>
                </Flex>
            );
        }

        return (
            <Step3SendAjuste
                selectedProducts={selectedProducts}
                quantities={quantities}
                lotNumbers={lotNumbers}
                observaciones={observaciones}
                currentUserName={user ?? ""}
                onBack={goToPrevious}
                onSend={handleSendAdjustment}
                isSending={isSubmitting}
                error={submissionError}
            />
        );
    };

    const isNextDisabled =
        (activeStep === 0 && selectedProducts.length === 0) ||
        (activeStep === 1 && !areQuantitiesValid) ||
        activeStep >= steps.length - 2;

    const isPreviousDisabled = activeStep === 0 || submissionSuccess;

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
                        <Text>{steps[activeStep]?.description}</Text>
                    </Box>

                    {renderStepContent()}
                </Box>

                <Flex alignItems={'center'} justifyContent={'space-between'} gap={2}>
                    <Button onClick={goToStart} isDisabled={activeStep === 0} variant={'ghost'}>
                        Volver al paso inicial
                    </Button>

                    <Flex gap={2} justifyContent={'flex-end'}>
                        <Button onClick={goToPrevious} isDisabled={isPreviousDisabled} variant={'outline'}>
                            Anterior
                        </Button>
                        <Button onClick={goToNext} isDisabled={isNextDisabled} colorScheme={'teal'}>
                            Siguiente
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </Container>
    );
}
