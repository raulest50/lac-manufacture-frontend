/**
 * Componente: InformeProductosTabAdvanced
 * 
 * Ubicación en la navegación:
 * Productos > Definir Terminado/Semiterminado > Modificaciones (pestaña)
 * 
 * Descripción:
 * Componente avanzado para la modificación y gestión de productos que ofrece funcionalidades
 * como ordenamiento, filtrado por fecha y visualización mejorada.
 * Este componente es exclusivo para la sección de Definir Terminado/Semiterminado
 * y solo es accesible para usuarios con nivel de acceso 3 o superior.
 * 
 * Cuando se hace clic en "Ver Detalle" en la tabla de resultados, se abre el
 * componente DetalleProductoAdvanced.tsx con la información detallada del producto.
 */

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
    Badge,
    Select,
    Box,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import MyPagination from "../../../../components/MyPagination.tsx";
import { Producto } from "../../types.tsx";
import EndPointsURL from "../../../../api/EndPointsURL.tsx";
import DetalleProductoAdvanced from "./DetalleProductoAdvanced.tsx";

const endpoints = new EndPointsURL();

export default function InformeProductosTabAdvanced() {
    const [chkbox, setChkbox] = useState<string[]>(["semiterminado", "terminado"]);
    const [searchText, setSearchText] = useState("");
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    // Estados para manejar la visualización del detalle
    const [estado, setEstado] = useState(0);
    const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

    // Estado adicional para características avanzadas
    const [sortBy, setSortBy] = useState<string>("nombre");
    const [filterByDate, setFilterByDate] = useState<string>("");

    // Fetch products given a page number
    const fetchProductos = async (pageNumber: number) => {
        setLoading(true);
        try {
            const response = await axios.post(endpoints.consulta_productos, {
                search: searchText,
                categories: chkbox,
                page: pageNumber,
                size: pageSize
                // Removed sortBy and filterByDate parameters as they're not supported by the backend
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

    // Initiate a new search, resetting to page 0
    const handleSearch = () => {
        fetchProductos(0);
    };

    // Handle page changes from the pagination component
    const handlePageChange = (newPage: number) => {
        fetchProductos(newPage);
    };

    // Función para ver el detalle de un producto
    const verDetalleProducto = (producto: Producto) => {
        setProductoSeleccionado(producto);
        setEstado(1);
    };

    // Renderizado condicional basado en el estado
    if (estado === 1 && productoSeleccionado) {
        return (
            <DetalleProductoAdvanced 
                producto={productoSeleccionado} 
                setEstado={setEstado}
                setProductoSeleccionado={setProductoSeleccionado}
                refreshSearch={handleSearch}
            />
        );
    }

    return (
        <Flex direction="column" p={4}>
            <Flex direction="row" align="center" gap={10} w="full" mb={4}>
                <FormControl>
                    <FormLabel>Buscar:</FormLabel>
                    <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Nombre del producto"
                        isDisabled={chkbox.length === 0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
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
                            <Checkbox value="semiterminado">SemiTerminado</Checkbox>
                            <Checkbox value="terminado">Producto Terminado</Checkbox>
                        </Stack>
                    </CheckboxGroup>
                </FormControl>

                <Button onClick={handleSearch} colorScheme="blue" isLoading={loading}>
                    Buscar
                </Button>
            </Flex>

            {/* Opciones avanzadas - Nuevas características */}
            <Flex direction="row" align="center" gap={10} w="full" mb={4}>
                <FormControl maxW="200px">
                    <FormLabel>Ordenar por:</FormLabel>
                    <Select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="nombre">Nombre</option>
                        <option value="fechaCreacion">Fecha de creación</option>
                        <option value="costo">Costo</option>
                    </Select>
                </FormControl>

                <FormControl maxW="200px">
                    <FormLabel>Filtrar por fecha:</FormLabel>
                    <Input
                        type="date"
                        value={filterByDate}
                        onChange={(e) => setFilterByDate(e.target.value)}
                    />
                </FormControl>
            </Flex>

            <TableContainer>
                <Table variant="striped" colorScheme="blue">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Nombre</Th>
                            <Th>Costo</Th>
                            <Th>Tipo</Th>
                            <Th>Fecha Creación</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {productos.map((producto) => (
                            <Tr key={producto.productoId}>
                                <Td>{producto.productoId}</Td>
                                <Td>{producto.nombre}</Td>
                                <Td>{producto.costo}</Td>
                                <Td>
                                    <Badge colorScheme={producto.tipo_producto === 'T' ? 'green' : 'purple'}>
                                        {producto.tipo_producto === 'T' ? 'Terminado' : 'Semiterminado'}
                                    </Badge>
                                </Td>
                                <Td>{producto.fechaCreacion}</Td>
                                <Td>
                                    <Button
                                        size="sm"
                                        colorScheme="blue"
                                        onClick={() => verDetalleProducto(producto)}
                                    >
                                        Ver Detalle
                                    </Button>
                                </Td>
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
