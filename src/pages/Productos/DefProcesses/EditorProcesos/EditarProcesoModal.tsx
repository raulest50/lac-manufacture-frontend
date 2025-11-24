import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  Stack,
  useToast,
  Flex,
  Heading,
  Divider,
  Box
} from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from '../../../../api/EndPointsURL.tsx';
import { ProcesoProduccionEntity, TimeModelType, RecursoProduccion } from '../../types.tsx';

interface EditarProcesoModalProps {
  isOpen: boolean;
  onClose: () => void;
  proceso: ProcesoProduccionEntity | null;
  onSave: (procesoActualizado: ProcesoProduccionEntity) => void;
}

export function EditarProcesoModal({ isOpen, onClose, proceso, onSave }: EditarProcesoModalProps) {
  const [procesoEditado, setProcesoEditado] = useState<ProcesoProduccionEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const endPoints = new EndPointsURL();

  // Inicializar el estado cuando se abre el modal con un proceso
  useEffect(() => {
    if (proceso) {
      setProcesoEditado({ ...proceso });
    }
  }, [proceso]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!procesoEditado) return;

    const { name, value } = e.target;
    setProcesoEditado({
      ...procesoEditado,
      [name]: value
    });
  };

  const handleNumberChange = (name: string, value: number) => {
    if (!procesoEditado) return;

    setProcesoEditado({
      ...procesoEditado,
      [name]: value
    });
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!procesoEditado) return;

    const model = e.target.value as TimeModelType;
    setProcesoEditado({
      ...procesoEditado,
      model
    });
  };

  const handleSubmit = async () => {
    if (!procesoEditado || !procesoEditado.procesoId) return;

    setLoading(true);
    try {
      const url = endPoints.update_proceso_produccion.replace('{id}', procesoEditado.procesoId.toString());
      const response = await axios.put(url, procesoEditado);

      toast({
        title: 'Proceso actualizado',
        description: 'El proceso se ha actualizado correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onSave(response.data);
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el proceso',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!procesoEditado) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Proceso de Producción</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={6}>
            {/* Sección: Información General */}
            <Box>
              <Heading size="sm" mb={3}>Información General</Heading>
              <Divider mb={4} />
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nombre</FormLabel>
                  <Input 
                    name="nombre" 
                    value={procesoEditado.nombre} 
                    onChange={handleChange} 
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Nivel de Acceso</FormLabel>
                  <NumberInput 
                    min={0} 
                    max={10}
                    value={procesoEditado.nivelAcceso || 0}
                    onChange={(_, value) => handleNumberChange('nivelAcceso', value)}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Tiempo de Preparación (Setup Time) en segundos</FormLabel>
                  <NumberInput 
                    min={0}
                    value={procesoEditado.setUpTime}
                    onChange={(_, value) => handleNumberChange('setUpTime', value)}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </Stack>
            </Box>

            {/* Sección: Modelo de Tiempo */}
            <Box>
              <Heading size="sm" mb={3}>Modelo de Tiempo</Heading>
              <Divider mb={4} />
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Modelo de Tiempo</FormLabel>
                  <Select 
                    name="model" 
                    value={procesoEditado.model} 
                    onChange={handleModelChange}
                  >
                    <option value={TimeModelType.CONSTANT}>Constante</option>
                    <option value={TimeModelType.THROUGHPUT_RATE}>Tasa</option>
                    <option value={TimeModelType.PER_UNIT}>Por Unidad</option>
                    <option value={TimeModelType.PER_BATCH}>Por Lote</option>
                  </Select>
                </FormControl>

                {procesoEditado.model === TimeModelType.CONSTANT && (
                  <FormControl isRequired>
                    <FormLabel>Tiempo Constante (segundos)</FormLabel>
                    <NumberInput 
                      min={0}
                      value={procesoEditado.constantSeconds || 0}
                      onChange={(_, value) => handleNumberChange('constantSeconds', value)}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                )}

                {procesoEditado.model === TimeModelType.THROUGHPUT_RATE && (
                  <FormControl isRequired>
                    <FormLabel>Tasa de Producción (unidades/segundo)</FormLabel>
                    <NumberInput 
                      min={0}
                      step={0.01}
                      precision={2}
                      value={procesoEditado.throughputUnitsPerSec || 0}
                      onChange={(_, value) => handleNumberChange('throughputUnitsPerSec', value)}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                )}

                {procesoEditado.model === TimeModelType.PER_UNIT && (
                  <FormControl isRequired>
                    <FormLabel>Segundos por Unidad</FormLabel>
                    <NumberInput 
                      min={0}
                      value={procesoEditado.secondsPerUnit || 0}
                      onChange={(_, value) => handleNumberChange('secondsPerUnit', value)}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                )}

                {procesoEditado.model === TimeModelType.PER_BATCH && (
                  <>
                    <FormControl isRequired>
                      <FormLabel>Segundos por Lote</FormLabel>
                      <NumberInput 
                        min={0}
                        value={procesoEditado.secondsPerBatch || 0}
                        onChange={(_, value) => handleNumberChange('secondsPerBatch', value)}
                      >
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Tamaño del Lote</FormLabel>
                      <NumberInput 
                        min={1}
                        value={procesoEditado.batchSize || 1}
                        onChange={(_, value) => handleNumberChange('batchSize', value)}
                      >
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>
                  </>
                )}
              </Stack>
            </Box>

            {/* Sección: Recursos */}
            <Box>
              <Heading size="sm" mb={3}>Recursos</Heading>
              <Divider mb={4} />
              <Flex direction="column" gap={4}>
                {/* Aquí iría la gestión de recursos requeridos */}
                <Button colorScheme="teal" size="sm">
                  Agregar Recurso
                </Button>
              </Flex>
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSubmit}
            isLoading={loading}
          >
            Guardar Cambios
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
