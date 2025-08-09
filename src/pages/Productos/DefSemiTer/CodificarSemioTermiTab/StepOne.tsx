// StepOneComponent.tsx
import {
    Button,
    Flex, FormControl, FormLabel, GridItem, HStack, Input, Select, SimpleGrid, Textarea, useToast,
    Spinner, Text, Alert, AlertIcon
} from "@chakra-ui/react";
import {useState, useEffect} from "react";
import axios from 'axios';
import EndPointsURL from '../../../../api/EndPointsURL.tsx';
import {ProductoSemiter, UNIDADES, TIPOS_PRODUCTOS, Familia} from "../../types.tsx";


interface props {
    setActiveStep: (step: number) => void;
    setSemioter: (semioter: ProductoSemiter) => void;
    refreshFamilias?: number;
}

export default function StepOne({setActiveStep, setSemioter, refreshFamilias = 0}: props) {
    // Local copy of the order's items to track verification state.

    const [productoId, setProductoId] = useState<string>("");
    const [nombre, setNombre] = useState<string>("");
    const [tipoUnidades, setTipoUnidades] = useState<string>(UNIDADES.L);
    const [cantidadUnidad, setCantidadUnidad] = useState<string>("");
    const [observaciones, setObservaciones] = useState<string>("");
    const [tipo_producto, setTipo_producto] = useState<string>(TIPOS_PRODUCTOS.terminado);

    // Estados para manejar familias
    const [familiasDisponibles, setFamiliasDisponibles] = useState<Familia[]>([]);
    const [selectedFamiliaId, setSelectedFamiliaId] = useState<number | null>(null);
    const [loadingFamilias, setLoadingFamilias] = useState<boolean>(false);
    const [errorFamilias, setErrorFamilias] = useState<string | null>(null);

    const endPoints = new EndPointsURL();
    const toast = useToast();

    // Función para cargar las familias
    const fetchFamilias = async () => {
        if (tipo_producto === TIPOS_PRODUCTOS.terminado) {
            try {
                setLoadingFamilias(true);
                setErrorFamilias(null);
                const response = await axios.get(endPoints.get_familias);
                setFamiliasDisponibles(response.data);

                // Si no hay familias, mostrar un mensaje
                if (response.data.length === 0) {
                    toast({
                        title: "Advertencia",
                        description: "No hay familias disponibles. Por favor, cree una familia primero.",
                        status: "warning",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            } catch (error) {
                console.error('Error fetching familias:', error);

                // Manejo mejorado de excepciones
                let errorMessage = 'Error al cargar las familias';

                // Extraer el mensaje de error específico del backend
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.data && error.response.data.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response.data && typeof error.response.data === 'string') {
                        errorMessage = error.response.data;
                    }
                }

                setErrorFamilias(errorMessage);
                toast({
                    title: "Error",
                    description: errorMessage,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setLoadingFamilias(false);
            }
        }
    };

    // Cargar familias cuando el componente se monta, cuando cambia el tipo de producto,
    // o cuando se actualiza refreshFamilias
    useEffect(() => {
        fetchFamilias();
    }, [tipo_producto, refreshFamilias]);

    // Limpiar la selección de familia cuando se cambia a producto semiterminado
    useEffect(() => {
        if (tipo_producto !== TIPOS_PRODUCTOS.terminado) {
            setSelectedFamiliaId(null);
        }
    }, [tipo_producto]);

    const onClickBorrarCampos = () => {
        setProductoId("");
        setNombre("");
        setCantidadUnidad("");
        setObservaciones("");
        setSelectedFamiliaId(null);
    }

    const ValidarDatos = (): boolean => {
        // Check if productoId is empty
        if (!productoId || productoId.trim() === "") {
            toast({
                title: "Validación",
                description: "El campo 'Código Id' es requerido.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
        // Check if productoId contains only alphanumeric characters (letters and numbers)
        if (!/^[a-zA-Z0-9]+$/.test(productoId)) {
            toast({
                title: "Validación",
                description: "El 'Código Id' solo puede contener letras y números, sin espacios ni caracteres especiales.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
        // Check if nombre is empty
        if (!nombre || nombre.trim() === "") {
            toast({
                title: "Validación",
                description: "El campo 'Nombre' es requerido.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
        // Check if cantidadUnidad is empty
        if (!cantidadUnidad || cantidadUnidad.trim() === "") {
            toast({
                title: "Validación",
                description: "El campo 'Contenido por envase' es requerido.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
        // Check if cantidadUnidad is a valid number
        if (isNaN(Number(cantidadUnidad))) {
            toast({
                title: "Validación",
                description: "El 'Contenido por envase' debe ser un número válido.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
        /* Comentado para hacer el campo observaciones opcional
        // Check if observaciones is empty
        if (!observaciones || observaciones.trim() === "") {
            toast({
                title: "Validación",
                description: "El campo 'Observaciones' es requerido.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
        */

        // Validar que se haya seleccionado una familia para productos terminados
        if (tipo_producto === TIPOS_PRODUCTOS.terminado && !selectedFamiliaId) {
            toast({
                title: "Validación",
                description: "Debe seleccionar una familia para productos terminados.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }

        return true;
    };

    const onClickSiguiente = () => {
        if(ValidarDatos()){
            // Encontrar la familia seleccionada
            const selectedFamilia = familiasDisponibles.find(f => f.familiaId === selectedFamiliaId);

            const semioter: ProductoSemiter = {
                productoId: productoId!,
                nombre: nombre!,
                observaciones: observaciones || "",
                tipoUnidades: tipoUnidades,
                cantidadUnidad: cantidadUnidad!,
                tipo_producto: tipo_producto,
                familia: tipo_producto === TIPOS_PRODUCTOS.terminado ? selectedFamilia : undefined
            };
            setSemioter(semioter);
            setActiveStep(1);
        }
    };

    return (
        <Flex direction="column" gap={4} align="center">
            <SimpleGrid w="full" h="full" columns={3} gap="2em">

                <GridItem colSpan={1}>
                    <FormControl isRequired={true}>
                        <FormLabel>Codigo Id</FormLabel>
                        <Input
                            value={productoId}
                            onChange={(e) => setProductoId(e.target.value)}
                            variant="filled"
                        />
                    </FormControl>
                </GridItem>

                <GridItem colSpan={2}>
                    <FormControl isRequired={true}>
                        <FormLabel>Nombre</FormLabel>
                        <Input
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            variant="filled"
                        />
                    </FormControl>
                </GridItem>

                <GridItem colSpan={1}>
                    <Flex w="full" direction="row" align="flex-end" justify="space-around" gap={4}>
                        <Select
                            flex="1"
                            value={tipoUnidades}
                            onChange={(e) => setTipoUnidades(e.target.value)}
                        >
                            <option value={UNIDADES.KG}>{UNIDADES.KG}</option>
                            <option value={UNIDADES.L}>{UNIDADES.L}</option>
                            <option value={UNIDADES.U}>{UNIDADES.U}</option>
                        </Select>
                        <FormControl flex="4" isRequired>
                            <FormLabel>Contenido por envase</FormLabel>
                            <Input
                                value={cantidadUnidad}
                                onChange={(e) => setCantidadUnidad(e.target.value)}
                                variant="filled"
                            />
                        </FormControl>
                    </Flex>
                </GridItem>

                <GridItem colSpan={1}>
                    <Flex w="full" direction="row" align="flex-end" justify="space-around" gap={4}>
                        <FormControl>
                            <FormLabel> Seleccionar Tipo de Producto</FormLabel>
                            <Select
                                flex="1"
                                value={tipo_producto}
                                onChange={(e) => setTipo_producto(e.target.value)}
                            >
                                <option value={TIPOS_PRODUCTOS.semiTerminado}>Semiterminado</option>
                                <option value={TIPOS_PRODUCTOS.terminado}>Terminado</option>
                            </Select>
                        </FormControl>
                    </Flex>
                </GridItem>

                <GridItem colSpan={1} display={tipo_producto === TIPOS_PRODUCTOS.terminado ? "flex" : "none"}>
                    <FormControl isRequired={tipo_producto === TIPOS_PRODUCTOS.terminado}>
                        <FormLabel>Familia</FormLabel>
                        <Select
                            value={selectedFamiliaId || ""}
                            onChange={(e) => setSelectedFamiliaId(Number(e.target.value))}
                            isDisabled={loadingFamilias || familiasDisponibles.length === 0}
                            placeholder="Seleccione una familia"
                        >
                            {familiasDisponibles.map((familia) => (
                                <option key={familia.familiaId} value={familia.familiaId}>
                                    {familia.familiaNombre}
                                </option>
                            ))}
                        </Select>
                        {loadingFamilias && <Spinner size="sm" ml={2} />}
                        {errorFamilias && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                                {errorFamilias}
                            </Text>
                        )}
                        {!loadingFamilias && !errorFamilias && familiasDisponibles.length === 0 && (
                            <Text color="orange.500" fontSize="sm" mt={1}>
                                No hay familias disponibles. Por favor, cree una familia primero.
                            </Text>
                        )}
                    </FormControl>
                </GridItem>


                <GridItem colSpan={3}>
                    <FormControl>
                        <FormLabel>Observaciones</FormLabel>
                        <Textarea
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            variant="filled"
                        />
                    </FormControl>
                </GridItem>


            </SimpleGrid>
            <HStack>
                <Button
                    variant={"solid"}
                    colorScheme={"red"}
                    onClick={onClickBorrarCampos}
                >
                    Borrar Campos
                </Button>

                <Button
                    variant={"solid"}
                    colorScheme={"teal"}
                    onClick={onClickSiguiente}
                    isDisabled={
                        tipo_producto === TIPOS_PRODUCTOS.terminado && 
                        (familiasDisponibles.length === 0 || !selectedFamiliaId)
                    }
                >
                    Siguiente
                </Button>
            </HStack>
        </Flex>
    );
}
