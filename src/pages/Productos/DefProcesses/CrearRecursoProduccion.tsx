import {useState} from 'react';
import {Box, Button, FormControl, FormLabel, Heading, Input, VStack, useToast} from '@chakra-ui/react';
import axios from 'axios';

import EndPointsURL from '../../../api/EndPointsURL.tsx';
import {input_style} from '../../../styles/styles_general.tsx';
import {RecursoProduccion} from '../types.tsx';
import RPAFmanager from './RPAFmanager.tsx';
import {ActivoFijo} from '../../ActivosFijos/types.tsx';

function CrearRecursoProduccion() {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [activos, setActivos] = useState<ActivoFijo[]>([]);

    const toast = useToast();
    const endPoints = new EndPointsURL();

    const clearFields = () => {
        setNombre('');
        setDescripcion('');
        setActivos([]);
    };

    const handleSubmit = async () => {
        const recurso: RecursoProduccion = {
            nombre,
            descripcion,
        };
        try {
            const resp = await axios.post(endPoints.save_recurso_produccion, recurso);
            const saved: RecursoProduccion = resp.data;
            for(const af of activos){
                try{
                    const getUrl = endPoints.get_activo_fijo.replace('{id}', af.id);
                    const updUrl = endPoints.update_activo_fijo.replace('{id}', af.id);
                    const resAf = await axios.get(getUrl);
                    const fullAf = resAf.data;
                    fullAf.tipoRecurso = {id: saved.id};
                    await axios.put(updUrl, fullAf);
                }catch(err){
                    // ignore individual errors
                }
            }
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
                <FormControl isRequired>
                    <FormLabel>Descripción</FormLabel>
                    <Input value={descripcion} onChange={(e)=>setDescripcion(e.target.value)} sx={input_style} />
                </FormControl>
                <RPAFmanager activos={activos} onChange={setActivos} />
                <Button colorScheme="teal" onClick={handleSubmit}>Guardar</Button>
                <Button colorScheme="orange" onClick={clearFields}>Limpiar</Button>
            </VStack>
        </Box>
    );
}

export default CrearRecursoProduccion;

