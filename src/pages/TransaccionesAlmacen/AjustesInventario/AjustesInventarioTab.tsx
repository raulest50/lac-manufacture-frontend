import {
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useSteps,
    IconButton
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";
import axios from "axios";
import MyPagination from "../../../components/MyPagination.tsx";
import EndPointsURL from "../../../api/EndPointsURL.tsx";
import { Producto } from "../../Productos/types.tsx";

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
                    <Flex direction={{base: 'column', lg: 'row'}} gap={4} w={'full'}>
                        <Box
                            flex={1}
                            p={4}
                            borderWidth={'1px'}
                            borderRadius={'md'}
                            borderColor={'gray.200'}
                            w={'full'}
                        >
                            <Text fontSize={'lg'} fontWeight={'semibold'} mb={3}>
                                Resultados de búsqueda
                            </Text>
                            <Flex direction={'column'} gap={4}>
                                <Flex
                                    direction={{base: 'column', xl: 'row'}}
                                    align={{xl: 'flex-end'}}
                                    gap={4}
                                    w={'full'}
                                >
                                    <FormControl flex={1}>
                                        <FormLabel>Buscar:</FormLabel>
                                        <Input
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            placeholder={'Ingresa el nombre del producto'}
                                            isDisabled={chkbox.length === 0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSearch();
                                                }
                                            }}
                                        />
                                    </FormControl>

                                    <FormControl flex={1}>
                                        <FormLabel>Categorías:</FormLabel>
                                        <CheckboxGroup
                                            colorScheme={'green'}
                                            value={chkbox}
                                            onChange={(values) => setChkbox(values as string[])}
                                        >
                                            <Stack
                                                spacing={[2, 3]}
                                                direction={'column'}
                                                border={'1px solid gray'}
                                                borderRadius={'10px'}
                                                p={'1em'}
                                                w={'full'}
                                            >
                                                <Checkbox value={'material empaque'}>
                                                    Material de empaque
                                                </Checkbox>
                                                <Checkbox value={'materia prima'}>Materia Prima</Checkbox>
                                                <Checkbox value={'semiterminado'}>SemiTerminado</Checkbox>
                                                <Checkbox value={'terminado'}>Producto Terminado</Checkbox>
                                            </Stack>
                                        </CheckboxGroup>
                                    </FormControl>
                                </Flex>

                                <Flex justifyContent={{base: 'stretch', xl: 'flex-start'}}>
                                    <Button
                                        onClick={handleSearch}
                                        colorScheme={'blue'}
                                        isLoading={loading}
                                        w={{base: 'full', xl: 'auto'}}
                                    >
                                        Search
                                    </Button>
                                </Flex>

                                <Box>
                                    <CurrentStepComponent />
                                </Box>

                                <Box>
                                    {loading ? (
                                        <Text color={'gray.500'}>Cargando productos...</Text>
                                    ) : productos.length > 0 ? (
                                        <Table size={'sm'} variant={'simple'}>
                                            <Thead>
                                                <Tr>
                                                    <Th>ID</Th>
                                                    <Th>Nombre</Th>
                                                    <Th>Tipo</Th>
                                                    <Th textAlign={'center'}>Acciones</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {productos.map((producto) => (
                                                    <Tr key={producto.productoId}>
                                                        <Td>{producto.productoId}</Td>
                                                        <Td>{producto.nombre}</Td>
                                                        <Td textTransform={'capitalize'}>{producto.tipo_producto}</Td>
                                                        <Td textAlign={'center'}>
                                                            <IconButton
                                                                aria-label={'Agregar producto'}
                                                                icon={<AddIcon />}
                                                                size={'sm'}
                                                                variant={'outline'}
                                                                onClick={() => handleAddProduct(producto)}
                                                            />
                                                        </Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    ) : (
                                        <Text color={'gray.500'}>No hay productos para mostrar.</Text>
                                    )}
                                </Box>

                                <MyPagination
                                    page={page}
                                    totalPages={totalPages}
                                    loading={loading}
                                    handlePageChange={handlePageChange}
                                />
                            </Flex>
                        </Box>

                        <Box
                            flex={1}
                            p={4}
                            borderWidth={'1px'}
                            borderRadius={'md'}
                            borderColor={'gray.200'}
                            w={'full'}
                        >
                            <Text fontSize={'lg'} fontWeight={'semibold'} mb={3}>
                                Items seleccionados
                            </Text>
                            {selectedProducts.length > 0 ? (
                                <Table size={'sm'} variant={'simple'}>
                                    <Thead>
                                        <Tr>
                                            <Th>ID</Th>
                                            <Th>Nombre</Th>
                                            <Th>Tipo</Th>
                                            <Th textAlign={'center'}>Acciones</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {selectedProducts.map((producto) => (
                                            <Tr key={producto.productoId}>
                                                <Td>{producto.productoId}</Td>
                                                <Td>{producto.nombre}</Td>
                                                <Td textTransform={'capitalize'}>{producto.tipo_producto}</Td>
                                                <Td textAlign={'center'}>
                                                    <IconButton
                                                        aria-label={'Remover producto'}
                                                        icon={<DeleteIcon />}
                                                        colorScheme={'red'}
                                                        size={'sm'}
                                                        variant={'ghost'}
                                                        onClick={() => handleRemoveProduct(producto.productoId)}
                                                    />
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            ) : (
                                <Text color={'gray.500'}>Añade productos para verlos aquí.</Text>
                            )}
                        </Box>
                    </Flex>
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
