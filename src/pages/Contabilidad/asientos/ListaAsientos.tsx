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
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  useToast,
  Select,
  HStack,
  Text
} from '@chakra-ui/react';
import { SearchIcon, AddIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { AsientoContable, EstadoAsiento, PeriodoContable, EstadoPeriodo } from '../types';
import FormularioAsiento from './FormularioAsiento';

const ListaAsientos: React.FC = () => {
  const [asientos, setAsientos] = useState<AsientoContable[]>([]);
  const [filteredAsientos, setFilteredAsientos] = useState<AsientoContable[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [periodos, setPeriodos] = useState<PeriodoContable[]>([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAsiento, setSelectedAsiento] = useState<AsientoContable | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchPeriodos();
    fetchAsientos();
  }, []);

  useEffect(() => {
    filterAsientos();
  }, [searchTerm, selectedPeriodo, asientos]);

  const fetchPeriodos = async () => {
    try {
      const response = await axios.get('/api/contabilidad/periodos');
      setPeriodos(response.data);
    } catch (error) {
      console.error('Error fetching periodos:', error);
      // Mock data for development
      const mockPeriodos: PeriodoContable[] = [
        { id: 1, nombre: 'Enero 2023', fechaInicio: '2023-01-01', fechaFin: '2023-01-31', estado: EstadoPeriodo.CERRADO },
        { id: 2, nombre: 'Febrero 2023', fechaInicio: '2023-02-01', fechaFin: '2023-02-28', estado: EstadoPeriodo.CERRADO },
        { id: 3, nombre: 'Marzo 2023', fechaInicio: '2023-03-01', fechaFin: '2023-03-31', estado: EstadoPeriodo.ABIERTO },
      ];
      setPeriodos(mockPeriodos);
    }
  };

  const fetchAsientos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/contabilidad/asientos');
      setAsientos(response.data);
      setFilteredAsientos(response.data);
    } catch (error) {
      console.error('Error fetching asientos:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los asientos contables',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // Mock data for development
      const mockPeriodo: PeriodoContable = { 
        id: 3, 
        nombre: 'Marzo 2023', 
        fechaInicio: '2023-03-01', 
        fechaFin: '2023-03-31', 
        estado: EstadoPeriodo.ABIERTO 
      };
      
      const mockAsientos: AsientoContable[] = [
        { 
          id: 1, 
          fecha: '2023-03-05T10:30:00', 
          descripcion: 'Compra de materias primas', 
          modulo: 'COMPRAS', 
          documentoOrigen: 'OC-2023-001', 
          estado: EstadoAsiento.PUBLICADO, 
          periodoContable: mockPeriodo,
          lineas: []
        },
        { 
          id: 2, 
          fecha: '2023-03-10T14:15:00', 
          descripcion: 'Registro de producción', 
          modulo: 'PRODUCCION', 
          documentoOrigen: 'OP-2023-005', 
          estado: EstadoAsiento.PUBLICADO, 
          periodoContable: mockPeriodo,
          lineas: []
        },
        { 
          id: 3, 
          fecha: '2023-03-15T09:00:00', 
          descripcion: 'Ajuste de inventario', 
          modulo: 'INVENTARIO', 
          documentoOrigen: 'AJ-2023-002', 
          estado: EstadoAsiento.BORRADOR, 
          periodoContable: mockPeriodo,
          lineas: []
        },
      ];
      setAsientos(mockAsientos);
      setFilteredAsientos(mockAsientos);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAsientos = () => {
    let filtered = [...asientos];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(asiento => 
        asiento.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) || 
        asiento.documentoOrigen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asiento.id?.toString().includes(searchTerm)
      );
    }
    
    // Filter by period
    if (selectedPeriodo) {
      filtered = filtered.filter(asiento => 
        asiento.periodoContable.id?.toString() === selectedPeriodo
      );
    }
    
    setFilteredAsientos(filtered);
  };

  const handleViewAsiento = (asiento: AsientoContable) => {
    setSelectedAsiento(asiento);
    setIsEditing(false);
    onOpen();
  };

  const handleEditAsiento = (asiento: AsientoContable) => {
    setSelectedAsiento(asiento);
    setIsEditing(true);
    onOpen();
  };

  const handleAddAsiento = () => {
    // Create a new asiento with default values
    const defaultPeriodo = periodos.find(p => p.estado === EstadoPeriodo.ABIERTO) || periodos[0];
    
    const newAsiento: AsientoContable = {
      fecha: new Date().toISOString(),
      descripcion: '',
      modulo: '',
      documentoOrigen: '',
      estado: EstadoAsiento.BORRADOR,
      periodoContable: defaultPeriodo,
      lineas: []
    };
    
    setSelectedAsiento(newAsiento);
    setIsEditing(true);
    onOpen();
  };

  const handleSaveAsiento = async (asiento: AsientoContable) => {
    try {
      if (asiento.id) {
        // Update existing journal entry
        await axios.put(`/api/contabilidad/asientos/${asiento.id}`, asiento);
        setAsientos(asientos.map(a => a.id === asiento.id ? asiento : a));
        toast({
          title: 'Asiento actualizado',
          description: `El asiento #${asiento.id} ha sido actualizado correctamente`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create new journal entry
        const response = await axios.post('/api/contabilidad/asientos', asiento);
        setAsientos([...asientos, response.data]);
        toast({
          title: 'Asiento creado',
          description: `El asiento #${response.data.id} ha sido creado correctamente`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving asiento:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el asiento contable',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getEstadoBadgeColor = (estado: EstadoAsiento) => {
    switch (estado) {
      case EstadoAsiento.BORRADOR:
        return 'yellow';
      case EstadoAsiento.PUBLICADO:
        return 'green';
      case EstadoAsiento.REVERSADO:
        return 'red';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box w="full">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">Asientos Contables</Heading>
        <Button 
          leftIcon={<AddIcon />} 
          colorScheme="blue" 
          onClick={handleAddAsiento}
        >
          Nuevo Asiento
        </Button>
      </Flex>

      <HStack spacing={4} mb={4}>
        <InputGroup flex="1">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input 
            placeholder="Buscar por descripción o documento" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        
        <Select 
          placeholder="Todos los períodos" 
          value={selectedPeriodo}
          onChange={(e) => setSelectedPeriodo(e.target.value)}
          w="300px"
        >
          {periodos.map(periodo => (
            <option key={periodo.id} value={periodo.id?.toString()}>
              {periodo.nombre} ({periodo.estado === EstadoPeriodo.ABIERTO ? 'Abierto' : 'Cerrado'})
            </option>
          ))}
        </Select>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Fecha</Th>
              <Th>Descripción</Th>
              <Th>Módulo</Th>
              <Th>Documento</Th>
              <Th>Estado</Th>
              <Th>Período</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={8} textAlign="center">Cargando...</Td>
              </Tr>
            ) : filteredAsientos.length === 0 ? (
              <Tr>
                <Td colSpan={8} textAlign="center">No se encontraron asientos</Td>
              </Tr>
            ) : (
              filteredAsientos.map((asiento) => (
                <Tr key={asiento.id}>
                  <Td>{asiento.id}</Td>
                  <Td>{formatDate(asiento.fecha)}</Td>
                  <Td>{asiento.descripcion}</Td>
                  <Td>{asiento.modulo}</Td>
                  <Td>{asiento.documentoOrigen}</Td>
                  <Td>
                    <Badge colorScheme={getEstadoBadgeColor(asiento.estado)}>
                      {asiento.estado}
                    </Badge>
                  </Td>
                  <Td>{asiento.periodoContable.nombre}</Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton
                        aria-label="Ver asiento"
                        icon={<ViewIcon />}
                        size="sm"
                        onClick={() => handleViewAsiento(asiento)}
                      />
                      <IconButton
                        aria-label="Editar asiento"
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="blue"
                        isDisabled={asiento.estado !== EstadoAsiento.BORRADOR}
                        onClick={() => handleEditAsiento(asiento)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Modal for viewing/editing journal entry */}
      {isOpen && (
        <FormularioAsiento
          isOpen={isOpen}
          onClose={onClose}
          asiento={selectedAsiento}
          isEditing={isEditing}
          onSave={handleSaveAsiento}
          periodos={periodos}
        />
      )}
    </Box>
  );
};

export default ListaAsientos;