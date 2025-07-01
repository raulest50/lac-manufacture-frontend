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
  useToast
} from '@chakra-ui/react';
import { SearchIcon, AddIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { CuentaContable, SaldoNormal, TipoCuenta } from '../types';
import DetalleCuenta from './DetalleCuenta';
import EndPointsURL from '../../../api/EndPointsURL';

const CatalogoCuentas: React.FC = () => {
  const [cuentas, setCuentas] = useState<CuentaContable[]>([]);
  const [filteredCuentas, setFilteredCuentas] = useState<CuentaContable[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCuenta, setSelectedCuenta] = useState<CuentaContable | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const endpoints = new EndPointsURL();

  useEffect(() => {
    fetchCuentas();
  }, []);

  useEffect(() => {
    if (!Array.isArray(cuentas)) {
      setFilteredCuentas([]);
      return;
    }

    if (searchTerm) {
      const filtered = cuentas.filter(cuenta => 
        cuenta.codigo.toLowerCase().includes(searchTerm.toLowerCase()) || 
        cuenta.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCuentas(filtered);
    } else {
      setFilteredCuentas(cuentas);
    }
  }, [searchTerm, cuentas]);

  const fetchCuentas = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(endpoints.get_cuentas);
      // Asegúrate de que response.data sea un array
      const cuentasData = Array.isArray(response.data) ? response.data : [];
      setCuentas(cuentasData);
      setFilteredCuentas(cuentasData);
    } catch (error) {
      console.error('Error fetching cuentas:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las cuentas contables',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // Temporary mock data for development
      const mockData: CuentaContable[] = [
        { codigo: '1000', nombre: 'Caja', tipo: TipoCuenta.ACTIVO, saldoNormal: SaldoNormal.DEBITO, cuentaControl: false },
        { codigo: '1010', nombre: 'Banco', tipo: TipoCuenta.ACTIVO, saldoNormal: SaldoNormal.DEBITO, cuentaControl: false },
        { codigo: '1200', nombre: 'Inventario Materias Primas', tipo: TipoCuenta.ACTIVO, saldoNormal: SaldoNormal.DEBITO, cuentaControl: true },
        { codigo: '1210', nombre: 'Inventario WIP', tipo: TipoCuenta.ACTIVO, saldoNormal: SaldoNormal.DEBITO, cuentaControl: true },
        { codigo: '1220', nombre: 'Inventario Productos Terminados', tipo: TipoCuenta.ACTIVO, saldoNormal: SaldoNormal.DEBITO, cuentaControl: true },
        { codigo: '2000', nombre: 'Cuentas por Pagar - Proveedores', tipo: TipoCuenta.PASIVO, saldoNormal: SaldoNormal.CREDITO, cuentaControl: false },
      ];
      setCuentas(mockData);
      setFilteredCuentas(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCuenta = (cuenta: CuentaContable) => {
    setSelectedCuenta(cuenta);
    setIsEditing(false);
    onOpen();
  };

  const handleEditCuenta = (cuenta: CuentaContable) => {
    setSelectedCuenta(cuenta);
    setIsEditing(true);
    onOpen();
  };

  const handleAddCuenta = () => {
    setSelectedCuenta(null);
    setIsEditing(true);
    onOpen();
  };

  const handleSaveCuenta = async (cuenta: CuentaContable) => {
    try {
      if (cuenta.codigo && selectedCuenta) {
        // Update existing account
        const updateUrl = endpoints.update_cuenta.replace('{codigo}', cuenta.codigo);
        await axios.put(updateUrl, cuenta);
        setCuentas(cuentas.map(c => c.codigo === cuenta.codigo ? cuenta : c));
        toast({
          title: 'Cuenta actualizada',
          description: `La cuenta ${cuenta.codigo} ha sido actualizada correctamente`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create new account
        const response = await axios.post(endpoints.save_cuenta, cuenta);
        setCuentas([...cuentas, response.data]);
        toast({
          title: 'Cuenta creada',
          description: `La cuenta ${response.data.codigo} ha sido creada correctamente`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving cuenta:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la cuenta contable',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
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
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">Catálogo de Cuentas</Heading>
        <Button 
          leftIcon={<AddIcon />} 
          colorScheme="blue" 
          onClick={handleAddCuenta}
        >
          Nueva Cuenta
        </Button>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input 
          placeholder="Buscar por código o nombre" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Código</Th>
              <Th>Nombre</Th>
              <Th>Tipo</Th>
              <Th>Saldo Normal</Th>
              <Th>Cuenta Control</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={6} textAlign="center">Cargando...</Td>
              </Tr>
            ) : !Array.isArray(filteredCuentas) ? (
              <Tr>
                <Td colSpan={6} textAlign="center">Error al cargar las cuentas</Td>
              </Tr>
            ) : filteredCuentas.length === 0 ? (
              <Tr>
                <Td colSpan={6} textAlign="center">No se encontraron cuentas</Td>
              </Tr>
            ) : (
              filteredCuentas.map((cuenta) => (
                <Tr key={cuenta.codigo}>
                  <Td>{cuenta.codigo}</Td>
                  <Td>{cuenta.nombre}</Td>
                  <Td>
                    <Badge colorScheme={getTipoBadgeColor(cuenta.tipo)}>
                      {cuenta.tipo}
                    </Badge>
                  </Td>
                  <Td>{cuenta.saldoNormal}</Td>
                  <Td>{cuenta.cuentaControl ? 'Sí' : 'No'}</Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton
                        aria-label="Ver cuenta"
                        icon={<ViewIcon />}
                        size="sm"
                        onClick={() => handleViewCuenta(cuenta)}
                      />
                      <IconButton
                        aria-label="Editar cuenta"
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleEditCuenta(cuenta)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Modal for viewing/editing account details */}
      {isOpen && (
        <DetalleCuenta
          isOpen={isOpen}
          onClose={onClose}
          cuenta={selectedCuenta}
          isEditing={isEditing}
          onSave={handleSaveCuenta}
        />
      )}
    </Box>
  );
};

export default CatalogoCuentas;
