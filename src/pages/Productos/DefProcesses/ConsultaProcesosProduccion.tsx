import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  Tooltip,
  Badge,
  Heading
} from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from '../../../api/EndPointsURL.tsx';
import { ProcesoProduccionEntity, TimeModelType } from '../types.tsx';
import MyPagination from '../../../components/MyPagination.tsx';
import { EditarProcesoModal } from './EditorProcesos/EditarProcesoModal.tsx';

export function ConsultaProcesosProduccion() {
  const endPoints = new EndPointsURL();
  const toast = useToast();

  const [searchText, setSearchText] = useState('');
  const [procesos, setProcesos] = useState<ProcesoProduccionEntity[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [procesoSeleccionado, setProcesoSeleccionado] = useState<ProcesoProduccionEntity | null>(null);
  const pageSize = 10;

  // Helper function to format time model information (copiado de ProcesoProduccionPicker)
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
        return {
          label: 'Tiempo',
          details: `${proceso.processTime ?? 0} seg`
        };
    }
  };

  const fetchProcesos = async (pageNumber: number) => {
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

      setProcesos(list);
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
      setProcesos([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesos(0);
  }, []);

  const handleEdit = (proceso: ProcesoProduccionEntity) => {
    setProcesoSeleccionado(proceso);
    setIsModalOpen(true);
  };

  return (
    <Flex direction="column" gap={4}>
      <Heading size="md" mb={4}>Consulta de Procesos de Producción</Heading>

      {/* Barra de búsqueda */}
      <Flex mb={4} gap={2}>
        <Input
          placeholder='Buscar por nombre'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchProcesos(0);
            }
          }}
        />
        <Button
          onClick={() => fetchProcesos(0)}
          isLoading={loading}
          loadingText="Buscando..."
          colorScheme="teal"
        >
          Buscar
        </Button>
      </Flex>

      {/* Tabla de resultados */}
      <Box overflowX="auto">
        <Table size='sm' variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Nombre</Th>
              <Th>Modelo de Tiempo</Th>
              <Th>Setup Time</Th>
              <Th>Nivel de Acceso</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {procesos.map(proceso => {
              const timeInfo = getTimeModelInfo(proceso);
              return (
                <Tr key={proceso.procesoId}>
                  <Td>{proceso.procesoId}</Td>
                  <Td>{proceso.nombre}</Td>
                  <Td>
                    <Flex alignItems="center" gap={2}>
                      <Badge colorScheme="teal">{timeInfo.label}</Badge>
                      <Box fontSize="sm">{timeInfo.details}</Box>
                    </Flex>
                  </Td>
                  <Td>{proceso.setUpTime} seg</Td>
                  <Td>{proceso.nivelAcceso !== undefined ? proceso.nivelAcceso : '-'}</Td>
                  <Td>
                    <Button 
                      size='sm' 
                      colorScheme='blue'
                      onClick={() => handleEdit(proceso)}
                    >
                      Editar
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>

      {/* Paginación */}
      {totalPages > 1 && (
        <MyPagination 
          page={page} 
          totalPages={totalPages} 
          loading={loading} 
          handlePageChange={fetchProcesos} 
        />
      )}

      {/* Modal de edición */}
      <EditarProcesoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        proceso={procesoSeleccionado}
        onSave={(procesoActualizado) => {
          // Actualizar la lista de procesos con el proceso actualizado
          setProcesos(procesos.map(p => 
            p.procesoId === procesoActualizado.procesoId ? procesoActualizado : p
          ));
          // Refrescar la lista para asegurar que se muestren los datos actualizados
          fetchProcesos(page);
        }}
      />
    </Flex>
  );
}
