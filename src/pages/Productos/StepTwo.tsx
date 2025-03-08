import React, { useState } from "react";
import { ProductoSemiter, Producto, TIPOS_PRODUCTOS, Insumo } from "./types";
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton
} from "@chakra-ui/react";
import SemioterBriefCard from "./components/SemioterBriefCard";
import { IoIosAddCircle } from "react-icons/io";
import { IoMdRemoveCircle } from "react-icons/io";
import MyPagination from "../../components/MyPagination.tsx";
import axios from "axios";
import EndPointsURL from "../../api/EndPointsURL.tsx";

const endPoints = new EndPointsURL();

interface Props {
    setActiveStep: (step: number) => void;
    semioter: ProductoSemiter;
}

const StepTwo: React.FC<Props> = ({ setActiveStep, semioter }) => {
    const TIPO_BUSQUEDA = { nombre: "Nombre", id: "ID" };

    // States for search results
    const [listaMp, setListaMp] = useState<Producto[]>([]);
    const [listaSemi, setListaSemi] = useState<Producto[]>([]);
    const [selectedInsumos, setSelectedInsumos] = useState<Insumo[]>([]);
    const [costoTotal, setCostoTotal] = useState(0);

    const [searchString, setSearchString] = useState("");
    const [clasificacionBusqueda, setClasificacionBusqueda] = useState(
        TIPOS_PRODUCTOS.materiaPrima
    );
    const [tipoBusqueda, setTipoBusqueda] = useState(TIPO_BUSQUEDA.nombre);

    // Pagination and loading state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    // Recalculate total cost when insumos change
    const recalcCostoTotal = (insumos: Insumo[]) => {
        const total = insumos.reduce(
            (sum, insumo) =>
                sum + insumo.producto.costo * insumo.cantidadRequerida,
            0
        );
        setCostoTotal(total);
    };

    const onClickSiguiente = () => {
        // Implement your next step logic here
        setActiveStep(3);
    };

    // Reset all lists and cost
    const onClickCleanLists = () => {
        setListaMp([]);
        setListaSemi([]);
        setSelectedInsumos([]);
        setCostoTotal(0);
    };

    // Search using the new endpoint, updating the corresponding list
    const onClickBuscar = async (page: number = 0) => {
        setLoading(true);
        try {
            const response = await axios.get( endPoints.search_p4_receta_v2, {
                params: {
                    searchTerm: searchString,
                    tipoBusqueda: tipoBusqueda.toUpperCase(), // expecting "NOMBRE" or "ID"
                    clasificacion: clasificacionBusqueda,
                    page: page,
                    size: 10
                }
            });
            const data = response.data;
            setCurrentPage(page);
            setTotalPages(data.totalPages);
            // Update the list based on selected classification
            console.log("PRINT - - - - - - ");
            console.log(response.data);
            if (clasificacionBusqueda === TIPOS_PRODUCTOS.materiaPrima) {
                setListaMp(data.content);
            } else if (clasificacionBusqueda === TIPOS_PRODUCTOS.semiTerminado) {
                setListaSemi(data.content);
            }
        } catch (error) {
            console.error("Error during search", error);
        } finally {
            setLoading(false);
        }
    };

    // Add a product as an insumo (if not already added)
    const handleAddInsumo = (producto: Producto) => {
        const exists = selectedInsumos.some(
            (insumo) => insumo.producto.productoId === producto.productoId
        );
        if (!exists) {
            const newInsumo: Insumo = { producto, cantidadRequerida: 1 };
            const newList = [...selectedInsumos, newInsumo];
            setSelectedInsumos(newList);
            recalcCostoTotal(newList);
        }
    };

    // Remove an insumo from the list
    const handleRemoveInsumo = (productoId: number) => {
        const newList = selectedInsumos.filter(
            (insumo) => insumo.producto.productoId !== productoId
        );
        setSelectedInsumos(newList);
        recalcCostoTotal(newList);
    };

    // Handle changes in required quantity
    const handleCantidadChange = (productoId: number, newCantidad: number) => {
        const newList = selectedInsumos.map((insumo) => {
            if (insumo.producto.productoId === productoId) {
                return { ...insumo, cantidadRequerida: newCantidad };
            }
            return insumo;
        });
        setSelectedInsumos(newList);
        recalcCostoTotal(newList);
    };

    const handlePageChange = (page: number) => {
        onClickBuscar(page);
    };

    // Render the search table rows (either Materia Prima or Semiterminado)
    const renderSearchTableRows = () => {
        const list =
            clasificacionBusqueda === TIPOS_PRODUCTOS.materiaPrima
                ? listaMp
                : listaSemi;
        return list.map((producto) => (
            <Tr key={producto.productoId} _hover={{ bg: "gray.100" }}>
                <Td>{producto.productoId}</Td>
                <Td>{producto.nombre}</Td>
                <Td>{producto.tipoUnidades}</Td>
                <Td>{producto.cantidadUnidad}</Td>
                <Td>
                    <IconButton
                        aria-label="Add Product"
                        icon={<IoIosAddCircle />}
                        colorScheme="green"
                        onClick={() => handleAddInsumo(producto)}
                    />
                </Td>
            </Tr>
        ));
    };

    // Render the selected insumos table rows with quantity and subtotal
    const renderSelectedInsumosRows = () => {
        return selectedInsumos.map((insumo) => {
            const subtotal = insumo.producto.costo * insumo.cantidadRequerida;
            return (
                <Tr key={insumo.producto.productoId} _hover={{ bg: "gray.100" }}>
                    <Td>{insumo.producto.productoId}</Td>
                    <Td>{insumo.producto.nombre}</Td>
                    <Td>{insumo.producto.tipoUnidades}</Td>
                    <Td>{insumo.producto.cantidadUnidad}</Td>
                    <Td>{insumo.producto.costo}</Td>
                    <Td>
                        <Input
                            type="number"
                            value={insumo.cantidadRequerida}
                            onChange={(e) =>
                                handleCantidadChange(
                                    insumo.producto.productoId,
                                    parseFloat(e.target.value)
                                )
                            }
                            width="80px"
                        />
                    </Td>
                    <Td>{subtotal}</Td>
                    <Td>
                        <IconButton
                            aria-label="Remove Insumo"
                            icon={<IoMdRemoveCircle />}
                            colorScheme="red"
                            onClick={() =>
                                handleRemoveInsumo(insumo.producto.productoId)
                            }
                        />
                    </Td>
                </Tr>
            );
        });
    };

    return (
        <Flex direction="column" gap={4} align="center">
            <SemioterBriefCard semioter={semioter} />

            <Flex
                direction="row"
                gap="3em"
                w="full"
                alignItems={"center"}
            >
                <FormControl flex={3}>
                    <FormLabel>Buscar:</FormLabel>
                    <Input
                        value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}
                    />
                </FormControl>

                <Button
                    variant={"solid"}
                    colorScheme={"teal"}
                    flex={1}
                    onClick={() => onClickBuscar(0)}
                    isLoading={loading}
                >
                    Buscar
                </Button>

                <FormControl flex={1}>
                    <FormLabel>Tipo Busqueda:</FormLabel>
                    <Select
                        flex="1"
                        value={tipoBusqueda}
                        onChange={(e) => setTipoBusqueda(e.target.value)}
                    >
                        <option value={TIPO_BUSQUEDA.nombre}>Nombre</option>
                        <option value={TIPO_BUSQUEDA.id}>ID</option>
                    </Select>
                </FormControl>

                <FormControl flex={1}>
                    <FormLabel>Seleccion:</FormLabel>
                    <Select
                        flex="1"
                        value={clasificacionBusqueda}
                        onChange={(e) => setClasificacionBusqueda(e.target.value)}
                    >
                        <option value={TIPOS_PRODUCTOS.materiaPrima}>Materia Prima</option>
                        <option value={TIPOS_PRODUCTOS.semiTerminado}>
                            Semiterminado
                        </option>
                    </Select>
                </FormControl>
            </Flex>

            {/* Search Results Table */}
            <Flex direction="column" w="full">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Producto ID</Th>
                            <Th>Nombre</Th>
                            <Th>Tipo Unidades</Th>
                            <Th>Cantidad por Unidad</Th>
                            <Th>Acción</Th>
                        </Tr>
                    </Thead>
                    <Tbody>{renderSearchTableRows()}</Tbody>
                </Table>
                <MyPagination
                    page={currentPage}
                    totalPages={totalPages}
                    loading={loading}
                    handlePageChange={handlePageChange}
                />
            </Flex>

            {/* Selected Insumos Table */}
            <Flex direction="column" w="full">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Producto ID</Th>
                            <Th>Nombre</Th>
                            <Th>Tipo Unidades</Th>
                            <Th>Cantidad por Unidad</Th>
                            <Th>Costo</Th>
                            <Th>Cantidad Requerida</Th>
                            <Th>Subtotal</Th>
                            <Th>Acción</Th>
                        </Tr>
                    </Thead>
                    <Tbody>{renderSelectedInsumosRows()}</Tbody>
                </Table>
                <Flex justify="flex-end" mt={2} mr={4}>
                    <FormLabel>Total Costo: {costoTotal}</FormLabel>
                </Flex>
            </Flex>

            <Flex direction="row" gap={10}>
                <Button variant="solid" colorScheme="teal" onClick={onClickSiguiente}>
                    Siguiente
                </Button>

                <Button variant="solid" colorScheme="red" onClick={onClickCleanLists}>
                    Limpiar Bandeja Seleccion
                </Button>
            </Flex>
        </Flex>
    );
};

export default StepTwo;
