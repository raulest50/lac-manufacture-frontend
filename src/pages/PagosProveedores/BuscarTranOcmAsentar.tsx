import {useState} from 'react';
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from '../../api/EndPointsURL.tsx';
import MyPagination from '../../components/MyPagination.tsx';
import {
  EstadoContable,
  TransaccionAlmacen,
  DTO_SearchTransaccionAlmacen,
  PaginatedResponse
} from './types.tsx';

const endPoints = new EndPointsURL();

export default function BuscarTranOcmAsentar() {
  const [estadoContable, setEstadoContable] = useState<EstadoContable>(EstadoContable.PENDIENTE);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [transacciones, setTransacciones] = useState<TransaccionAlmacen[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const pageSize = 10;

  const handleSearch = async (pageNumber = 0) => {
    setLoading(true);
    setPage(pageNumber);
    try {
      const dto: DTO_SearchTransaccionAlmacen = {
        estadoContable,
        fechaInicio: fechaInicio ? `${fechaInicio}T00:00:00` : undefined,
        fechaFin: fechaFin ? `${fechaFin}T23:59:59` : undefined,
        page: pageNumber,
        size: pageSize,
      };
      const resp = await axios.post<PaginatedResponse<TransaccionAlmacen>>(endPoints.search_transacciones_almacen, dto);
      setTransacciones(resp.data.content);
      setTotalPages(resp.data.totalPages);
    } catch (e) {
      toast({
        title: 'Error al buscar transacciones',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      setTransacciones([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex direction="column" w="full" gap={4}>
      <Flex wrap="wrap" gap={4}>
        <FormControl w={["100%","200px"]}>
          <FormLabel>Estado contable</FormLabel>
          <Select value={estadoContable} onChange={e => setEstadoContable(e.target.value as EstadoContable)}>
            <option value={EstadoContable.PENDIENTE}>Pendiente</option>
            <option value={EstadoContable.CONTABILIZADA}>Contabilizada</option>
            <option value={EstadoContable.NO_APLICA}>No aplica</option>
          </Select>
        </FormControl>
        <FormControl w={["100%","200px"]}>
          <FormLabel>Fecha inicio</FormLabel>
          <Input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
        </FormControl>
        <FormControl w={["100%","200px"]}>
          <FormLabel>Fecha fin</FormLabel>
          <Input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
        </FormControl>
        <Flex alignItems="flex-end">
          <Button colorScheme="blue" onClick={() => handleSearch(0)} isLoading={loading}>
            Buscar
          </Button>
        </Flex>
      </Flex>

      <Flex direction="column" w="full">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Fecha</Th>
              <Th>Estado</Th>
              <Th>Entidad</Th>
              <Th>ID Entidad</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading && (
              <Tr>
                <Td colSpan={5} textAlign="center">
                  <Spinner />
                </Td>
              </Tr>
            )}
            {!loading && transacciones.length === 0 && (
              <Tr>
                <Td colSpan={5} textAlign="center">
                  No hay resultados
                </Td>
              </Tr>
            )}
            {transacciones.map(tran => (
              <Tr key={tran.transaccionId}>
                <Td>{tran.transaccionId}</Td>
                <Td>{new Date(tran.fechaTransaccion).toLocaleString()}</Td>
                <Td>{tran.estadoContable}</Td>
                <Td>{tran.tipoEntidadCausante}</Td>
                <Td>{tran.idEntidadCausante}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <MyPagination page={page} totalPages={totalPages} loading={loading} handlePageChange={handleSearch} />
      </Flex>
    </Flex>
  );
}
