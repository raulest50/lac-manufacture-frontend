import {useEffect, useState} from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  CheckboxGroup,
  Checkbox,
  Stack,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from '../../api/EndPointsURL';
import {input_style} from '../../styles/styles_general';
import {RecursoProduccion, ProcesoProduccionEntity} from './types';

function DefinicionProcesosTab() {
  const [nombre, setNombre] = useState('');
  const [setUpTime, setSetUpTime] = useState<number>(0);
  const [processTime, setProcessTime] = useState<number>(0);
  const [recursos, setRecursos] = useState<RecursoProduccion[]>([]);
  const [recursosSel, setRecursosSel] = useState<string[]>([]);

  const toast = useToast();
  const endPoints = new EndPointsURL();

  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        const dto = {
          tipoBusqueda: 'POR_NOMBRE',
          valorBusqueda: '',
          page: 0,
          size: 100,
        };
        const res = await axios.post(endPoints.search_recurso_produccion, dto);
        setRecursos(res.data.content);
      } catch (e) {
        toast({
          title: 'Error al cargar recursos',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchRecursos();
  }, []);

  const clearFields = () => {
    setNombre('');
    setSetUpTime(0);
    setProcessTime(0);
    setRecursosSel([]);
  };

  const handleSubmit = async () => {
    const proceso: ProcesoProduccionEntity = {
      nombre,
      recursosRequeridos: recursosSel.map((id) => ({id: Number(id)})) as RecursoProduccion[],
      setUpTime,
      processTime,
    };
    try {
      await axios.post(endPoints.save_proceso_produccion, proceso);
      toast({
        title: 'Proceso creado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      clearFields();
    } catch (e) {
      toast({
        title: 'Error al crear proceso',
        description: (e as Error).message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        Crear Proceso de Producción
      </Heading>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Nombre</FormLabel>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} sx={input_style} />
        </FormControl>
        <FormControl>
          <FormLabel>Set-up Time (min)</FormLabel>
          <Input
            type="number"
            value={setUpTime}
            onChange={(e) => setSetUpTime(Number(e.target.value))}
            sx={input_style}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Process Time (min)</FormLabel>
          <Input
            type="number"
            value={processTime}
            onChange={(e) => setProcessTime(Number(e.target.value))}
            sx={input_style}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Recursos Requeridos</FormLabel>
          <CheckboxGroup
            value={recursosSel}
            onChange={(vals) => setRecursosSel(vals as string[])}
          >
            <Stack spacing={2}>
              {recursos.map((r) => (
                <Checkbox key={r.id} value={String(r.id)}>
                  {r.nombre}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </FormControl>
        <Button colorScheme="teal" onClick={handleSubmit}>
          Guardar
        </Button>
        <Button colorScheme="orange" onClick={clearFields}>
          Limpiar
        </Button>
      </VStack>
    </Box>
  );
}

export default DefinicionProcesosTab;

