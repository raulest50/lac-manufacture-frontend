import {
    Flex,
    Stack,
    Checkbox,
    CheckboxGroup,
    FormControl,
    FormLabel,
    Input,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import MyPagination from "../../components/MyPagination";
import { Producto } from "./types";
import EndPointsURL from "../../api/EndPointsURL";

const endpoints = new EndPointsURL();

export default function InformeProductosTab() {
    const [chkbox, setChkbox] = useState<string[]>(["material empaque"]);
    const [searchText, setSearchText] = useState("");
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10; // adjust as needed

    // Fetch products given a page number
    const fetchProductos = async (pageNumber: number) => {
        setLoading(true);
        try {
            const response = await axios.post(endpoints.consulta_productos, {
                search: searchText,
                categories: chkbox,
                page: pageNumber,
                size: pageSize,
            });
            // Expecting a Page<Producto> response
            setProductos(response.data.content);
            setTotalPages(response.data.totalPages);
            setPage(response.data.number);
        } catch (error) {
            console.error("Error searching productos:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initiate a new search, resetting to page 0
    const handleSearch = () => {
        fetchProductos(0);
    };

    // Handle page changes from the pagination component
    const handlePageChange = (newPage: number) => {
        fetchProductos(newPage);
    };

    return (
        <Flex direction="column" p={4}>
            <Flex direction="row" align="center" gap={10} w="full" mb={4}>
                <FormControl>
                    <FormLabel>Buscar:</FormLabel>
                    <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Enter product name"
                        isDisabled={chkbox.length === 0}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Categorías:</FormLabel>
                    <CheckboxGroup
                        colorScheme="green"
                        value={chkbox}
                        onChange={(values) => setChkbox(values as string[])}
                    >
                        <Stack
                            spacing={[2, 5]}
                            direction="column"
                            border="1px solid gray"
                            borderRadius="10px"
                            p="1em"
                            w="fit-content"
                        >
                            <Checkbox value="material empaque">
                                Material de empaque
                            </Checkbox>
                            <Checkbox value="materia prima">Materia Prima</Checkbox>
                            <Checkbox value="semiterminado">SemiTerminado</Checkbox>
                            <Checkbox value="terminado">Producto Terminado</Checkbox>
                        </Stack>
                    </CheckboxGroup>
                </FormControl>

                <Button onClick={handleSearch} colorScheme="blue" isLoading={loading}>
                    Search
                </Button>
            </Flex>

            <TableContainer>
                <Table variant="striped" colorScheme="gray">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Nombre</Th>
                            <Th>Costo</Th>
                            <Th>Tipo</Th>
                            <Th>Fecha Creación</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {productos.map((producto) => (
                            <Tr key={producto.productoId}>
                                <Td>{producto.productoId}</Td>
                                <Td>{producto.nombre}</Td>
                                <Td>{producto.costo}</Td>
                                <Td>{producto.tipo_producto}</Td>
                                <Td>{producto.fechaCreacion}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            <MyPagination
                page={page}
                totalPages={totalPages}
                loading={loading}
                handlePageChange={handlePageChange}
            />
        </Flex>
    );
}
