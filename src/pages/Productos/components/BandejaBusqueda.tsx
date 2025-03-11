// BandejaBusqueda.tsx
import React, { useState } from "react";
import { Producto, TIPOS_PRODUCTOS } from "../types";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
    Text,
    Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import EndPointsURL from "../../../api/EndPointsURL";

const endPoints = new EndPointsURL();

interface BandejaBusquedaProps {
    onAddInsumo: (producto: Producto) => void;
}

const BandejaBusqueda: React.FC<BandejaBusquedaProps> = ({ onAddInsumo }) => {
    // State variables for search inputs and results
    const [searchString, setSearchString] = useState("");
    const [tipoBusqueda, setTipoBusqueda] = useState("Nombre");
    const [clasificacion, setClasificacion] = useState(TIPOS_PRODUCTOS.materiaPrima);
    const [results, setResults] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(false);

    // Function to perform search against the backend
    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.get(endPoints.search_p4_receta_v2, {
                params: {
                    searchTerm: searchString,
                    tipoBusqueda: tipoBusqueda.toUpperCase(), // expecting "NOMBRE" or "ID"
                    clasificacion: clasificacion,
                    page: 0,
                    size: 10,
                },
            });
            const data = response.data;
            // Assume the results are returned in data.content
            setResults(data.content);
        } catch (error) {
            console.error("Error during search", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={4} boxShadow={"md"} w="full">
            {/* Search Controls */}
            <Flex mb={4} gap={4} alignItems="center" direction="column">
                <Flex direction="row" gap={4} alignItems="center" w="full">
                    <FormControl>
                        <FormLabel>Buscar</FormLabel>
                        <Input
                            value={searchString}
                            onChange={(e) => setSearchString(e.target.value)}
                            placeholder="Ingrese término de búsqueda..."
                        />
                    </FormControl>
                    <Button colorScheme="teal" onClick={handleSearch}>
                        Buscar
                    </Button>
                </Flex>

                <Flex direction="row" gap={4} alignItems="center" w="full">
                    <FormControl>
                        <FormLabel>Tipo Búsqueda</FormLabel>
                        <Select
                            value={tipoBusqueda}
                            onChange={(e) => setTipoBusqueda(e.target.value)}
                        >
                            <option value="Nombre">Nombre</option>
                            <option value="ID">ID</option>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Clasificación</FormLabel>
                        <Select
                            value={clasificacion}
                            onChange={(e) => setClasificacion(e.target.value)}
                        >
                            <option value={TIPOS_PRODUCTOS.materiaPrima}>Materia Prima</option>
                            <option value={TIPOS_PRODUCTOS.semiTerminado}>Semiterminado</option>
                        </Select>
                    </FormControl>
                </Flex>
            </Flex>

            {/* Results */}
            {loading ? (
                <Flex justifyContent="center" alignItems="center">
                    <Spinner />
                </Flex>
            ) : (
                <Flex wrap="wrap" gap={4} direction="column" alignItems="center">
                    {results.map((producto) => (
                        <Box
                            key={producto.productoId}
                            borderWidth="1px"
                            borderRadius="md"
                            p={4}
                            w="full"
                        >
                            <Text fontWeight="bold">ID: {producto.productoId}</Text>
                            <Flex direction="row" gap={10}>
                                <Text>Nombre: {producto.nombre}</Text>
                                <Text>Costo: {producto.costo}</Text>
                            </Flex>
                            <Flex direction="row" gap={10}>
                                <Text>Tipo Unidades: {producto.tipoUnidades}</Text>
                                <Text>Cantidad Unidad: {producto.cantidadUnidad}</Text>
                            </Flex>
                            <Button
                                mt={2}
                                colorScheme="green"
                                onClick={() => onAddInsumo(producto)}
                            >
                                Agregar
                            </Button>
                        </Box>
                    ))}
                </Flex>
            )}
        </Box>
    );
};

export default BandejaBusqueda;
