// src/pages/Usuarios/InfoNiveles.tsx
import { useState, useEffect } from 'react';
import { 
  Box, 
  Input, 
  InputGroup, 
  InputLeftElement, 
  Text, 
  Heading, 
  Flex, 
  Tag, 
  TagLabel, 
  Accordion, 
  AccordionItem, 
  AccordionButton, 
  AccordionPanel, 
  AccordionIcon,
  Divider,
  Alert,
  AlertIcon,
  Code
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Modulo } from './GestionUsuarios/types';

// Documentación para cada módulo y nivel de acceso
const moduleDocs = {
  [Modulo.PRODUCTOS]: {
    title: 'Módulo de Productos',
    description: 'Gestión del catálogo de productos',
    implementationDetails: true,
    implementationCode: `
// Obtener el nivel de acceso
useEffect(() => {
    const fetchUserAccessLevel = async () => {
        try {
            const response = await axios.get<WhoAmIResponse>(endPoints.whoami);
            const authorities = response.data.authorities;

            // Buscar la autoridad para el módulo PRODUCTOS
            const productosAuthority = authorities.find(
                auth => auth.authority === "ACCESO_PRODUCTOS"
            );

            // Si se encuentra, establecer el nivel de acceso
            if (productosAuthority) {
                setProductosAccessLevel(parseInt(productosAuthority.nivel));
            }
        } catch (error) {
            console.error("Error al obtener el nivel de acceso:", error);
        }
    };

    fetchUserAccessLevel();
}, []);

// Renderizado condicional de pestañas
<TabList>
    {/* Solo mostrar las pestañas de creación si el usuario es master o tiene nivel 2 o superior */}
    {(user === 'master' || productosAccessLevel >= 2) && (
        <Tab sx={my_style_tab}>Codificar Material</Tab>
    )}
    <Tab sx={my_style_tab}>Consulta</Tab>
    {(user === 'master' || productosAccessLevel >= 2) && (
        <Tab sx={my_style_tab}>Crear Terminado/Semiterminado</Tab>
    )}
</TabList>`,
    levels: [
      { level: 1, description: 'Solo permite acceder a la pestaña de "Consulta" para visualizar productos existentes.' },
      { level: 2, description: 'Permite acceder a todas las pestañas, incluyendo "Codificar Material" y "Crear Terminado/Semiterminado".' },
      { level: 3, description: 'Acceso completo a todas las funcionalidades del módulo.' }
    ]
  },
  [Modulo.COMPRAS]: {
    title: 'Módulo de Compras',
    description: 'Gestión de órdenes de compra y adquisiciones',
    implementationDetails: true,
    implementationCode: `
// Solo mostrar la opción de actualizar estado si el usuario es master o tiene nivel de acceso 2 o superior
{(user === 'master' || comprasAccessLevel >= 2) && (
    <Box
        p={1}
        _hover={{ bg: 'gray.100', cursor: 'pointer' }}
        onClick={handleActualizarOrden}
    >
        Actualizar Estado de la Orden
    </Box>
)}`,
    levels: [
      { level: 1, description: 'Permite visualizar órdenes de compra pero con funcionalidades limitadas.' },
      { level: 2, description: 'Permite acceder a todas las funcionalidades, incluyendo la actualización del estado de las órdenes de compra.' },
      { level: 3, description: 'Acceso completo a todas las funcionalidades del módulo.' }
    ]
  },
  [Modulo.PROVEEDORES]: {
    title: 'Módulo de Proveedores',
    description: 'Gestión de proveedores y sus catálogos',
    implementationDetails: true,
    implementationCode: `
// Obtener el nivel de acceso
useEffect(() => {
    const fetchUserAccessLevel = async () => {
        try {
            const response = await axios.get<WhoAmIResponse>(endPoints.whoami);
            const authorities = response.data.authorities;

            // Buscar la autoridad para el módulo PROVEEDORES
            const proveedoresAuthority = authorities.find(
                auth => auth.authority === "ACCESO_PROVEEDORES"
            );

            // Si se encuentra, establecer el nivel de acceso
            if (proveedoresAuthority) {
                setProveedoresAccessLevel(parseInt(proveedoresAuthority.nivel));
            }
        } catch (error) {
            console.error("Error al obtener el nivel de acceso:", error);
        }
    };

    fetchUserAccessLevel();
}, []);

// Renderizado condicional de pestañas
<TabList>
    {/* Solo mostrar la pestaña de codificar si el usuario es master o tiene nivel 2 o superior */}
    {(user === 'master' || proveedoresAccessLevel >= 2) && (
        <Tab sx={my_style_tab}> Codificar Proveedor </Tab>
    )}
    <Tab sx={my_style_tab}> Consultar Proveedores </Tab>
</TabList>`,
    levels: [
      { level: 1, description: 'Solo permite acceder a la pestaña de "Consultar Proveedores" para visualizar proveedores existentes.' },
      { level: 2, description: 'Permite acceder a todas las pestañas, incluyendo "Codificar Proveedor" para crear nuevos proveedores.' },
      { level: 3, description: 'Acceso completo a todas las funcionalidades del módulo.' }
    ]
  },
  [Modulo.USUARIOS]: {
    title: 'Módulo de Usuarios',
    description: 'Gestión de usuarios y asignación de accesos',
    implementationDetails: false,
    levels: [
      { level: 1, description: 'Visualización de usuarios existentes.' },
      { level: 2, description: 'Creación y modificación de usuarios.' },
      { level: 3, description: 'Gestión completa de usuarios y sus accesos.' }
    ]
  },
  [Modulo.PRODUCCION]: {
    title: 'Módulo de Producción',
    description: 'Gestión de órdenes de producción y procesos productivos',
    implementationDetails: false,
    levels: [
      { level: 1, description: 'Visualización de información de producción.' },
      { level: 2, description: 'Creación y modificación de órdenes de producción.' },
      { level: 3, description: 'Gestión completa del proceso productivo.' }
    ]
  },
  [Modulo.STOCK]: {
    title: 'Módulo de Stock',
    description: 'Gestión de inventario y existencias',
    implementationDetails: false,
    levels: [
      { level: 1, description: 'Visualización de niveles de stock.' },
      { level: 2, description: 'Registro de movimientos de inventario.' },
      { level: 3, description: 'Control total del inventario.' }
    ]
  },
  [Modulo.SEGUIMIENTO_PRODUCCION]: {
    title: 'Módulo de Seguimiento de Producción',
    description: 'Monitoreo y seguimiento de procesos productivos',
    implementationDetails: false,
    levels: [
      { level: 1, description: 'Visualización del estado de producción.' },
      { level: 2, description: 'Registro de avances de producción.' },
      { level: 3, description: 'Control total del seguimiento productivo.' }
    ]
  },
  [Modulo.TRANSACCIONES_ALMACEN]: {
    title: 'Módulo de Transacciones de Almacén',
    description: 'Gestión de movimientos y transacciones en almacén',
    implementationDetails: false,
    levels: [
      { level: 1, description: 'Visualización de transacciones.' },
      { level: 2, description: 'Registro de entradas y salidas.' },
      { level: 3, description: 'Control total de operaciones de almacén.' }
    ]
  },
  [Modulo.ACTIVOS]: {
    title: 'Módulo de Activos',
    description: 'Gestión de activos fijos y equipamiento',
    implementationDetails: false,
    levels: [
      { level: 1, description: 'Visualización de activos.' },
      { level: 2, description: 'Registro y modificación de activos.' },
      { level: 3, description: 'Control total de activos.' }
    ]
  },
  [Modulo.CONTABILIDAD]: {
    title: 'Módulo de Contabilidad',
    description: 'Gestión contable y financiera',
    implementationDetails: false,
    levels: [
      { level: 1, description: 'Visualización de información contable.' },
      { level: 2, description: 'Registro de asientos contables.' },
      { level: 3, description: 'Control total de la gestión contable.' }
    ]
  },
  [Modulo.PERSONAL_PLANTA]: {
    title: 'Módulo de Personal de Planta',
    description: 'Gestión del personal operativo',
    implementationDetails: false,
    levels: [
      { level: 1, description: 'Visualización de información del personal.' },
      { level: 2, description: 'Registro y modificación de información del personal.' },
      { level: 3, description: 'Control total de la gestión de personal.' }
    ]
  },
  [Modulo.BINTELLIGENCE]: {
    title: 'Módulo de Business Intelligence',
    description: 'Análisis de datos y reportes avanzados',
    implementationDetails: false,
    levels: [
      { level: 1, description: 'Visualización de reportes predefinidos.' },
      { level: 2, description: 'Creación de reportes personalizados.' },
      { level: 3, description: 'Acceso total a herramientas de análisis.' }
    ]
  },
  [Modulo.ADMINISTRACION_ALERTAS]: {
    title: 'Módulo de Administración de Alertas',
    description: 'Gestión de notificaciones y alertas del sistema',
    implementationDetails: false,
    levels: [
      { level: 1, description: 'Visualización de alertas.' },
      { level: 2, description: 'Configuración de alertas.' },
      { level: 3, description: 'Administración completa del sistema de alertas.' }
    ]
  },
  [Modulo.CRONOGRAMA]: {
    title: 'Módulo de Cronograma',
    description: 'Gestión de planificación y cronogramas',
    implementationDetails: false,
    levels: [
      { level: 1, description: 'Visualización de cronogramas.' },
      { level: 2, description: 'Creación y modificación de eventos en cronogramas.' },
      { level: 3, description: 'Control total de la planificación.' }
    ]
  }
};

export default function InfoNiveles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredModules, setFilteredModules] = useState(Object.keys(moduleDocs));

  useEffect(() => {
    if (searchTerm) {
      const filtered = Object.keys(moduleDocs).filter(key => 
        key.toLowerCase().includes(searchTerm.toLowerCase()) || 
        moduleDocs[key].title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        moduleDocs[key].description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredModules(filtered);
    } else {
      setFilteredModules(Object.keys(moduleDocs));
    }
  }, [searchTerm]);

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Documentación de Niveles de Acceso</Heading>

      <Alert status="info" mb={4} variant="left-accent" borderRadius="md">
        <AlertIcon alignSelf="flex-start" mt={1} />
        <Box width="100%">
          <Heading size="sm" mb={2} textAlign="left">Información General</Heading>
          <Text mb={3} textAlign="left">
            El sistema utiliza 3 niveles de acceso para controlar las funcionalidades disponibles en cada módulo:
          </Text>
          <Flex direction="column" gap={2} ml={2} mb={3}>
            <Flex align="center">
              <Tag size="sm" colorScheme="green" mr={2} minW="60px" justifyContent="center">Nivel 1</Tag>
              <Text>Acceso básico (solo consulta)</Text>
            </Flex>
            <Flex align="center">
              <Tag size="sm" colorScheme="blue" mr={2} minW="60px" justifyContent="center">Nivel 2</Tag>
              <Text>Acceso avanzado (consulta y creación/modificación)</Text>
            </Flex>
            <Flex align="center">
              <Tag size="sm" colorScheme="purple" mr={2} minW="60px" justifyContent="center">Nivel 3</Tag>
              <Text>Acceso completo (todas las funcionalidades)</Text>
            </Flex>
          </Flex>
          <Text textAlign="left">
            El usuario 'master' tiene acceso completo a todas las funcionalidades independientemente de los niveles.
          </Text>
        </Box>
      </Alert>

      <InputGroup mb={6}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input 
          placeholder="Buscar módulo..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <Accordion allowMultiple>
        {filteredModules.map(moduleKey => (
          <AccordionItem key={moduleKey}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Text fontWeight="bold">{moduleDocs[moduleKey].title}</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text mb={4}>{moduleDocs[moduleKey].description}</Text>

              <Heading size="sm" mb={2}>Niveles de Acceso:</Heading>
              {moduleDocs[moduleKey].levels.map(level => (
                <Box key={level.level} mb={2} p={2} bg="gray.50" borderRadius="md">
                  <Flex align="center">
                    <Tag size="md" colorScheme={getColorSchemeForLevel(level.level)} mr={2}>
                      <TagLabel>Nivel {level.level}</TagLabel>
                    </Tag>
                    <Text>{level.description}</Text>
                  </Flex>
                </Box>
              ))}

              {moduleDocs[moduleKey].implementationDetails && (
                <>
                  <Divider my={4} />
                  <Heading size="sm" mb={2}>Implementación:</Heading>
                  <Box bg="gray.50" p={3} borderRadius="md" overflowX="auto">
                    <Code display="block" whiteSpace="pre" p={2}>
                      {moduleDocs[moduleKey].implementationCode}
                    </Code>
                  </Box>
                </>
              )}

              <Divider my={4} />

              <Box mt={2}>
                <Text fontSize="sm" color="gray.600">
                  Nota: Los niveles de acceso son acumulativos. Un usuario con nivel 3 también tiene los permisos de los niveles 1 y 2.
                </Text>
              </Box>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
}

// Función para asignar colores a los niveles
function getColorSchemeForLevel(level: number): string {
  switch (level) {
    case 1: return "green";
    case 2: return "blue";
    case 3: return "purple";
    default: return "gray";
  }
}
