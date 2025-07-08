import React, { useState, useEffect } from 'react';
import {
  Box, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Text, 
  Flex, 
  Button, 
  useDisclosure, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Select,
  VStack,
  HStack,
  IconButton
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Terminado } from '../types';
import { MPSColors } from './colors';

// Interfaces para la planificación de producción
interface TerminadoPlanificado {
  terminado: Terminado;
  cantidad: number;
}

// Interfaz para la planificación diaria
interface PlanificacionDiaria {
  fecha: Date;
  terminados: TerminadoPlanificado[];
}

// Interfaz para la planificación semanal
interface PlanificacionSemanal {
  [key: string]: PlanificacionDiaria;
}

// Props para el componente MPS
interface MPSProps {
  terminados: Terminado[];
}

const MPS: React.FC<MPSProps> = ({ terminados }) => {
  // Estado para almacenar la planificación semanal
  const [planificacion, setPlanificacion] = useState<PlanificacionSemanal>({});

  // Estado para la semana actual
  const [semanaActual, setSemanaActual] = useState<Date[]>([]);

  // Estados para el modal de agregar terminado
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [diaSeleccionado, setDiaSeleccionado] = useState<Date | null>(null);
  const [terminadoSeleccionado, setTerminadoSeleccionado] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(0);

  // Inicializar la semana actual y cargar terminados al montar el componente
  useEffect(() => {
    inicializarSemana();
  }, []);

  // Función para inicializar la semana actual
  const inicializarSemana = () => {
    const hoy = new Date();
    const inicioDeSemana = startOfWeek(hoy, { weekStartsOn: 1 }); // 1 = lunes

    const diasDeLaSemana = [];
    const nuevaPlanificacion: PlanificacionSemanal = {};

    // Crear array con los días de la semana (lunes a sábado)
    for (let i = 0; i < 6; i++) {
      const dia = addDays(inicioDeSemana, i);
      diasDeLaSemana.push(dia);

      // Inicializar la planificación para cada día
      const fechaKey = format(dia, 'yyyy-MM-dd');
      nuevaPlanificacion[fechaKey] = {
        fecha: dia,
        terminados: []
      };
    }

    setSemanaActual(diasDeLaSemana);

    // Agregar datos ficticios para visualización
    const mockPlanificacion = { ...nuevaPlanificacion };

    // Lunes - Terminados
    if (terminados.length >= 2) {
      const lunesKey = format(diasDeLaSemana[0], 'yyyy-MM-dd');
      mockPlanificacion[lunesKey].terminados = [
        { terminado: terminados[0], cantidad: 50 },
        { terminado: terminados[1], cantidad: 30 }
      ];
    }

    // Martes - Terminado
    if (terminados.length >= 3) {
      const martesKey = format(diasDeLaSemana[1], 'yyyy-MM-dd');
      mockPlanificacion[martesKey].terminados = [
        { terminado: terminados[2], cantidad: 25 }
      ];
    }

    // Miércoles - Terminados
    if (terminados.length >= 3) {
      const miercolesKey = format(diasDeLaSemana[2], 'yyyy-MM-dd');
      mockPlanificacion[miercolesKey].terminados = [
        { terminado: terminados[0], cantidad: 40 },
        { terminado: terminados[2], cantidad: 15 }
      ];
    }

    // Jueves - Terminado
    if (terminados.length >= 2) {
      const juevesKey = format(diasDeLaSemana[3], 'yyyy-MM-dd');
      mockPlanificacion[juevesKey].terminados = [
        { terminado: terminados[1], cantidad: 60 }
      ];
    }

    // Viernes - Todos los terminados
    if (terminados.length >= 3) {
      const viernesKey = format(diasDeLaSemana[4], 'yyyy-MM-dd');
      mockPlanificacion[viernesKey].terminados = [
        { terminado: terminados[0], cantidad: 20 },
        { terminado: terminados[1], cantidad: 25 },
        { terminado: terminados[2], cantidad: 30 }
      ];
    }

    setPlanificacion(mockPlanificacion);
  };

  // Función para abrir el modal de agregar terminado
  const abrirModalAgregarTerminado = (dia: Date) => {
    setDiaSeleccionado(dia);
    onOpen();
  };

  // Función para agregar un terminado a la planificación
  const agregarTerminado = () => {
    if (!diaSeleccionado || !terminadoSeleccionado || cantidad <= 0) return;

    const fechaKey = format(diaSeleccionado, 'yyyy-MM-dd');
    const terminadoObj = terminados.find(t => t.productoId === terminadoSeleccionado);

    if (!terminadoObj) return;

    const nuevoTerminado: TerminadoPlanificado = {
      terminado: terminadoObj,
      cantidad
    };

    setPlanificacion(prev => ({
      ...prev,
      [fechaKey]: {
        ...prev[fechaKey],
        terminados: [...prev[fechaKey].terminados, nuevoTerminado]
      }
    }));

    // Limpiar el formulario y cerrar el modal
    setTerminadoSeleccionado('');
    setCantidad(0);
    onClose();
  };

  // Función para eliminar un terminado de la planificación
  const eliminarTerminado = (fechaKey: string, productoId: string) => {
    setPlanificacion(prev => ({
      ...prev,
      [fechaKey]: {
        ...prev[fechaKey],
        terminados: prev[fechaKey].terminados.filter(t => t.terminado.productoId !== productoId)
      }
    }));
  };

  // Verificar si un día es el día actual
  const esDiaActual = (dia: Date) => {
    const hoy = new Date();
    return isSameDay(dia, hoy);
  };

  // Renderizar las celdas de terminados para un día específico
  const renderizarCeldaTerminados = (dia: Date) => {
    const fechaKey = format(dia, 'yyyy-MM-dd');
    const terminadosDelDia = planificacion[fechaKey]?.terminados || [];
    const esHoy = esDiaActual(dia);

    return (
      <Td 
        key={fechaKey} 
        height="auto" 
        verticalAlign="top" 
        border="1px solid" 
        borderColor={esHoy ? MPSColors.diaActualBorde : MPSColors.bordesCeldas}
        bg={esHoy ? MPSColors.diaActualFondo : MPSColors.fondoCeldas}
        _hover={{ bg: MPSColors.hoverCeldas }}
      >
        <VStack align="stretch" spacing={2}>
          {terminadosDelDia.map(terminado => (
            <HStack 
              key={terminado.terminado.productoId} 
              p={1} 
              bg={MPSColors.fondoTarjetas} 
              borderRadius="md" 
              justify="space-between"
              _hover={{ bg: MPSColors.hoverTarjeta }}
            >
              <Box>
                <Text fontSize="sm" fontWeight="bold" color={MPSColors.textoTarjetas}>
                  {terminado.terminado.nombre}
                </Text>
                <Text fontSize="xs" color={MPSColors.textoTarjetas}>
                  {terminado.cantidad} unidades
                </Text>
              </Box>
              <IconButton
                aria-label="Eliminar terminado"
                icon={<DeleteIcon />}
                size="xs"
                color={MPSColors.iconoEliminar}
                variant="ghost"
                onClick={() => eliminarTerminado(fechaKey, terminado.terminado.productoId)}
              />
            </HStack>
          ))}
          <Button 
            leftIcon={<AddIcon />} 
            size="sm" 
            color={MPSColors.botonAgregar}
            variant="ghost"
            onClick={() => abrirModalAgregarTerminado(dia)}
          >
            Agregar
          </Button>
        </VStack>
      </Td>
    );
  };

  return (
    <Box bg={MPSColors.fondoGeneral} p={4} borderRadius="md">
      <Flex justify="space-between" align="center" mb={4} bg={MPSColors.fondoCabecera} p={3} borderRadius="md">
        <Text fontSize="xl" fontWeight="bold" color={MPSColors.textoCabecera}>
          Semana: {format(semanaActual[0] || new Date(), 'dd MMMM', { locale: es })} 
          - {format(semanaActual[5] || new Date(), 'dd MMMM', { locale: es })}
        </Text>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              {semanaActual.map(dia => {
                const esHoy = esDiaActual(dia);
                return (
                  <Th 
                    key={format(dia, 'yyyy-MM-dd')} 
                    textAlign="center"
                    color={esHoy ? MPSColors.diaActualBorde : MPSColors.tituloColumnas}
                    borderColor={esHoy ? MPSColors.diaActualBorde : MPSColors.divisor}
                    bg={esHoy ? MPSColors.diaActualFondo : 'transparent'}
                  >
                    <Text>{format(dia, 'EEEE', { locale: es })}</Text>
                    <Text fontSize="sm">{format(dia, 'dd MMM', { locale: es })}</Text>
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              {semanaActual.map(dia => renderizarCeldaTerminados(dia))}
            </Tr>
          </Tbody>
        </Table>
      </Box>

      {/* Modal para agregar terminado */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Agregar Terminado para {diaSeleccionado ? format(diaSeleccionado, 'EEEE dd MMMM', { locale: es }) : ''}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4}>
              <FormLabel>Terminado</FormLabel>
              <Select 
                placeholder="Seleccionar terminado" 
                value={terminadoSeleccionado}
                onChange={(e) => setTerminadoSeleccionado(e.target.value)}
              >
                {terminados.map(terminado => (
                  <option key={terminado.productoId} value={terminado.productoId}>
                    {terminado.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Cantidad</FormLabel>
              <NumberInput min={1} value={cantidad} onChange={(_, value) => setCantidad(value)}>
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <Flex justify="flex-end" mt={6}>
              <Button bg={MPSColors.botonAgregar} color="white" mr={3} onClick={agregarTerminado}>
                Agregar
              </Button>
              <Button onClick={onClose}>Cancelar</Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MPS;
