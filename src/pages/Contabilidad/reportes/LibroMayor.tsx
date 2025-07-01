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
  HStack,
  Text,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { CuentaContable, PeriodoContable, MovimientoLibroMayor } from '../types';
import EndPointsURL from '../../../api/EndPointsURL';

const LibroMayor: React.FC = () => {
  const [cuentas, setCuentas] = useState<CuentaContable[]>([]);
  const [periodos, setPeriodos] = useState<PeriodoContable[]>([]);
  const [selectedCuenta, setSelectedCuenta] = useState<string>('');
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>('');
  const [movimientos, setMovimientos] = useState<MovimientoLibroMayor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const endpoints = new EndPointsURL();

  useEffect(() => {
    fetchCuentas();
    fetchPeriodos();
  }, []);

  const fetchCuentas = async () => {
    try {
      const response = await axios.get(endpoints.get_cuentas);
      // Asegúrate de que response.data sea un array
      const cuentasData = Array.isArray(response.data) ? response.data : [];
      setCuentas(cuentasData);
    } catch (error) {
      console.error('Error fetching cuentas:', error);
      // Mock data for development
      const mockCuentas: CuentaContable[] = [
        { codigo: '1000', nombre: 'Caja', tipo: 'ACTIVO', saldoNormal: 'DEBITO', cuentaControl: false },
        { codigo: '1010', nombre: 'Banco', tipo: 'ACTIVO', saldoNormal: 'DEBITO', cuentaControl: false },
        { codigo: '1200', nombre: 'Inventario Materias Primas', tipo: 'ACTIVO', saldoNormal: 'DEBITO', cuentaControl: true },
        { codigo: '2000', nombre: 'Cuentas por Pagar - Proveedores', tipo: 'PASIVO', saldoNormal: 'CREDITO', cuentaControl: false },
        { codigo: '5000', nombre: 'Costo de Ventas', tipo: 'GASTO', saldoNormal: 'DEBITO', cuentaControl: false },
      ];
      setCuentas(mockCuentas);
    }
  };

  const fetchPeriodos = async () => {
    try {
      const response = await axios.get(endpoints.get_periodos);
      // Asegúrate de que response.data sea un array
      const periodosData = Array.isArray(response.data) ? response.data : [];
      setPeriodos(periodosData);
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

  const fetchMovimientos = async () => {
    if (!selectedCuenta || !selectedPeriodo) {
      setError('Debe seleccionar una cuenta y un período');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(endpoints.get_libro_mayor, {
        params: {
          cuentaCodigo: selectedCuenta,
          periodoId: selectedPeriodo
        }
      });
      setMovimientos(response.data);
    } catch (error) {
      console.error('Error fetching movimientos:', error);
      setError('No se pudieron cargar los movimientos de la cuenta');
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los movimientos de la cuenta',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      // Mock data for development
      if (selectedCuenta === '1010') { // Banco
        const mockMovimientos: MovimientoLibroMayor[] = [
          { fecha: '2023-03-01', numeroAsiento: 1, descripcion: 'Saldo inicial', debito: 10000, credito: 0, saldoAcumulado: 10000 },
          { fecha: '2023-03-05', numeroAsiento: 2, descripcion: 'Pago a proveedor', debito: 0, credito: 2500, saldoAcumulado: 7500 },
          { fecha: '2023-03-15', numeroAsiento: 3, descripcion: 'Cobro a cliente', debito: 3000, credito: 0, saldoAcumulado: 10500 },
          { fecha: '2023-03-20', numeroAsiento: 4, descripcion: 'Pago de servicios', debito: 0, credito: 800, saldoAcumulado: 9700 },
          { fecha: '2023-03-25', numeroAsiento: 5, descripcion: 'Cobro a cliente', debito: 2000, credito: 0, saldoAcumulado: 11700 },
        ];
        setMovimientos(mockMovimientos);
      } else if (selectedCuenta === '1200') { // Inventario Materias Primas
        const mockMovimientos: MovimientoLibroMayor[] = [
          { fecha: '2023-03-01', numeroAsiento: 1, descripcion: 'Saldo inicial', debito: 15000, credito: 0, saldoAcumulado: 15000 },
          { fecha: '2023-03-05', numeroAsiento: 2, descripcion: 'Compra de materias primas', debito: 5000, credito: 0, saldoAcumulado: 20000 },
          { fecha: '2023-03-10', numeroAsiento: 3, descripcion: 'Consumo para producción', debito: 0, credito: 3000, saldoAcumulado: 17000 },
          { fecha: '2023-03-20', numeroAsiento: 4, descripcion: 'Compra de materias primas', debito: 4000, credito: 0, saldoAcumulado: 21000 },
          { fecha: '2023-03-25', numeroAsiento: 5, descripcion: 'Consumo para producción', debito: 0, credito: 2500, saldoAcumulado: 18500 },
        ];
        setMovimientos(mockMovimientos);
      } else {
        setMovimientos([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = () => {
    fetchMovimientos();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  const calculateTotals = () => {
    let totalDebito = 0;
    let totalCredito = 0;

    movimientos.forEach(movimiento => {
      totalDebito += movimiento.debito || 0;
      totalCredito += movimiento.credito || 0;
    });

    return { totalDebito, totalCredito };
  };

  const { totalDebito, totalCredito } = calculateTotals();
  const saldoFinal = movimientos.length > 0 ? movimientos[movimientos.length - 1].saldoAcumulado : 0;

  const getCuentaInfo = () => {
    const cuenta = cuentas.find(c => c.codigo === selectedCuenta);
    return cuenta ? `${cuenta.codigo} - ${cuenta.nombre}` : '';
  };

  const getPeriodoInfo = () => {
    const periodo = periodos.find(p => p.id?.toString() === selectedPeriodo);
    return periodo ? periodo.nombre : '';
  };

  return (
    <Box w="full">
      <Heading size="md" mb={4}>Libro Mayor</Heading>

      <Box p={4} bg="gray.50" borderRadius="md" mb={4}>
        <HStack spacing={4} mb={4}>
          <FormControl>
            <FormLabel>Cuenta</FormLabel>
            <Select 
              placeholder="Seleccione una cuenta" 
              value={selectedCuenta}
              onChange={(e) => setSelectedCuenta(e.target.value)}
            >
              {Array.isArray(cuentas) ? cuentas.map(cuenta => (
                <option key={cuenta.codigo} value={cuenta.codigo}>
                  {cuenta.codigo} - {cuenta.nombre}
                </option>
              )) : <option value="">No hay cuentas disponibles</option>}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Período</FormLabel>
            <Select 
              placeholder="Seleccione un período" 
              value={selectedPeriodo}
              onChange={(e) => setSelectedPeriodo(e.target.value)}
            >
              {Array.isArray(periodos) ? periodos.map(periodo => (
                <option key={periodo.id} value={periodo.id?.toString()}>
                  {periodo.nombre}
                </option>
              )) : <option value="">No hay períodos disponibles</option>}
            </Select>
          </FormControl>
        </HStack>

        <Button 
          colorScheme="blue" 
          onClick={handleGenerateReport}
          isDisabled={!selectedCuenta || !selectedPeriodo}
        >
          Generar Reporte
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
      ) : movimientos.length > 0 ? (
        <Box>
          <Flex justify="space-between" mb={4}>
            <Box>
              <Text fontWeight="bold">Cuenta: {getCuentaInfo()}</Text>
              <Text fontWeight="bold">Período: {getPeriodoInfo()}</Text>
            </Box>
            <Box textAlign="right">
              <Text fontWeight="bold">Saldo Final: {formatCurrency(saldoFinal)}</Text>
            </Box>
          </Flex>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Fecha</Th>
                  <Th>Asiento #</Th>
                  <Th>Descripción</Th>
                  <Th isNumeric>Débito</Th>
                  <Th isNumeric>Crédito</Th>
                  <Th isNumeric>Saldo</Th>
                </Tr>
              </Thead>
              <Tbody>
                {movimientos.map((movimiento, index) => (
                  <Tr key={index}>
                    <Td>{formatDate(movimiento.fecha)}</Td>
                    <Td>{movimiento.numeroAsiento}</Td>
                    <Td>{movimiento.descripcion}</Td>
                    <Td isNumeric>{movimiento.debito ? formatCurrency(movimiento.debito) : '-'}</Td>
                    <Td isNumeric>{movimiento.credito ? formatCurrency(movimiento.credito) : '-'}</Td>
                    <Td isNumeric>{formatCurrency(movimiento.saldoAcumulado)}</Td>
                  </Tr>
                ))}
                <Tr fontWeight="bold">
                  <Td colSpan={3} textAlign="right">Totales:</Td>
                  <Td isNumeric>{formatCurrency(totalDebito)}</Td>
                  <Td isNumeric>{formatCurrency(totalCredito)}</Td>
                  <Td></Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Box>
      ) : selectedCuenta && selectedPeriodo ? (
        <Alert status="info">
          <AlertIcon />
          No hay movimientos para la cuenta y período seleccionados
        </Alert>
      ) : null}
    </Box>
  );
};

export default LibroMayor;
