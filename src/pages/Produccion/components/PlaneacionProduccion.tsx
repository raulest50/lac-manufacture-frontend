import React from 'react';
import {
  Box,
  Button,
  VStack,
  Heading,
  Text
} from '@chakra-ui/react';
import MPS from './MPS.tsx';
import { Terminado } from '../types.tsx';
import { MPSColors } from './colors.tsx';

// Datos ficticios para poblar la tabla con nombres más realistas
const mockTerminados: Terminado[] = [
  {
    productoId: "T001",
    tipo_producto: "T",
    nombre: "Shampoo Rizo Kids 1L",
    costo: 15000,
    tipoUnidades: "U",
    cantidadUnidad: "1",
    insumos: [
      {
        cantidadRequerida: 2,
        producto: {
          productoId: "M001",
          tipo_producto: "M",
          nombre: "Base Shampoo",
          costo: 5000,
          tipoUnidades: "KG",
          cantidadUnidad: "1"
        }
      }
    ],
    procesoProduccion: {
      procesoId: 1,
      procesoNodes: [
        {
          Id: 1,
          type: "proceso",
          localId: "p1",
          label: "Proceso 1",
          x: 100,
          y: 100,
          descripcionSalida: "Salida del proceso 1"
        }
      ],
      materiaPrimaNodes: [
        {
          Id: 2,
          type: "materiaPrima",
          localId: "mp1",
          label: "Base Shampoo",
          x: 50,
          y: 50
        }
      ],
      targetNode: {
        Id: 3,
        type: "target",
        localId: "t1",
        label: "Shampoo Rizo Kids 1L",
        x: 150,
        y: 150
      }
    }
  },
  {
    productoId: "T002",
    tipo_producto: "T",
    nombre: "Tratamiento Cebolla 1L",
    costo: 25000,
    tipoUnidades: "U",
    cantidadUnidad: "1",
    insumos: [
      {
        cantidadRequerida: 3,
        producto: {
          productoId: "M002",
          tipo_producto: "M",
          nombre: "Extracto de Cebolla",
          costo: 7000,
          tipoUnidades: "L",
          cantidadUnidad: "1"
        }
      }
    ],
    procesoProduccion: {
      procesoId: 2,
      procesoNodes: [
        {
          Id: 4,
          type: "proceso",
          localId: "p2",
          label: "Proceso 2",
          x: 200,
          y: 200,
          descripcionSalida: "Salida del proceso 2"
        }
      ],
      materiaPrimaNodes: [
        {
          Id: 5,
          type: "materiaPrima",
          localId: "mp2",
          label: "Extracto de Cebolla",
          x: 150,
          y: 150
        }
      ],
      targetNode: {
        Id: 6,
        type: "target",
        localId: "t2",
        label: "Tratamiento Cebolla 1L",
        x: 250,
        y: 250
      }
    }
  },
  {
    productoId: "T003",
    tipo_producto: "T",
    nombre: "Shampoo Coco Repair 500ml",
    costo: 30000,
    tipoUnidades: "U",
    cantidadUnidad: "1",
    insumos: [
      {
        cantidadRequerida: 1,
        producto: {
          productoId: "M003",
          tipo_producto: "M",
          nombre: "Aceite de Coco",
          costo: 10000,
          tipoUnidades: "KG",
          cantidadUnidad: "1"
        }
      }
    ],
    procesoProduccion: {
      procesoId: 3,
      procesoNodes: [
        {
          Id: 7,
          type: "proceso",
          localId: "p3",
          label: "Proceso 3",
          x: 300,
          y: 300,
          descripcionSalida: "Salida del proceso 3"
        }
      ],
      materiaPrimaNodes: [
        {
          Id: 8,
          type: "materiaPrima",
          localId: "mp3",
          label: "Aceite de Coco",
          x: 250,
          y: 250
        }
      ],
      targetNode: {
        Id: 9,
        type: "target",
        localId: "t3",
        label: "Shampoo Coco Repair 500ml",
        x: 350,
        y: 350
      }
    }
  }
];

const PlaneacionProduccion: React.FC = () => {
  // Función para calcular órdenes de producción (sin implementar aún)
  const calcularOrdenesProduccion = () => {
    console.log("Calculando órdenes de producción necesarias...");
    // Aquí iría la lógica para calcular las órdenes de producción
    alert("Funcionalidad en desarrollo");
  };

  return (
    <VStack spacing={6} align="stretch" bg={MPSColors.fondoGeneral}>
      <Heading size="md" color={MPSColors.tituloColumnas}>Master Production Schedule (MPS)</Heading>
      <Text color={MPSColors.textoTarjetas}>
        Planifique la producción semanal de terminados. Agregue los productos a producir cada día y sus cantidades.
      </Text>

      {/* Componente MPS */}
      <MPS terminados={mockTerminados} />

      {/* Botón para calcular órdenes de producción */}
      <Box textAlign="right" mt={4}>
        <Button 
          bg={MPSColors.botonAgregar} 
          color="white"
          size="lg"
          onClick={calcularOrdenesProduccion}
        >
          Calcular Órdenes de Producción
        </Button>
      </Box>
    </VStack>
  );
};

export default PlaneacionProduccion;
