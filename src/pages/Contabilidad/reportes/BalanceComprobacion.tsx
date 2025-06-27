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
  Badge
} from '@chakra-ui/react';
import axios from 'axios';
import { PeriodoContable, SaldoCuenta, CuentaContable, TipoCuenta } from '../types';

const BalanceComprobacion: React.FC = () => {
  const [periodos, setPeriodos] = useState<PeriodoContable[]>([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>('');
  const [saldos, setSaldos] = useState<SaldoCuenta[]>([]);
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

  const fetchBalanceComprobacion = async () => {
    if (!selectedPeriodo) {
      setError('Debe seleccionar un período');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/contabilidad/balance-comprobacion`, {
        params: {
          periodoId: selectedPeriodo
        }
      });
      setSaldos(response.data);
    } catch (error) {
      console.error('Error fetching balance de comprobación:', error);
      setError('No se pudo cargar el balance de comprobación');
      toast({
        title: 'Error',
        description: 'No se pudo cargar el balance de comprobación',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      // Mock data for development
      const mockCuentas: CuentaContable[] = [
        { codigo: '1000', nombre: 'Caja', tipo: TipoCuenta.ACTIVO, saldoNormal: 'DEBITO', cuentaControl: false },
        { codigo: '1010', nombre: 'Banco', tipo: TipoCuenta.ACTIVO, saldoNormal: 'DEBITO', cuentaControl: false },
        { codigo: '1200', nombre: 'Inventario Materias Primas', tipo: TipoCuenta.ACTIVO, saldoNormal: 'DEBITO', cuentaControl: true },
        { codigo: '1210', nombre: 'Inventario WIP', tipo: TipoCuenta.ACTIVO, saldoNormal: 'DEBITO', cuentaControl: true },
        { codigo: '1220', nombre: 'Inventario Productos Terminados', tipo: TipoCuenta.ACTIVO, saldoNormal: 'DEBITO', cuentaControl: true },
        { codigo: '2000', nombre: 'Cuentas por Pagar - Proveedores', tipo: TipoCuenta.PASIVO, saldoNormal: 'CREDITO', cuentaControl: false },
        { codigo: '3000', nombre: 'Capital Social', tipo: TipoCuenta.PATRIMONIO, saldoNormal: 'CREDITO', cuentaControl: false },
        { codigo: '4000', nombre: 'Ingresos por Ventas', tipo: TipoCuenta.INGRESO, saldoNormal: 'CREDITO', cuentaControl: false },
        { codigo: '5000', nombre: 'Costo de Ventas', tipo: TipoCuenta.GASTO, saldoNormal: 'DEBITO', cuentaControl: false },
        { codigo: '5200', nombre: 'Gasto por Scrap', tipo: TipoCuenta.GASTO, saldoNormal: 'DEBITO', cuentaControl: false },
      ];
      
      const mockSaldos: SaldoCuenta[] = [
        { cuenta: mockCuentas[0], saldoDebito: 5000, saldoCredito: 0, saldoNeto: 5000 },
        { cuenta: mockCuentas[1], saldoDebito: 11700, saldoCredito: 0, saldoNeto: 11700 },
        { cuenta: mockCuentas[2], saldoDebito: 18500, saldoCredito: 0, saldoNeto: 18500 },
        { cuenta: mockCuentas[3], saldoDebito: 8000, saldoCredito: 0, saldoNeto: 8000 },
        { cuenta: mockCuentas[4], saldoDebito: 12000, saldoCredito: 0, saldoNeto: 12000 },
        { cuenta: mockCuentas[5], saldoDebito: 0, saldoCredito: 15000, saldoNeto: -15000 },
        { cuenta: mockCuentas[6], saldoDebito: 0, saldoCredito: 20000, saldoNeto: -20000 },
        { cuenta: mockCuentas[7], saldoDebito: 0, saldoCredito: 30000, saldoNeto: -30000 },
        { cuenta: mockCuentas[8], saldoDebito: 8000, saldoCredito: 0, saldoNeto: 8000 },
        { cuenta: mockCuentas[9], saldoDebito: 1800, saldoCredito: 0, saldoNeto: 1800 },
      ];
      
      setSaldos(mockSaldos);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = () => {
    fetchBalanceComprobacion();
  };

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  const calculateTotals = () => {
    let totalDebito = 0;
    let totalCredito = 0;
    
    saldos.forEach(saldo => {
      totalDebito += saldo.saldoDebito || 0;
      totalCredito += saldo.saldoCredito || 0;
    });
    
    return { totalDebito, totalCredito };
  };

  const { totalDebito, totalCredito } = calculateTotals();
  const isBalanced = totalDebito === totalCredito;

  const getPeriodoInfo = () => {
    const periodo = periodos.find(p => p.id?.toString() === selectedPeriodo);
    return periodo ? periodo.nombre : '';
  };

  const getTipoBadgeColor = (tipo: TipoCuenta) => {
    switch (tipo) {
      case TipoCuenta.ACTIVO:
        return 'blue';
      case TipoCuenta.PASIVO:
        return 'red';
      case TipoCuenta.PATRIMONIO:
        return 'purple';
      case TipoCuenta.INGRESO:
        return 'green';
      case TipoCuenta.GASTO:
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <Box w="full">
      <Heading size="md" mb={4}>Balance de Comprobación</Heading>
      
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
          Generar Balance
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
      ) : saldos.length > 0 ? (
        <Box>
          <Flex justify="space-between" mb={4}>
            <Box>
              <Text fontWeight="bold">Período: {getPeriodoInfo()}</Text>
            </Box>
            <Box textAlign="right">
              <Badge colorScheme={isBalanced ? 'green' : 'red'} fontSize="md" p={2}>
                {isBalanced ? 'Balanceado' : 'Desbalanceado'}
              </Badge>
            </Box>
          </Flex>
          
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Código</Th>
                  <Th>Cuenta</Th>
                  <Th>Tipo</Th>
                  <Th isNumeric>Débito</Th>
                  <Th isNumeric>Crédito</Th>
                </Tr>
              </Thead>
              <Tbody>
                {saldos.map((saldo, index) => (
                  <Tr key={index}>
                    <Td>{saldo.cuenta.codigo}</Td>
                    <Td>{saldo.cuenta.nombre}</Td>
                    <Td>
                      <Badge colorScheme={getTipoBadgeColor(saldo.cuenta.tipo)}>
                        {saldo.cuenta.tipo}
                      </Badge>
                    </Td>
                    <Td isNumeric>{saldo.saldoDebito ? formatCurrency(saldo.saldoDebito) : '-'}</Td>
                    <Td isNumeric>{saldo.saldoCredito ? formatCurrency(saldo.saldoCredito) : '-'}</Td>
                  </Tr>
                ))}
                <Tr fontWeight="bold">
                  <Td colSpan={3} textAlign="right">Totales:</Td>
                  <Td isNumeric>{formatCurrency(totalDebito)}</Td>
                  <Td isNumeric>{formatCurrency(totalCredito)}</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
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

export default BalanceComprobacion;