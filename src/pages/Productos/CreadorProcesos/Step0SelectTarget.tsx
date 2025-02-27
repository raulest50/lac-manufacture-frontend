
import {useState} from "react";

import {
    Box,
    Button, Flex, FormControl,
    FormLabel, Heading,
    Input, Select, Table, Tbody,
    Td, Text, Th, Thead, Tr, VStack
} from "@chakra-ui/react";
import {Target} from "./types.tsx";
import axios from "axios";
import MyPagination from "../../../components/MyPagination.tsx";
import EndPointsURL from "../../../api/EndPointsURL.tsx";

interface Props {
    setActiveStep: (step: number) => void;
}

const endpoints = new EndPointsURL();

export default function Step0SelectTarget({setActiveStep}: Props) {

    const [search, setSearch] = useState("");

    const seleccionOptions = {terminados: "Terminados", semiterminados: "Semiterminados"};

    /**
     * "Terminados" : se buscan solo terminados y se muestran solo terminados en la tabla de picking
     * "Semiterminados" :  lo mismo pero con Semiterminados
     */
    const [seleccion, setSeleccion] = useState(seleccionOptions.terminados);

    const [targets, setTargets] = useState<Target[]>([]);

    const [selectedTarget, setSelectedTarget] = useState<Target>();

    // Pagination and loading states
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);


    /**
     * Handles fetching products from the backend.
     * For "Terminados", we assume an endpoint /productos/search_terminados exists.
     * For "Semiterminados", we use the existing /productos/search_semi endpoint.
     */
    const fetchTargets = async (page: number, searchTerm: string, selectionType: string) => {
        setLoading(true);
        try {
            if (selectionType === seleccionOptions.terminados) {
                // Call the endpoint for Terminado products (assuming it exists)
                const response = await axios.get(endpoints.search_terminado_byname, {
                    params: { searchTerm, tipoBusqueda: "NOMBRE", page, size: 10 },
                });
                setTargets(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                // Call the endpoint for Semiterminado products
                const response = await axios.get(endpoints.search_semi_byname_4pd, {
                    params: { search, tipoBusqueda: "NOMBRE", page, size: 10 },
                });
                setTargets(response.data.content);
                setTotalPages(response.data.totalPages);
            }
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching targets:", error);
        }
        setLoading(false);
    };


    const onClickBuscar = async (seleccion: string) => {
        // Reset page to 0 and fetch
        fetchTargets(0, search, seleccion);
    }

    const onClickNextStep = () => {
        setActiveStep(1);
    }

    // Handle page change from the pagination component
    const handlePageChange = (page: number) => {
        fetchTargets(page, search, seleccion);
    };

    return(
        <Flex
            direction={"column"}
            gap={5}
            alignItems={"center"}
            p={"1em"}
        >
            <Flex
                direction={"row"}
                boxShadow={"xs"}
                gap={10}
                p={"3em"}
                w={"full"}
                alignItems={"center"}
                bg={"green.50"}
            >
                <VStack flex={2}>
                    <Heading> Seleccionar Target </Heading>
                    <Text> Seleccione un terminado o semiterminado de la lista </Text>
                </VStack>
                <FormControl flex={2}>
                    <FormLabel> Buscar </FormLabel>
                    <Input
                        value = {search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </FormControl>
                <FormControl flex={1}>
                    <FormLabel> Filtrar: </FormLabel>
                    <Select
                        value={seleccion}
                        onChange={(e) => {
                            setSeleccion(e.target.value);
                            onClickBuscar(e.target.value);
                            }
                        }
                    >
                        <option value={seleccionOptions.terminados}>{seleccionOptions.terminados}</option>
                        <option value={seleccionOptions.semiterminados}>{seleccionOptions.semiterminados}</option>
                    </Select>
                </FormControl>
                <Button
                    variant={"solid"}
                    colorScheme={"blue"}
                    onClick={ () => { onClickBuscar(seleccion); }}
                    flex={1}
                >
                    Buscar
                </Button>
            </Flex>

            {/* Table to display the products */}
            <Box overflowX="auto" w="100%">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Nombre</Th>
                            <Th>Tipo Producto</Th>
                            <Th>Tipo Unidades</Th>
                            <Th>Fecha Creación</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {targets.map((target) => (
                            <Tr
                                key={target.productoId}
                                onClick={() => setSelectedTarget(target)}
                                cursor="pointer"
                                bg={selectedTarget?.productoId === target.productoId ? "blue.100" : "transparent"}
                                _hover={{ bg: "gray.100" }}
                            >
                                <Td>{target.productoId}</Td>
                                <Td>{target.nombre}</Td>
                                <Td>{target.tipo_producto}</Td>
                                <Td>{target.tipoUnidades}</Td>
                                <Td>{new Date(target.fechaCreacion).toLocaleDateString()}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Pagination component */}
            <MyPagination page={currentPage} totalPages={totalPages} loading={loading} handlePageChange={handlePageChange} />

            <Button
                variant={"solid"}
                colorScheme={"blue"}
                onClick={onClickNextStep}
                isDisabled={!selectedTarget}
            >
                Siguiente
            </Button>
        </Flex>
    );
}