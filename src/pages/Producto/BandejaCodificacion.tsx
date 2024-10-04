

import {useState} from 'react'
import axios from 'axios';

import {
    useToast,
    Flex, Heading,
    HStack, IconButton, Stack,
    Text, Input, Divider, FormControl, FormLabel, Select,
    Textarea, Button
} from "@chakra-ui/react";

import { RxUpdate } from "react-icons/rx";

import MateriaPrimaCard from "../../components/MateriaPrimaCard.tsx";
import MyPagination from "../../components/MyPagination.tsx";

import {MateriaPrima} from "../../models/Interfaces.tsx";
import {UNIDADES} from "../../models/constants.tsx";

import MyLoading from "../../components/MyLoading.tsx";
import BackendURL from "../../api/BackendURL.tsx";


function BandejaCodificacion(){

    const toast = useToast();
    const rutas = new BackendURL();

    interface MateriaPrimaResponse {
        content: MateriaPrima[];
        totalPages: number;
        number: number;
        size: number;
        totalElements: number;
    }

    const [materiasPrimas, setMateriasPrimas] = useState<MateriaPrima[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedMateriaPrima, setSelectedMateriaPrima] = useState<MateriaPrima | null>(null);

    const [inputTipoUnidades, setInputTipoUnidades] = useState('');
    const [inputCantPorUnidad, setInputCantPorUnidad] = useState('');
    const [inputObservaciones, setInputObservaciones] = useState('');

    const clearFields = () => {
        setInputCantPorUnidad('');
        setInputTipoUnidades('');
        setInputObservaciones('');
    }

    const onClickMateriaPrimaCard = (mp: MateriaPrima) => {
        setSelectedMateriaPrima(mp);
    }

    // Función para hacer fetch de las materias primas pendientes
    const fetchMateriasPrimas = async (pageNumber: number = 0) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get<MateriaPrimaResponse>(
                rutas.ep_mp_pendientes,
                {
                    params: {
                        page: pageNumber,
                        size: 5,
                    },
                }
            );

            setMateriasPrimas(response.data.content);
            setTotalPages(response.data.totalPages);
            setPage(pageNumber);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(`Error al obtener los datos: ${err.response?.data?.message || err.message}`);
            } else {
                setError('Error inesperado');
            }

            // Mostrar notificación de error
            toast({
                title: 'Error',
                description: error,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // Función para cambiar de página
    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            fetchMateriasPrimas(newPage);
        }
    };

    const validateSave = () : boolean => {
        // Validate selected MateriaPrima
        if (!selectedMateriaPrima) {
            toast({
                title: 'Error de validación',
                description: 'Debe seleccionar una Materia Prima.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return false;
        }
        const cantPorUnidadNumber = Number(inputCantPorUnidad);
        if (!inputCantPorUnidad) {
            toast({
                title: 'Error de validación',
                description: 'La cantidad por unidad es obligatoria.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return false;
        } else if (isNaN(cantPorUnidadNumber) || cantPorUnidadNumber < 1) {
            toast({
                title: 'Error de validación',
                description: 'La cantidad por unidad debe ser un número mayor o igual a 1.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return false;
        }

        // All validations passed
        return true;
    };

    const handleGuardarClick = () => {
        if (validateSave()) {
            saveMateriaPrimaChanges();
        }
    };

    const saveMateriaPrimaChanges = async () => {
        // Update the selectedMateriaPrima with new values
        const updatedMateriaPrima: MateriaPrima = {
            ...selectedMateriaPrima!,
            tipoUnidades: inputTipoUnidades || null,
            contenidoPorUnidad: Number(inputCantPorUnidad),
            observaciones: inputObservaciones || null,
        };

        // Update the state
        setSelectedMateriaPrima(updatedMateriaPrima);

        try {
            const response = await axios.post(rutas.ep_update_mp, updatedMateriaPrima);
            //console.log('Product updated successfully:', response.data);
            handlePageChange(page);
            toast({
                title: 'Materia Actualizada',
                description: `"Actualizacion exitosa  id:${response.data}, time:${response.data.fechaCreacion}"`,
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        } catch (error) {
            console.error('Error saving product:', error);
            toast({
                title: 'Ha ocurrido un error',
                description: `" ha ocurrido un error"`,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }

    }


    return(
        <Flex direction={'row'}>

            <Flex flex={1} direction="column" p={4}>
                {/* Encabezado con botón de actualizar */}
                <HStack mb={4}>
                    <Heading>Materias Primas Pendientes</Heading>
                    <IconButton
                        aria-label="Actualizar"
                        icon={<RxUpdate />}
                        onClick={() => fetchMateriasPrimas(page)}
                        isDisabled={loading}
                        colorScheme="blue"
                    />
                </HStack>
                <MyLoading loading={loading} error={error} />
                {/* Lista de Materias Primas */}
                <Stack spacing={4}>
                    {materiasPrimas.map((mp) => (
                        <MateriaPrimaCard
                            key={mp.referencia}
                            materiaPrima={mp}
                            isSelected={selectedMateriaPrima?.referencia === mp.referencia}
                            onClick={onClickMateriaPrimaCard}
                        />
                    ))}
                </Stack>
                <MyPagination page={page} handlePageChange={handlePageChange} loading={loading} totalPages={totalPages} />
            </Flex>

            <Flex flex={1} direction={'column'} p={4} >
                <Text>MP Seleccionada : {selectedMateriaPrima?.descripcion} - {selectedMateriaPrima?.referencia} </Text>
                <Divider/>
                <FormControl>
                    <FormLabel>Tipo Unidades</FormLabel>
                    <Select
                        value={inputTipoUnidades}
                        onChange={(e) => setInputTipoUnidades(e.target.value)}
                    >
                        {Object.entries(UNIDADES).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <FormLabel>Contenido por Unidad</FormLabel>
                    <Input
                        value={inputCantPorUnidad}
                        onChange={(e) => setInputCantPorUnidad(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Observaciones</FormLabel>
                    <Textarea
                        value={inputObservaciones}
                        onChange={(e) => setInputObservaciones(e.target.value)}
                    />
                </FormControl>
                <HStack >
                    <Button colorScheme={'blue'} onClick={handleGuardarClick}>Guardar</Button>
                    <Button colorScheme={'orange'} onClick={clearFields}>Borrar Campos</Button>
                </HStack>
            </Flex>
        </Flex>
    );
}

export default BandejaCodificacion