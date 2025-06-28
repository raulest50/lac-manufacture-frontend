import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider
} from '@chakra-ui/react';
import axios from 'axios';
import { PeriodoContable, TipoCuenta } from '../types';
import EndPointsURL from '../../../api/EndPointsURL';

interface CuentaReporte {
  codigo: string;
  nombre: string;
  saldo: number;
}

interface GrupoReporte {
  nombre: string;
  cuentas: CuentaReporte[];
  total: number;
}

interface EstadoFinanciero {
  grupos: GrupoReporte[];
  total: number;
}

const EstadosFinancieros: React.FC = () => {
  const [periodos, setPeriodos] = useState<PeriodoContable[]>([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>('');
  const [balanceGeneral, setBalanceGeneral] = useState<EstadoFinanciero | null>(null);
  const [estadoResultados, setEstadoResultados] = useState<EstadoFinanciero | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetchPeriodos();
  }, []);

  const fetchPeriodos = async () => {
    try {
      const response = await axios.get('/api/contabilidad/periodos');
      setPeriodos(response.data);
    } catch (error) {
      console.error('Error fetching periodos:', error);
      // Mock data for development
      const mockPeriodos: PeriodoContable[] = [
        { id: 1, nombre: 'Enero 2023', fechaInicio: '2023-01-01', fechaFin: '2023-01-31', estado: 'CERRADO' },
        { id: 2, nombre: 'Febrero 2023', fechaInicio: '2023-02-01', fechaFin: '2023-02-28', estado: 'CERRADO' },
        { id: 3, nombre: 'Marzo 2023', fechaInicio: '2023-03-01', fechaFin: '2023-03-31', estado: 'ABIERTO' },
      ];
      setPeriodos(mockPeriodos);
    }
  };

  const fetchEstadosFinancieros = async () => {
    if (!selectedPeriodo) {
      setError('Debe seleccionar un período');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch Balance General
      const balanceResponse = await axios.get(`/api/contabilidad/balance-general`, {
        params: {
          periodoId: selectedPeriodo
        }
      });
      setBalanceGeneral(balanceResponse.data);

      // Fetch Estado de Resultados
      const resultadosResponse = await axios.get(`/api/contabilidad/estado-resultados`, {
        params: {
          periodoId: selectedPeriodo
        }
      });
      setEstadoResultados(resultadosResponse.data);
    } catch (error) {
      console.error('Error fetching estados financieros:', error);
      setError('No se pudieron cargar los estados financieros');
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los estados financieros',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      // Mock data for development
      // Balance General
      const mockBalanceGeneral: EstadoFinanciero = {
        grupos: [
          {
            nombre: 'ACTIVOS',
            cuentas: [
              { codigo: '1000', nombre: 'Caja', saldo: 5000 },
              { codigo: '1010', nombre: 'Banco', saldo: 11700 },
              { codigo: '1200', nombre: 'Inventario Materias Primas', saldo: 18500 },
              { codigo: '1210', nombre: 'Inventario WIP', saldo: 8000 },
              { codigo: '1220', nombre: 'Inventario Productos Terminados', saldo: 12000 },
            ],
            total: 55200
          },
          {
            nombre: 'PASIVOS',
            cuentas: [
              { codigo: '2000', nombre: 'Cuentas por Pagar - Proveedores', saldo: 15000 },
            ],
            total: 15000
          },
          {
            nombre: 'PATRIMONIO',
            cuentas: [
              { codigo: '3000', nombre: 'Capital Social', saldo: 20000 },
              { codigo: '3100', nombre: 'Utilidad del Ejercicio', saldo: 20200 },
            ],
            total: 40200
          }
        ],
        total: 55200 // Activos = Pasivos + Patrimonio
      };

      // Estado de Resultados
      const mockEstadoResultados: EstadoFinanciero = {
        grupos: [
          {
            nombre: 'INGRESOS',
            cuentas: [
              { codigo: '4000', nombre: 'Ingresos por Ventas', saldo: 30000 },
            ],
            total: 30000
          },
          {
            nombre: 'GASTOS',
            cuentas: [
              { codigo: '5000', nombre: 'Costo de Ventas', saldo: 8000 },
              { codigo: '5200', nombre: 'Gasto por Scrap', saldo: 1800 },
            ],
            total: 9800
          }
        ],
        total: 20200 // Ingresos - Gastos = Utilidad
      };

      setBalanceGeneral(mockBalanceGeneral);
      setEstadoResultados(mockEstadoResultados);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = () => {
    fetchEstadosFinancieros();
  };

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  const getPeriodoInfo = () => {
    const periodo = periodos.find(p => p.id?.toString() === selectedPeriodo);
    return periodo ? periodo.nombre : '';
  };

  const renderEstadoFinanciero = (estado: EstadoFinanciero | null) => {
    if (!estado) return null;

    return (
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Código</Th>
              <Th>Cuenta</Th>
              <Th isNumeric>Saldo</Th>
            </Tr>
          </Thead>
          <Tbody>
            {estado.grupos.map((grupo, grupoIndex) => (
              <React.Fragment key={grupoIndex}>
                <Tr bg="gray.100">
                  <Td colSpan={3} fontWeight="bold">{grupo.nombre}</Td>
                </Tr>
                {grupo.cuentas.map((cuenta, cuentaIndex) => (
                  <Tr key={`${grupoIndex}-${cuentaIndex}`}>
                    <Td>{cuenta.codigo}</Td>
                    <Td>{cuenta.nombre}</Td>
                    <Td isNumeric>{formatCurrency(cuenta.saldo)}</Td>
                  </Tr>
                ))}
                <Tr fontWeight="bold">
                  <Td colSpan={2} textAlign="right">Total {grupo.nombre}:</Td>
                  <Td isNumeric>{formatCurrency(grupo.total)}</Td>
                </Tr>
                {grupoIndex < estado.grupos.length - 1 && <Tr><Td colSpan={3}><Divider /></Td></Tr>}
              </React.Fragment>
            ))}
            <Tr fontWeight="bold" fontSize="lg">
              <Td colSpan={2} textAlign="right">TOTAL:</Td>
              <Td isNumeric>{formatCurrency(estado.total)}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    );
  };

  return (
    <Box w="full">
      <Heading size="md" mb={4}>Estados Financieros</Heading>

      <Box p={4} bg="gray.50" borderRadius="md" mb={4}>
        <FormControl mb={4}>
          <FormLabel>Período</FormLabel>
          <Select 
            placeholder="Seleccione un período" 
            value={selectedPeriodo}
            onChange={(e) => setSelectedPeriodo(e.target.value)}
          >
            {periodos.map(periodo => (
              <option key={periodo.id} value={periodo.id?.toString()}>
                {periodo.nombre}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button 
          colorScheme="blue" 
          onClick={handleGenerateReport}
          isDisabled={!selectedPeriodo}
        >
          Generar Estados Financieros
        </Button>
      </Box>

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (balanceGeneral || estadoResultados) ? (
        <Box>
          <Text fontWeight="bold" mb={4}>Período: {getPeriodoInfo()}</Text>

          <Tabs colorScheme="blue" variant="enclosed">
            <TabList>
              <Tab>Balance General</Tab>
              <Tab>Estado de Resultados</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Heading size="sm" mb={4}>Balance General</Heading>
                {renderEstadoFinanciero(balanceGeneral)}
              </TabPanel>

              <TabPanel>
                <Heading size="sm" mb={4}>Estado de Resultados</Heading>
                {renderEstadoFinanciero(estadoResultados)}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      ) : selectedPeriodo ? (
        <Alert status="info">
          <AlertIcon />
          No hay datos para el período seleccionado
        </Alert>
      ) : null}
    </Box>
  );
};

export default EstadosFinancieros;
