import { useState, useEffect } from "react";
import { Proveedor, DTO_SearchProveedor } from "./types.tsx";
import {
    Flex,
    FormControl,
    FormLabel,
    Input,
    Stack,
    CheckboxGroup,
    Checkbox,
    Button,
    Heading,
    Box,
    useToast, Select
} from "@chakra-ui/react";
import MyPagination from "../../components/MyPagination.tsx";
import { ListaSearchProveedores } from "./components/ListaSearchProveedores.tsx";
import axios from "axios";
import EndPointsURL from "../../api/EndPointsURL.tsx";

export default function ConsultarProveedores() {
    const toast = useToast();
    const endpoints = new EndPointsURL();

    // Search states
    const [searchType, setSearchType] = useState<'ID' | 'COMBINED'>('ID');
    const [searchText, setSearchText] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);

    // Pagination states
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    // Category definitions
    const categoryOptions = [
        { id: 0, name: 'Servicios Operativos' },
        { id: 1, name: 'Materias Primas' },
        { id: 2, name: 'Materiales de empaque' },
        { id: 3, name: 'Servicios administrativos' },
        { id: 4, name: 'Equipos y otros servicios' }
    ];

    // Fetch providers on initial load
    useEffect(() => {
        if (searchText.trim()) {
            fetchProveedores(0);
        }
    }, []);

    const fetchProveedores = async (pageNumber: number) => {
        if (!searchText.trim()) {
            toast({
                title: "Ingrese un texto de búsqueda",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        setPage(pageNumber);

        try {
            const searchDTO: DTO_SearchProveedor = {
                searchType: searchType,
                searchText: searchText,
                categories: searchType === 'COMBINED' ? selectedCategories : []
            };

            const response = await axios.post(
                `${endpoints.search_proveedores_pag}?page=${pageNumber}&size=${pageSize}`,
                searchDTO,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            setProveedores(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching providers:", error);
            toast({
                title: "Error al buscar proveedores",
                description: "Ocurrió un error al buscar proveedores. Por favor, intente nuevamente.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setProveedores([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    // Handle page changes from the pagination component
    const handlePageChange = (newPage: number) => {
        fetchProveedores(newPage);
    };

    // Handle category selection
    const handleCategoryChange = (values: string[]) => {
        setSelectedCategories(values.map(Number));
    };

    // Handle search button click
    const handleSearch = () => {
        fetchProveedores(0);
    };

    return (
        <Flex direction={"column"} p={4}>
            <Heading size="md" mb={4}>Consulta de Proveedores</Heading>

            <Box p={4} borderWidth="1px" borderRadius="lg" mb={4}>
                <Flex direction={"row"} mb={4} gap={2}>
                    <FormControl mb={4} >
                        <FormLabel>Tipo de Búsqueda</FormLabel>
                        <Select value={searchType} onChange={(e) => setSearchType(e.target.value as 'ID' | 'COMBINED')}>
                            <option value="ID">Búsqueda por ID</option>
                            <option value="COMBINED">Búsqueda por Nombre y Categorías</option>
                        </Select>
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel>{searchType === 'ID' ? 'ID del Proveedor' : 'Nombre del Proveedor'}</FormLabel>
                        <Input 
                            placeholder={searchType === 'ID' ? "Ingrese el ID del proveedor" : "Ingrese el nombre del proveedor"} 
                            value={searchText} 
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </FormControl>

                    {searchType === 'COMBINED' && (
                        <FormControl mb={4}>
                            <FormLabel>Categorías</FormLabel>
                            <CheckboxGroup 
                                colorScheme="green" 
                                value={selectedCategories.map(String)} 
                                onChange={handleCategoryChange}
                            >
                                <Stack spacing={2}>
                                    {categoryOptions.map(category => (
                                        <Checkbox key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </Checkbox>
                                    ))}
                                </Stack>
                            </CheckboxGroup>
                        </FormControl>
                    )}

                    <Button 
                        colorScheme="blue" 
                        onClick={handleSearch} 
                        isLoading={loading}
                        alignSelf="flex-start"
                        mt={2}
                    >
                        Buscar
                    </Button>
                </Flex>
            </Box>

            {proveedores.length > 0 && (
                <Box mb={4}>
                    <ListaSearchProveedores proveedores={proveedores} />
                </Box>
            )}

            {totalPages > 1 && (
                <MyPagination
                    page={page}
                    totalPages={totalPages}
                    loading={loading}
                    handlePageChange={handlePageChange}
                />
            )}
        </Flex>
    );
}
