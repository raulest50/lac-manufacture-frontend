import {
  Box, 
  Button, 
  Flex, 
  Input, 
  Modal, 
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  ModalOverlay, 
  Table, 
  Tbody, 
  Td, 
  Th, 
  Thead, 
  Tr,
  useToast,
  Tooltip,
  Badge
} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import axios from 'axios';
import EndPointsURL from '../../../../../../api/EndPointsURL.tsx';
import {ProcesoProduccionEntity, TimeModelType} from '../../../../types.tsx';
import MyPagination from '../../../../../../components/MyPagination.tsx';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (procesos: ProcesoProduccionEntity[]) => void;
  alreadySelected: ProcesoProduccionEntity[];
}

export function ProcesoProduccionPicker({isOpen, onClose, onConfirm, alreadySelected}: Props) {
  const endPoints = new EndPointsURL();
  const toast = useToast();

  // Helper function to format time model information
  const getTimeModelInfo = (proceso: ProcesoProduccionEntity): { label: string, details: string } => {
    switch (proceso.model) {
      case TimeModelType.CONSTANT:
        return {
          label: 'Constante',
          details: `${proceso.constantSeconds ?? 0} seg`
        };
      case TimeModelType.THROUGHPUT_RATE:
        return {
          label: 'Tasa',
          details: `${proceso.throughputUnitsPerSec ?? 0} u/seg`
        };
      case TimeModelType.PER_UNIT:
        return {
          label: 'Por Unidad',
          details: `${proceso.secondsPerUnit ?? 0} seg/u`
        };
      case TimeModelType.PER_BATCH:
        // Verificar que ambos valores existan antes de usarlos
        if (proceso.secondsPerBatch != null && proceso.batchSize != null) {
          return {
            label: 'Por Lote',
            details: `${proceso.secondsPerBatch} seg/lote(${proceso.batchSize})`
          };
        } else {
          return {
            label: 'Por Lote',
            details: 'Valores incompletos'
          };
        }
      default:
        // For backward compatibility with old data
        return {
          label: 'Tiempo',
          details: `${proceso.processTime ?? 0} seg`
        };
    }
  };

  const [searchText, setSearchText] = useState('');
  const [available, setAvailable] = useState<ProcesoProduccionEntity[]>([]);
  const [selected, setSelected] = useState<ProcesoProduccionEntity[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  const fetchAvailable = async (pageNumber: number) => {
    setLoading(true);
    try {
      // Usamos el endpoint de paginación existente
      const res = await axios.get(endPoints.get_procesos_produccion_pag, {
        params: {page: pageNumber, size: pageSize},
      });

      let list: ProcesoProduccionEntity[] = res.data.content || [];

      // Filtrar por texto de búsqueda si hay alguno (filtrado en el cliente)
      if (searchText) {
        list = list.filter(p => 
          p.nombre.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      // Filtrar los que ya están seleccionados
      const ids = new Set([...alreadySelected, ...selected].map(p => p.procesoId));
      list = list.filter(p => !ids.has(p.procesoId));

      setAvailable(list);
      setTotalPages(res.data.totalPages || 1);
      setPage(pageNumber);
    } catch (e) {
      toast({
        title: 'Error',
        description: 'No se pudieron obtener los procesos.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setAvailable([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (isOpen) {
      fetchAvailable(0);
      setSelected([]);
    }
  }, [isOpen]);

  const handleAdd = (proceso: ProcesoProduccionEntity) => {
    setSelected([...selected, proceso]);
    setAvailable(available.filter(p => p.procesoId !== proceso.procesoId));
  };

  const handleRemove = (proceso: ProcesoProduccionEntity) => {
    const newSelected = selected.filter(p => p.procesoId !== proceso.procesoId);
    setSelected(newSelected);
    fetchAvailable(page);
  };

  const handleAccept = () => {
    onConfirm(selected);
    setSelected([]);
    setAvailable([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Seleccionar Procesos de Producción</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={4}>
            {/* Panel izquierdo - Procesos disponibles */}
            <Box flex={1}>
              <Flex mb={2} gap={2}>
                <Input
                  placeholder='Buscar por nombre'
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      fetchAvailable(0);
                    }
                  }}
                />
                <Button
                  onClick={() => fetchAvailable(0)}
                  isLoading={loading}
                  loadingText="Buscando..."
                >
                  Buscar
                </Button>
              </Flex>
              <Table size='sm'>
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Nombre</Th>
                    <Th>Modelo de Tiempo</Th>
                    <Th>Setup Time</Th>
                    <Th>Nivel de Acceso</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {available.map(proceso => {
                    const timeInfo = getTimeModelInfo(proceso);
                    return (
                      <Tr key={proceso.procesoId}>
                        <Td>{proceso.procesoId}</Td>
                        <Td>{proceso.nombre}</Td>
                        <Td>
                          <Tooltip label={timeInfo.details}>
                            <Badge colorScheme="teal">{timeInfo.label}</Badge>
                          </Tooltip>
                        </Td>
                        <Td>{proceso.setUpTime} seg</Td>
                        <Td>{proceso.nivelAcceso !== undefined ? proceso.nivelAcceso : '-'}</Td>
                        <Td>
                          <Button size='xs' onClick={() => handleAdd(proceso)}>+</Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
              {totalPages > 1 && (
                <MyPagination 
                  page={page} 
                  totalPages={totalPages} 
                  loading={loading} 
                  handlePageChange={fetchAvailable} 
                />
              )}
            </Box>

            {/* Panel derecho - Procesos seleccionados */}
            <Box flex={1}>
              <Table size='sm'>
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Nombre</Th>
                    <Th>Modelo de Tiempo</Th>
                    <Th>Setup Time</Th>
                    <Th>Nivel de Acceso</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selected.map(proceso => {
                    const timeInfo = getTimeModelInfo(proceso);
                    return (
                      <Tr key={proceso.procesoId}>
                        <Td>{proceso.procesoId}</Td>
                        <Td>{proceso.nombre}</Td>
                        <Td>
                          <Tooltip label={timeInfo.details}>
                            <Badge colorScheme="teal">{timeInfo.label}</Badge>
                          </Tooltip>
                        </Td>
                        <Td>{proceso.setUpTime} seg</Td>
                        <Td>{proceso.nivelAcceso !== undefined ? proceso.nivelAcceso : '-'}</Td>
                        <Td>
                          <Button 
                            size='xs' 
                            colorScheme='red' 
                            onClick={() => handleRemove(proceso)}
                          >
                            -
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme='teal' onClick={handleAccept}>Aceptar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
