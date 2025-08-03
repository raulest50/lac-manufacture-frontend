import {useState} from 'react';
import {Box, Button, FormControl, FormLabel, Heading, Input, VStack, useToast} from '@chakra-ui/react';
import axios from 'axios';

import EndPointsURL from '../../api/EndPointsURL';
import {input_style} from '../../styles/styles_general';
import {RecursoProduccion} from './types';

function CrearRecursoProduccion() {
    const [nombre, setNombre] = useState('');
    const [capacidadTotal, setCapacidadTotal] = useState('');
    const [cantidadDisponible, setCantidadDisponible] = useState('');
    const [capacidadPorHora, setCapacidadPorHora] = useState('');
    const [turnos, setTurnos] = useState('');
    const [horasPorTurno, setHorasPorTurno] = useState('');

    const toast = useToast();
    const endPoints = new EndPointsURL();

    const clearFields = () => {
        setNombre('');
        setCapacidadTotal('');
        setCantidadDisponible('');
        setCapacidadPorHora('');
        setTurnos('');
        setHorasPorTurno('');
    };

    const handleSubmit = async () => {
        const recurso: RecursoProduccion = {
            nombre,
            capacidadTotal: capacidadTotal ? parseFloat(capacidadTotal) : undefined,
            cantidadDisponible: cantidadDisponible ? parseInt(cantidadDisponible) : undefined,
            capacidadPorHora: capacidadPorHora ? parseFloat(capacidadPorHora) : undefined,
            turnos: turnos ? parseInt(turnos) : undefined,
            horasPorTurno: horasPorTurno ? parseFloat(horasPorTurno) : undefined,
        };
        try {
            await axios.post(endPoints.save_recurso_produccion, recurso);
            toast({
                title: 'Recurso creado',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            clearFields();
        } catch (e) {
            toast({
                title: 'Error al crear recurso',
                description: (e as Error).message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={4}>
            <Heading size="md" mb={4}>Crear Recurso de Producción</Heading>
            <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                    <FormLabel>Nombre</FormLabel>
                    <Input value={nombre} onChange={(e) => setNombre(e.target.value)} sx={input_style} />
                </FormControl>
                <FormControl>
                    <FormLabel>Capacidad Total</FormLabel>
                    <Input type="number" value={capacidadTotal} onChange={(e) => setCapacidadTotal(e.target.value)} sx={input_style} />
                </FormControl>
                <FormControl>
                    <FormLabel>Cantidad Disponible</FormLabel>
                    <Input type="number" value={cantidadDisponible} onChange={(e) => setCantidadDisponible(e.target.value)} sx={input_style} />
                </FormControl>
                <FormControl>
                    <FormLabel>Capacidad por Hora</FormLabel>
                    <Input type="number" value={capacidadPorHora} onChange={(e) => setCapacidadPorHora(e.target.value)} sx={input_style} />
                </FormControl>
                <FormControl>
                    <FormLabel>Turnos</FormLabel>
                    <Input type="number" value={turnos} onChange={(e) => setTurnos(e.target.value)} sx={input_style} />
                </FormControl>
                <FormControl>
                    <FormLabel>Horas por Turno</FormLabel>
                    <Input type="number" value={horasPorTurno} onChange={(e) => setHorasPorTurno(e.target.value)} sx={input_style} />
                </FormControl>
                <Button colorScheme="teal" onClick={handleSubmit}>Guardar</Button>
                <Button colorScheme="orange" onClick={clearFields}>Limpiar</Button>
            </VStack>
        </Box>
    );
}

export default CrearRecursoProduccion;

