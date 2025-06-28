import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  IconButton,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  HStack,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react';
import { AddIcon, EditIcon, LockIcon, UnlockIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { PeriodoContable, EstadoPeriodo } from '../types';
import EndPointsURL from '../../../api/EndPointsURL';

const GestionPeriodos: React.FC = () => {
  const [periodos, setPeriodos] = useState<PeriodoContable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriodo, setSelectedPeriodo] = useState<PeriodoContable | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertAction, setAlertAction] = useState<'open' | 'close'>('close');
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const endpoints = new EndPointsURL();

  const [formData, setFormData] = useState<PeriodoContable>({
    fechaInicio: '',
    fechaFin: '',
    nombre: '',
    estado: EstadoPeriodo.ABIERTO
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPeriodos();
  }, []);

  useEffect(() => {
    if (selectedPeriodo) {
      setFormData(selectedPeriodo);
    } else {
      // Default values for new period
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      setFormData({
        fechaInicio: firstDay.toISOString().split('T')[0],
        fechaFin: lastDay.toISOString().split('T')[0],
        nombre: `${getMonthName(today.getMonth())} ${today.getFullYear()}`,
        estado: EstadoPeriodo.ABIERTO
      });
    }
  }, [selectedPeriodo]);

  const getMonthName = (monthIndex: number): string => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthIndex];
  };

  const fetchPeriodos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(endpoints.get_periodos);
      // Asegúrate de que response.data sea un array
      const periodosData = Array.isArray(response.data) ? response.data : [];
      setPeriodos(periodosData);
    } catch (error) {
      console.error('Error fetching periodos:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los períodos contables',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // Mock data for development
      const mockPeriodos: PeriodoContable[] = [
        { id: 1, nombre: 'Enero 2023', fechaInicio: '2023-01-01', fechaFin: '2023-01-31', estado: EstadoPeriodo.CERRADO },
        { id: 2, nombre: 'Febrero 2023', fechaInicio: '2023-02-01', fechaFin: '2023-02-28', estado: EstadoPeriodo.CERRADO },
        { id: 3, nombre: 'Marzo 2023', fechaInicio: '2023-03-01', fechaFin: '2023-03-31', estado: EstadoPeriodo.ABIERTO },
      ];
      setPeriodos(mockPeriodos);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPeriodo = () => {
    setSelectedPeriodo(null);
    setIsEditing(true);
    onOpen();
  };

  const handleEditPeriodo = (periodo: PeriodoContable) => {
    setSelectedPeriodo(periodo);
    setIsEditing(true);
    onOpen();
  };

  const handleViewPeriodo = (periodo: PeriodoContable) => {
    setSelectedPeriodo(periodo);
    setIsEditing(false);
    onOpen();
  };

  const handleOpenClosePeriodo = (periodo: PeriodoContable, action: 'open' | 'close') => {
    setSelectedPeriodo(periodo);
    setAlertAction(action);
    setIsAlertOpen(true);
  };

  const confirmOpenClosePeriodo = async () => {
    if (!selectedPeriodo) return;

    try {
      const newEstado = alertAction === 'open' ? EstadoPeriodo.ABIERTO : EstadoPeriodo.CERRADO;

      const updateEstadoUrl = endpoints.update_periodo_estado.replace('{id}', selectedPeriodo.id!.toString());
      await axios.put(updateEstadoUrl, {
        estado: newEstado
      });

      // Update local state
      if (Array.isArray(periodos)) {
        setPeriodos(periodos.map(p => 
          p.id === selectedPeriodo.id ? { ...p, estado: newEstado } : p
        ));
      }

      toast({
        title: 'Éxito',
        description: `El período ha sido ${alertAction === 'open' ? 'abierto' : 'cerrado'} correctamente`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating periodo estado:', error);
      toast({
        title: 'Error',
        description: `No se pudo ${alertAction === 'open' ? 'abrir' : 'cerrar'} el período`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsAlertOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es requerida';
    }

    if (!formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es requerida';
    } else if (formData.fechaInicio && new Date(formData.fechaFin) < new Date(formData.fechaInicio)) {
      newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (selectedPeriodo?.id) {
        // Update existing period
        const updateUrl = endpoints.update_periodo.replace('{id}', selectedPeriodo.id.toString());
        await axios.put(updateUrl, formData);
        if (Array.isArray(periodos)) {
          setPeriodos(periodos.map(p => p.id === selectedPeriodo.id ? { ...formData, id: selectedPeriodo.id } : p));
        }
        toast({
          title: 'Período actualizado',
          description: `El período ${formData.nombre} ha sido actualizado correctamente`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create new period
        const response = await axios.post(endpoints.save_periodo, formData);
        setPeriodos([...periodos, response.data]);
        toast({
          title: 'Período creado',
          description: `El período ${formData.nombre} ha sido creado correctamente`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving periodo:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el período contable',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Box w="full">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">Gestión de Períodos Contables</Heading>
        <Button 
          leftIcon={<AddIcon />} 
          colorScheme="blue" 
          onClick={handleAddPeriodo}
        >
          Nuevo Período
        </Button>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Nombre</Th>
              <Th>Fecha Inicio</Th>
              <Th>Fecha Fin</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={6} textAlign="center">Cargando...</Td>
              </Tr>
            ) : !Array.isArray(periodos) ? (
              <Tr>
                <Td colSpan={6} textAlign="center">Error al cargar los períodos</Td>
              </Tr>
            ) : periodos.length === 0 ? (
              <Tr>
                <Td colSpan={6} textAlign="center">No se encontraron períodos</Td>
              </Tr>
            ) : (
              periodos.map((periodo) => (
                <Tr key={periodo.id}>
                  <Td>{periodo.id}</Td>
                  <Td>{periodo.nombre}</Td>
                  <Td>{formatDate(periodo.fechaInicio)}</Td>
                  <Td>{formatDate(periodo.fechaFin)}</Td>
                  <Td>
                    <Badge colorScheme={periodo.estado === EstadoPeriodo.ABIERTO ? 'green' : 'red'}>
                      {periodo.estado === EstadoPeriodo.ABIERTO ? 'Abierto' : 'Cerrado'}
                    </Badge>
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton
                        aria-label="Ver período"
                        icon={<EditIcon />}
                        size="sm"
                        onClick={() => handleViewPeriodo(periodo)}
                      />
                      {periodo.estado === EstadoPeriodo.ABIERTO ? (
                        <IconButton
                          aria-label="Cerrar período"
                          icon={<LockIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleOpenClosePeriodo(periodo, 'close')}
                        />
                      ) : (
                        <IconButton
                          aria-label="Abrir período"
                          icon={<UnlockIcon />}
                          size="sm"
                          colorScheme="green"
                          onClick={() => handleOpenClosePeriodo(periodo, 'open')}
                        />
                      )}
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Modal for viewing/editing period */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditing 
              ? selectedPeriodo?.id 
                ? `Editar Período: ${selectedPeriodo.nombre}` 
                : 'Nuevo Período Contable'
              : `Detalle de Período: ${selectedPeriodo?.nombre}`
            }
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isEditing ? (
              <VStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.nombre}>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Enero 2023"
                  />
                  <FormErrorMessage>{errors.nombre}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.fechaInicio}>
                  <FormLabel>Fecha de Inicio</FormLabel>
                  <Input
                    type="date"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.fechaInicio}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.fechaFin}>
                  <FormLabel>Fecha de Fin</FormLabel>
                  <Input
                    type="date"
                    name="fechaFin"
                    value={formData.fechaFin}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.fechaFin}</FormErrorMessage>
                </FormControl>
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="bold">ID:</Text>
                  <Text>{selectedPeriodo?.id}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text fontWeight="bold">Nombre:</Text>
                  <Text>{selectedPeriodo?.nombre}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text fontWeight="bold">Fecha de Inicio:</Text>
                  <Text>{selectedPeriodo ? formatDate(selectedPeriodo.fechaInicio) : ''}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text fontWeight="bold">Fecha de Fin:</Text>
                  <Text>{selectedPeriodo ? formatDate(selectedPeriodo.fechaFin) : ''}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text fontWeight="bold">Estado:</Text>
                  <Badge colorScheme={selectedPeriodo?.estado === EstadoPeriodo.ABIERTO ? 'green' : 'red'}>
                    {selectedPeriodo?.estado === EstadoPeriodo.ABIERTO ? 'Abierto' : 'Cerrado'}
                  </Badge>
                </HStack>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            {isEditing ? (
              <>
                <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                  Guardar
                </Button>
                <Button variant="ghost" onClick={onClose}>Cancelar</Button>
              </>
            ) : (
              <>
                <Button colorScheme="blue" mr={3} onClick={() => {
                  onClose();
                  handleEditPeriodo(selectedPeriodo!);
                }}>
                  Editar
                </Button>
                <Button variant="ghost" onClick={onClose}>Cerrar</Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Alert Dialog for confirming open/close */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {alertAction === 'close' ? 'Cerrar Período' : 'Abrir Período'}
            </AlertDialogHeader>

            <AlertDialogBody>
              {alertAction === 'close' 
                ? '¿Está seguro de cerrar este período? Una vez cerrado, no se podrán crear o modificar asientos contables en este período a menos que se vuelva a abrir.'
                : '¿Está seguro de abrir este período? Esto permitirá crear y modificar asientos contables en este período.'}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancelar
              </Button>
              <Button 
                colorScheme={alertAction === 'close' ? 'red' : 'green'} 
                onClick={confirmOpenClosePeriodo} 
                ml={3}
              >
                {alertAction === 'close' ? 'Cerrar' : 'Abrir'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default GestionPeriodos;
