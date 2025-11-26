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
    {title: "AjusteInvStep_Two", description: "Revisar y enviar"}
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
            const payload = selectedProducts.map((producto) => ({
                productoId: producto.productoId,
                nombre: producto.nombre,
                tipoProducto: producto.tipo_producto,
                cantidad: quantities[producto.productoId],
                lote: lotNumbers[producto.productoId],
            }));

            // TODO: replace with the actual inventory adjustment endpoint when available
            await axios.post(endpoints.search_transacciones_almacen, {
                items: payload,
                observaciones,
                usuario: user?.username ?? user?.email ?? "",
            });
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
        setActiveStep(0);
        setSubmissionError(null);
    };

    const goToPrevious = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
        setSubmissionError(null);
    };

    const areQuantitiesValid =
        selectedProducts.length > 0 &&
        selectedProducts.every(({productoId}) => {
            const quantity = quantities[productoId];
            const lotNumber = lotNumbers[productoId]?.trim();
            const isValidQuantity = typeof quantity === "number" && !Number.isNaN(quantity);
            const isValidLot = Boolean(lotNumber);

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

        return (
            <Step3SendAjuste
                selectedProducts={selectedProducts}
                quantities={quantities}
                lotNumbers={lotNumbers}
                observaciones={observaciones}
                currentUserName={user?.username ?? user?.email ?? user?.uid}
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
        activeStep === steps.length - 1;

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
                        <Button onClick={goToPrevious} isDisabled={activeStep === 0} variant={'outline'}>
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
