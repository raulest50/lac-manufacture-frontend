import React, { useState, useEffect } from 'react';
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
  FormErrorMessage,
  VStack,
  HStack,
  Text,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Box,
  Flex,
  useToast,
  Badge
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { AsientoContable, LineaAsientoContable, PeriodoContable, EstadoAsiento, CuentaContable } from '../types';
import EndPointsURL from '../../../api/EndPointsURL';

interface FormularioAsientoProps {
  isOpen: boolean;
  onClose: () => void;
  asiento: AsientoContable | null;
  isEditing: boolean;
  onSave: (asiento: AsientoContable) => void;
  periodos: PeriodoContable[];
}

const FormularioAsiento: React.FC<FormularioAsientoProps> = ({
  isOpen,
  onClose,
  asiento,
  isEditing,
  onSave,
  periodos
}) => {
  const [formData, setFormData] = useState<AsientoContable>({
    fecha: new Date().toISOString(),
    descripcion: '',
    modulo: '',
    documentoOrigen: '',
    estado: EstadoAsiento.BORRADOR,
    periodoContable: periodos[0],
    lineas: []
  });

  const [cuentas, setCuentas] = useState<CuentaContable[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lineErrors, setLineErrors] = useState<Record<number, Record<string, string>>>({});
  const toast = useToast();
  const endpoints = new EndPointsURL();

  useEffect(() => {
    if (asiento) {
      setFormData(asiento);
    } else {
      // Default values for new journal entry
      const defaultPeriodo = periodos.find(p => p.estado === 'ABIERTO') || periodos[0];
      setFormData({
        fecha: new Date().toISOString(),
        descripcion: '',
        modulo: '',
        documentoOrigen: '',
        estado: EstadoAsiento.BORRADOR,
        periodoContable: defaultPeriodo,
        lineas: []
      });
    }
    fetchCuentas();
  }, [asiento, periodos]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'periodoContable') {
      const selectedPeriodo = periodos.find(p => p.id?.toString() === value);
      if (selectedPeriodo) {
        setFormData(prev => ({
          ...prev,
          periodoContable: selectedPeriodo
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleLineChange = (index: number, field: keyof LineaAsientoContable, value: string | number) => {
    const updatedLineas = [...formData.lineas];

    if (field === 'debito' || field === 'credito') {
      // Convert to number and handle NaN
      const numValue = parseFloat(value as string);
      updatedLineas[index] = {
        ...updatedLineas[index],
        [field]: isNaN(numValue) ? 0 : numValue
      };

      // If debito is set, clear credito and vice versa
      if (field === 'debito' && numValue > 0) {
        updatedLineas[index].credito = 0;
      } else if (field === 'credito' && numValue > 0) {
        updatedLineas[index].debito = 0;
      }
    } else {
      updatedLineas[index] = {
        ...updatedLineas[index],
        [field]: value
      };
    }

    setFormData(prev => ({
      ...prev,
      lineas: updatedLineas
    }));

    // Clear line error when field is edited
    if (lineErrors[index]?.[field as string]) {
      setLineErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[index]) {
          delete newErrors[index][field as string];
          if (Object.keys(newErrors[index]).length === 0) {
            delete newErrors[index];
          }
        }
        return newErrors;
      });
    }
  };

  const addLine = () => {
    const newLine: LineaAsientoContable = {
      cuentaCodigo: '',
      debito: 0,
      credito: 0,
      descripcion: ''
    };

    setFormData(prev => ({
      ...prev,
      lineas: [...prev.lineas, newLine]
    }));
  };

  const removeLine = (index: number) => {
    const updatedLineas = [...formData.lineas];
    updatedLineas.splice(index, 1);

    setFormData(prev => ({
      ...prev,
      lineas: updatedLineas
    }));

    // Clear line errors for removed line
    if (lineErrors[index]) {
      setLineErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const newLineErrors: Record<number, Record<string, string>> = {};

    // Validate header fields
    if (!formData.descripcion) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    }

    // Validate lines
    let totalDebito = 0;
    let totalCredito = 0;

    formData.lineas.forEach((linea, index) => {
      const lineError: Record<string, string> = {};

      if (!linea.cuentaCodigo) {
        lineError.cuentaCodigo = 'La cuenta es requerida';
      }

      if (linea.debito === 0 && linea.credito === 0) {
        lineError.debito = 'Debe ingresar un valor de débito o crédito';
        lineError.credito = 'Debe ingresar un valor de débito o crédito';
      }

      if (Object.keys(lineError).length > 0) {
        newLineErrors[index] = lineError;
      }

      totalDebito += linea.debito || 0;
      totalCredito += linea.credito || 0;
    });

    // Check if there are any lines
    if (formData.lineas.length === 0) {
      newErrors.lineas = 'Debe agregar al menos una línea al asiento';
    }

    // Check if debits equal credits
    if (totalDebito !== totalCredito) {
      newErrors.balance = 'El asiento no está balanceado. Los débitos deben ser iguales a los créditos.';
    }

    setErrors(newErrors);
    setLineErrors(newLineErrors);

    return Object.keys(newErrors).length === 0 && Object.keys(newLineErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    } else {
      toast({
        title: 'Error de validación',
        description: 'Por favor corrija los errores antes de guardar',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD for input
  };

  const calculateTotals = () => {
    let totalDebito = 0;
    let totalCredito = 0;

    formData.lineas.forEach(linea => {
      totalDebito += linea.debito || 0;
      totalCredito += linea.credito || 0;
    });

    return { totalDebito, totalCredito };
  };

  const { totalDebito, totalCredito } = calculateTotals();
  const isBalanced = totalDebito === totalCredito && totalDebito > 0;

  const getCuentaNombre = (codigo: string) => {
    const cuenta = cuentas.find(c => c.codigo === codigo);
    return cuenta ? cuenta.nombre : '';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditing 
            ? asiento?.id 
              ? `Editar Asiento #${asiento.id}` 
              : 'Nuevo Asiento Contable'
            : `Detalle de Asiento #${asiento?.id}`
          }
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isEditing ? (
            <VStack spacing={4} align="stretch">
              <HStack spacing={4}>
                <FormControl isInvalid={!!errors.fecha}>
                  <FormLabel>Fecha</FormLabel>
                  <Input
                    type="date"
                    name="fecha"
                    value={formatDate(formData.fecha)}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.fecha}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Período Contable</FormLabel>
                  <Select
                    name="periodoContable"
                    value={formData.periodoContable.id?.toString()}
                    onChange={handleChange}
                  >
                    {periodos.map(periodo => (
                      <option key={periodo.id} value={periodo.id?.toString()}>
                        {periodo.nombre}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>

              <FormControl isInvalid={!!errors.descripcion}>
                <FormLabel>Descripción</FormLabel>
                <Input
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción del asiento contable"
                />
                <FormErrorMessage>{errors.descripcion}</FormErrorMessage>
              </FormControl>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Módulo</FormLabel>
                  <Input
                    name="modulo"
                    value={formData.modulo}
                    onChange={handleChange}
                    placeholder="Ej: COMPRAS, PRODUCCION"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Documento de Origen</FormLabel>
                  <Input
                    name="documentoOrigen"
                    value={formData.documentoOrigen}
                    onChange={handleChange}
                    placeholder="Ej: OC-2023-001"
                  />
                </FormControl>
              </HStack>

              <Divider my={2} />

              <Box>
                <Flex justifyContent="space-between" alignItems="center" mb={2}>
                  <Text fontWeight="bold">Líneas del Asiento</Text>
                  <Button 
                    leftIcon={<AddIcon />} 
                    size="sm" 
                    colorScheme="blue" 
                    onClick={addLine}
                  >
                    Agregar Línea
                  </Button>
                </Flex>

                {errors.lineas && (
                  <Text color="red.500" mb={2}>{errors.lineas}</Text>
                )}

                {errors.balance && (
                  <Text color="red.500" mb={2}>{errors.balance}</Text>
                )}

                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Cuenta</Th>
                      <Th>Descripción</Th>
                      <Th isNumeric>Débito</Th>
                      <Th isNumeric>Crédito</Th>
                      <Th width="50px"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {formData.lineas.length === 0 ? (
                      <Tr>
                        <Td colSpan={5} textAlign="center">
                          No hay líneas. Haga clic en "Agregar Línea" para comenzar.
                        </Td>
                      </Tr>
                    ) : (
                      formData.lineas.map((linea, index) => (
                        <Tr key={index}>
                          <Td>
                            <FormControl isInvalid={!!lineErrors[index]?.cuentaCodigo}>
                              <Select
                                value={linea.cuentaCodigo}
                                onChange={(e) => handleLineChange(index, 'cuentaCodigo', e.target.value)}
                                placeholder="Seleccione una cuenta"
                                size="sm"
                              >
                                {Array.isArray(cuentas) ? cuentas.map(cuenta => (
                                  <option key={cuenta.codigo} value={cuenta.codigo}>
                                    {cuenta.codigo} - {cuenta.nombre}
                                  </option>
                                )) : <option value="">No hay cuentas disponibles</option>}
                              </Select>
                              {lineErrors[index]?.cuentaCodigo && (
                                <FormErrorMessage>{lineErrors[index]?.cuentaCodigo}</FormErrorMessage>
                              )}
                            </FormControl>
                          </Td>
                          <Td>
                            <Input
                              value={linea.descripcion}
                              onChange={(e) => handleLineChange(index, 'descripcion', e.target.value)}
                              placeholder="Descripción de la línea"
                              size="sm"
                            />
                          </Td>
                          <Td isNumeric>
                            <FormControl isInvalid={!!lineErrors[index]?.debito}>
                              <Input
                                type="number"
                                value={linea.debito || ''}
                                onChange={(e) => handleLineChange(index, 'debito', e.target.value)}
                                placeholder="0.00"
                                size="sm"
                                textAlign="right"
                              />
                              {lineErrors[index]?.debito && (
                                <FormErrorMessage>{lineErrors[index]?.debito}</FormErrorMessage>
                              )}
                            </FormControl>
                          </Td>
                          <Td isNumeric>
                            <FormControl isInvalid={!!lineErrors[index]?.credito}>
                              <Input
                                type="number"
                                value={linea.credito || ''}
                                onChange={(e) => handleLineChange(index, 'credito', e.target.value)}
                                placeholder="0.00"
                                size="sm"
                                textAlign="right"
                              />
                              {lineErrors[index]?.credito && (
                                <FormErrorMessage>{lineErrors[index]?.credito}</FormErrorMessage>
                              )}
                            </FormControl>
                          </Td>
                          <Td>
                            <IconButton
                              aria-label="Eliminar línea"
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => removeLine(index)}
                            />
                          </Td>
                        </Tr>
                      ))
                    )}
                    <Tr fontWeight="bold">
                      <Td colSpan={2} textAlign="right">Totales:</Td>
                      <Td isNumeric>{totalDebito.toFixed(2)}</Td>
                      <Td isNumeric>{totalCredito.toFixed(2)}</Td>
                      <Td>
                        {isBalanced ? (
                          <Badge colorScheme="green">Balanceado</Badge>
                        ) : (
                          <Badge colorScheme="red">Desbalanceado</Badge>
                        )}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          ) : (
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="bold">ID:</Text>
                <Text>{asiento?.id}</Text>
              </HStack>
              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="bold">Fecha:</Text>
                <Text>{new Date(asiento?.fecha || '').toLocaleDateString()}</Text>
              </HStack>
              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="bold">Descripción:</Text>
                <Text>{asiento?.descripcion}</Text>
              </HStack>
              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="bold">Módulo:</Text>
                <Text>{asiento?.modulo}</Text>
              </HStack>
              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="bold">Documento de Origen:</Text>
                <Text>{asiento?.documentoOrigen}</Text>
              </HStack>
              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="bold">Estado:</Text>
                <Badge colorScheme={
                  asiento?.estado === EstadoAsiento.BORRADOR ? 'yellow' :
                  asiento?.estado === EstadoAsiento.PUBLICADO ? 'green' : 'red'
                }>
                  {asiento?.estado}
                </Badge>
              </HStack>
              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="bold">Período Contable:</Text>
                <Text>{asiento?.periodoContable.nombre}</Text>
              </HStack>
              <Divider />

              <Text fontWeight="bold">Líneas del Asiento:</Text>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Cuenta</Th>
                    <Th>Descripción</Th>
                    <Th isNumeric>Débito</Th>
                    <Th isNumeric>Crédito</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {asiento?.lineas.length === 0 ? (
                    <Tr>
                      <Td colSpan={4} textAlign="center">No hay líneas en este asiento</Td>
                    </Tr>
                  ) : (
                    asiento?.lineas.map((linea, index) => (
                      <Tr key={index}>
                        <Td>{linea.cuentaCodigo} - {getCuentaNombre(linea.cuentaCodigo)}</Td>
                        <Td>{linea.descripcion}</Td>
                        <Td isNumeric>{linea.debito?.toFixed(2) || '0.00'}</Td>
                        <Td isNumeric>{linea.credito?.toFixed(2) || '0.00'}</Td>
                      </Tr>
                    ))
                  )}
                  <Tr fontWeight="bold">
                    <Td colSpan={2} textAlign="right">Totales:</Td>
                    <Td isNumeric>{totalDebito.toFixed(2)}</Td>
                    <Td isNumeric>{totalCredito.toFixed(2)}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          {isEditing ? (
            <>
              <Button 
                colorScheme="blue" 
                mr={3} 
                onClick={handleSubmit}
                isDisabled={!isBalanced}
              >
                Guardar
              </Button>
              <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            </>
          ) : (
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cerrar
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormularioAsiento;
