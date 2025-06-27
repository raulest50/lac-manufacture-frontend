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
  Switch,
  FormErrorMessage,
  VStack,
  HStack,
  Text,
  Divider
} from '@chakra-ui/react';
import { CuentaContable, SaldoNormal, TipoCuenta } from '../types';

interface DetalleCuentaProps {
  isOpen: boolean;
  onClose: () => void;
  cuenta: CuentaContable | null;
  isEditing: boolean;
  onSave: (cuenta: CuentaContable) => void;
}

const DetalleCuenta: React.FC<DetalleCuentaProps> = ({
  isOpen,
  onClose,
  cuenta,
  isEditing,
  onSave
}) => {
  const [formData, setFormData] = useState<CuentaContable>({
    codigo: '',
    nombre: '',
    tipo: TipoCuenta.ACTIVO,
    saldoNormal: SaldoNormal.DEBITO,
    cuentaControl: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cuenta) {
      setFormData(cuenta);
    } else {
      // Default values for new account
      setFormData({
        codigo: '',
        nombre: '',
        tipo: TipoCuenta.ACTIVO,
        saldoNormal: SaldoNormal.DEBITO,
        cuentaControl: false
      });
    }
  }, [cuenta]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.codigo) {
      newErrors.codigo = 'El código es requerido';
    } else if (formData.codigo.length > 10) {
      newErrors.codigo = 'El código no puede tener más de 10 caracteres';
    }
    
    if (!formData.nombre) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditing 
            ? cuenta 
              ? `Editar Cuenta: ${cuenta.codigo}` 
              : 'Nueva Cuenta Contable'
            : `Detalle de Cuenta: ${cuenta?.codigo}`
          }
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isEditing ? (
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!errors.codigo} isDisabled={!!cuenta}>
                <FormLabel>Código</FormLabel>
                <Input
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  placeholder="Ej: 1000"
                />
                <FormErrorMessage>{errors.codigo}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.nombre}>
                <FormLabel>Nombre</FormLabel>
                <Input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Caja"
                />
                <FormErrorMessage>{errors.nombre}</FormErrorMessage>
              </FormControl>
              
              <FormControl>
                <FormLabel>Tipo de Cuenta</FormLabel>
                <Select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                >
                  {Object.values(TipoCuenta).map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Saldo Normal</FormLabel>
                <Select
                  name="saldoNormal"
                  value={formData.saldoNormal}
                  onChange={handleChange}
                >
                  {Object.values(SaldoNormal).map(saldo => (
                    <option key={saldo} value={saldo}>{saldo}</option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Cuenta Control</FormLabel>
                <Switch
                  name="cuentaControl"
                  isChecked={formData.cuentaControl}
                  onChange={handleSwitchChange}
                />
              </FormControl>
            </VStack>
          ) : (
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="bold">Código:</Text>
                <Text>{cuenta?.codigo}</Text>
              </HStack>
              <Divider />
              
              <HStack justify="space-between">
                <Text fontWeight="bold">Nombre:</Text>
                <Text>{cuenta?.nombre}</Text>
              </HStack>
              <Divider />
              
              <HStack justify="space-between">
                <Text fontWeight="bold">Tipo de Cuenta:</Text>
                <Text>{cuenta?.tipo}</Text>
              </HStack>
              <Divider />
              
              <HStack justify="space-between">
                <Text fontWeight="bold">Saldo Normal:</Text>
                <Text>{cuenta?.saldoNormal}</Text>
              </HStack>
              <Divider />
              
              <HStack justify="space-between">
                <Text fontWeight="bold">Cuenta Control:</Text>
                <Text>{cuenta?.cuentaControl ? 'Sí' : 'No'}</Text>
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
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cerrar
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetalleCuenta;