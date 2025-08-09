import {useState, useEffect} from 'react';
import axios from 'axios';
import EndPointsURL from '../../../api/EndPointsURL.tsx';
import {
    Flex,
    Grid,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useToast,
    Spinner,
    Alert,
    AlertIcon,
    Text
} from '@chakra-ui/react';

import {Familia} from '../types.tsx';

export function FamiliasTab() {
    const [familias, setFamilias] = useState<Familia[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        familiaId: '',
        familiaNombre: '',
        familiaDescripcion: ''
    });

    const [submitting, setSubmitting] = useState<boolean>(false);
    const toast = useToast();
    const endPoints = new EndPointsURL();

    const fetchFamilias = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(endPoints.get_familias);
            setFamilias(response.data);
        } catch (error) {
            console.error('Error fetching familias:', error);
            setError('Error al cargar las familias. Por favor, intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFamilias();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            const newFamilia = {
                familiaId: Number(formData.familiaId),
                familiaNombre: formData.familiaNombre,
                familiaDescripcion: formData.familiaDescripcion
            };

            await axios.post(endPoints.save_familia, newFamilia);

            toast({
                title: 'Familia creada',
                description: 'La familia ha sido creada exitosamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            handleClear();
            fetchFamilias(); // Recargar la lista después de crear
        } catch (error) {
            console.error('Error creating familia:', error);

            // Manejo mejorado de excepciones
            let errorMessage = 'No se pudo crear la familia. Por favor, intente nuevamente.';

            // Extraer el mensaje de error específico del backend
            if (axios.isAxiosError(error) && error.response) {
                // Si el backend devuelve un mensaje de error en la respuesta
                if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data && typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                }
            }

            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleClear = () => {
        setFormData({
            familiaId: '',
            familiaNombre: '',
            familiaDescripcion: ''
        });
    };

    const isFormValid = formData.familiaNombre.trim() !== '' && formData.familiaDescripcion.trim() !== '';

    return (
        <Grid templateColumns="1fr 1fr" gap={6} p={4}>
            <Box p={6} borderWidth="1px" borderRadius="lg">
                <VStack spacing={4} align="stretch">
                    <Heading size="md" mb={4}>Nueva Familia</Heading>

                    <FormControl isRequired>
                        <FormLabel>Familia ID</FormLabel>
                        <Input
                            name="familiaId"
                            value={formData.familiaId}
                            onChange={handleInputChange}
                            placeholder="Id de la familia"
                            isDisabled={submitting}
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Nombre</FormLabel>
                        <Input
                            name="familiaNombre"
                            value={formData.familiaNombre}
                            onChange={handleInputChange}
                            placeholder="Nombre de la familia"
                            isDisabled={submitting}
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Descripción</FormLabel>
                        <Input
                            name="familiaDescripcion"
                            value={formData.familiaDescripcion}
                            onChange={handleInputChange}
                            placeholder="Descripción de la familia"
                            isDisabled={submitting}
                        />
                    </FormControl>
                    <Flex justify="space-between" mt={4}>
                        <Button
                            colorScheme="blue"
                            onClick={handleSubmit}
                            isDisabled={!isFormValid || submitting}
                            isLoading={submitting}
                            loadingText="Guardando..."
                        >
                            Guardar
                        </Button>
                        <Button onClick={handleClear} isDisabled={submitting}>Limpiar</Button>
                    </Flex>
                </VStack>
            </Box>
            <Box p={6} borderWidth="1px" borderRadius="lg">
                <Heading size="md" mb={4}>Familias Existentes</Heading>

                {loading && <Spinner size="md" />}

                {error && (
                    <Alert status="error" mb={4}>
                        <AlertIcon />
                        <Text>{error}</Text>
                    </Alert>
                )}

                {!loading && !error && familias.length === 0 && (
                    <Alert status="info" mb={4}>
                        <AlertIcon />
                        <Text>No hay familias registradas. Cree una nueva familia utilizando el formulario.</Text>
                    </Alert>
                )}

                {!loading && !error && familias.length > 0 && (
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th>Nombre</Th>
                                <Th>Descripción</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {familias.map((familia) => (
                                <Tr key={familia.familiaId}>
                                    <Td>{familia.familiaId}</Td>
                                    <Td>{familia.familiaNombre}</Td>
                                    <Td>{familia.familiaDescripcion}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}
            </Box>
        </Grid>
    );
}
