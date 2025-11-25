/**
 * Componente: DetalleProductoAdvanced
 * 
 * Ubicación en la navegación:
 * Productos > Definir Terminado/Semiterminado > Modificaciones > Ver Detalle (botón en tabla)
 * 
 * Descripción:
 * Versión avanzada del componente de detalle de producto que se abre al hacer clic en
 * "Ver Detalle" en la tabla de resultados de InformeProductosTabAdvanced.
 * Ofrece funcionalidades adicionales como pestañas para organizar la información,
 * visualización y gestión de insumos, exportación de datos y una interfaz mejorada.
 * 
 * Este componente es exclusivo para la sección de Definir Terminado/Semiterminado
 * y solo es accesible para usuarios con nivel de acceso 3 o superior.
 */

import {
    Flex, Box, Heading, Text, Button, VStack, HStack, 
    Grid, GridItem, Card, CardHeader, CardBody, 
    FormControl, Select, Input, Textarea, Tabs, TabList, Tab, TabPanels, TabPanel,
    useToast, useDisclosure, Badge, Divider, Table, Thead, Tbody, Tr, Th, Td,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {Material, Producto, Insumo} from "../../types.tsx";
import { ArrowBackIcon, EditIcon, DownloadIcon, AddIcon } from '@chakra-ui/icons';
import axios from 'axios';
import EndPointsURL from "../../../../api/EndPointsURL.tsx";
import { useAuth } from '../../../../context/AuthContext.tsx';
import {IVA_VALUES} from "../../types.tsx";
import {Authority} from "../../../../api/global_types.tsx";
import DeleteProductoDialog from './DeleteProductoDialog.tsx';

type Props = {
    producto: Producto;
    setEstado: (estado: number) => void;
    setProductoSeleccionado?: (producto: Producto) => void;
    refreshSearch?: () => void;
};

export default function DetalleProductoAdvanced({producto, setEstado, setProductoSeleccionado, refreshSearch}: Props) {
    const [editMode, setEditMode] = useState(false);
    const [productoData, setProductoData] = useState<Producto | Material>({...producto});
    const [productosAccessLevel, setProductosAccessLevel] = useState<number>(0);
    const [isFormValid, setIsFormValid] = useState<boolean>(true);
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState(0);
    const [insumos, setInsumos] = useState<Insumo[]>([]);
    const toast = useToast();
    const endPoints = new EndPointsURL();
    const { user } = useAuth();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    // Obtener el nivel de acceso del usuario para el módulo PRODUCTOS
    useEffect(() => {
        const fetchUserAccessLevel = async () => {
            try {
                const response = await axios.get(endPoints.whoami);
                const authorities = response.data.authorities;

                const productosAuthority = authorities.find(
                    (auth:Authority) => auth.authority === "ACCESO_PRODUCTOS"
                );

                if (productosAuthority) {
                    setProductosAccessLevel(parseInt(productosAuthority.nivel));
                }
            } catch (error) {
                console.error("Error al obtener el nivel de acceso:", error);
            }
        };

        fetchUserAccessLevel();

        // Si es un semiterminado o terminado, cargar sus insumos
        if (producto.tipo_producto === 'S' || producto.tipo_producto === 'T') {
            fetchInsumos();
        }
    }, []);

    // Función para cargar los insumos del producto (característica avanzada)
    const fetchInsumos = async () => {
        try {
            // Endpoint ficticio, ajustar según la API real
            const url = endPoints.get_insumos_producto?.replace('{productoId}', producto.productoId) || '';
            const response = await axios.get(url);
            setInsumos(response.data);
        } catch (error) {
            console.error("Error al obtener insumos:", error);
            // Si no hay endpoint real, podemos usar datos de ejemplo
            setInsumos([]);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            const url = endPoints.update_producto.replace('{productoId}', producto.productoId);
            await axios.delete(url);
            toast({
                title: 'Producto eliminado',
                description: 'El producto se eliminó correctamente.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setEstado(0);
            if (typeof refreshSearch === 'function') {
                refreshSearch();
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                toast({
                    title: 'No se puede eliminar el producto',
                    description: error.response.data?.error ||
                        'No se puede eliminar el producto porque está siendo utilizado en otros procesos',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error',
                    description: 'Ocurrió un error al eliminar el producto.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };

    const handleBack = () => {
        setEstado(0);
        if (typeof refreshSearch === 'function') {
            refreshSearch();
        }
    };

    // Manejar cambios en los campos editables
    const handleInputChange = (
        field: keyof (Producto | Material),
        value: string | number | boolean | undefined) =>
    {
        setProductoData({
            ...productoData,
            [field]: value
        });
    };

    // Validar datos antes de guardar
    const validateData = (showToast: boolean = true): boolean => {
        // Validar nombre
        const nombreValue = productoData.nombre;
        if (!nombreValue || 
            (typeof nombreValue === 'string' && nombreValue.trim() === '')) {
            if (showToast) {
                toast({
                    title: "Validación fallida",
                    description: "El nombre del producto es requerido.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
            }
            return false;
        }

        // Validar cantidad por unidad
        const cantidadUnidadValue = productoData.cantidadUnidad;
        if (!cantidadUnidadValue || 
            (typeof cantidadUnidadValue === 'string' && cantidadUnidadValue.trim() === '') ||
            (typeof cantidadUnidadValue === 'number' && cantidadUnidadValue <= 0)) {
            if (showToast) {
                toast({
                    title: "Validación fallida",
                    description: "La cantidad por unidad es requerida.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
            }
            return false;
        }

        // Validar IVA (debe ser un número entre 0 y 100)
        const iva = productoData.ivaPercentual !== undefined ? productoData.ivaPercentual : 0;
        if (isNaN(iva) || iva < 0 || iva > 100) {
            if (showToast) {
                toast({
                    title: "Validación fallida",
                    description: "El IVA debe ser un número entre 0 y 100.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
            }
            return false;
        }

        return true;
    };

    // Función para verificar si hay cambios en los datos
    const checkForChanges = () => {
        if (productoData.nombre !== producto.nombre ||
            productoData.cantidadUnidad !== producto.cantidadUnidad ||
            productoData.observaciones !== producto.observaciones ||
            productoData.ivaPercentual !== producto.ivaPercentual ||
            productoData.inventareable !== producto.inventareable) {
            return true;
        }

        return false;
    };

    // Validar el formulario y verificar cambios cuando cambian los datos
    useEffect(() => {
        if (editMode) {
            const isValid = validateData(false);
            setIsFormValid(isValid);

            const hasDataChanges = checkForChanges();
            setHasChanges(hasDataChanges);
        }
    }, [productoData, editMode]);

    // Guardar cambios
    const handleSaveChanges = async () => {
        if (!validateData()) {
            return;
        }

        try {
            const url = endPoints.update_producto.replace('{productoId}', productoData.productoId);
            const response = await axios.put(url, productoData);

            toast({
                title: 'Producto actualizado',
                description: 'Los datos del producto han sido actualizados exitosamente.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            setEditMode(false);
            setProductoData(response.data);

            if (typeof setProductoSeleccionado === 'function') {
                setProductoSeleccionado(response.data);
            }
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            toast({
                title: 'Error al actualizar',
                description: 'No se pudo actualizar la información del producto.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Verificar si el usuario tiene permisos para editar
    const canEdit = user === 'master' || productosAccessLevel >= 3;

    // Mapear tipo de producto a texto legible
    const getTipoProductoText = (tipo: string): string => {
        switch (tipo) {
            case 'S': return 'Semiterminado';
            case 'T': return 'Terminado';
            default: return 'Desconocido';
        }
    };

    // Función para exportar datos (característica avanzada)
    const handleExportData = () => {
        try {
            // Crear un objeto con los datos a exportar
            const exportData = {
                ...productoData,
                tipoProductoText: getTipoProductoText(productoData.tipo_producto),
                insumos: insumos
            };

            // Convertir a JSON
            const jsonString = JSON.stringify(exportData, null, 2);

            // Crear un blob y descargar
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `producto_${productoData.productoId}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            toast({
                title: 'Exportación exitosa',
                description: 'Los datos del producto han sido exportados correctamente.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error al exportar datos:', error);
            toast({
                title: 'Error de exportación',
                description: 'No se pudieron exportar los datos del producto.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={5} bg="white" borderRadius="md" boxShadow="base">
            <Flex justifyContent="space-between" alignItems="center" mb={5}>
                <Button 
                    leftIcon={<ArrowBackIcon />} 
                    colorScheme="blue" 
                    variant="outline"
                    onClick={handleBack}
                >
                    Regresar
                </Button>
                <Heading size="lg">Detalle Avanzado del Producto</Heading>
                <HStack>
                    {canEdit && !editMode && (
                        <Button 
                            leftIcon={<EditIcon />} 
                            colorScheme="green" 
                            onClick={() => setEditMode(true)}
                        >
                            Editar
                        </Button>
                    )}
                    {/* Botón de exportación - Característica avanzada */}
                    <Button
                        leftIcon={<DownloadIcon />}
                        colorScheme="teal"
                        onClick={handleExportData}
                    >
                        Exportar
                    </Button>
                </HStack>
            </Flex>

            {/* Tabs para organizar la información - Característica avanzada */}
            <Tabs colorScheme="blue" index={activeTab} onChange={setActiveTab} mb={4}>
                <TabList>
                    <Tab>Información General</Tab>
                    <Tab>Insumos</Tab>
                    <Tab>Historial</Tab>
                </TabList>

                <TabPanels>
                    {/* Tab 1: Información General */}
                    <TabPanel>
                        <Card mb={5} variant="outline" boxShadow="md">
                            <CardHeader bg="blue.50">
                                <Flex justifyContent="space-between" alignItems="center">
                                    <Heading size="md">{producto.nombre}</Heading>
                                    <Badge colorScheme={producto.tipo_producto === 'T' ? 'green' : 'purple'} p={2}>
                                        {getTipoProductoText(producto.tipo_producto)}
                                    </Badge>
                                </Flex>
                                <Text color="gray.600">ID: {producto.productoId}</Text>
                            </CardHeader>
                            <CardBody>
                                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                                    <GridItem>
                                        <VStack align="start" spacing={3}>
                                            <Box>
                                                <Text fontWeight="bold">Nombre:</Text>
                                                {editMode ? (
                                                    <FormControl mt={2}>
                                                        <Input
                                                            value={productoData.nombre}
                                                            onChange={(e) => handleInputChange('nombre', e.target.value)}
                                                        />
                                                    </FormControl>
                                                ) : (
                                                    <Text>{producto.nombre}</Text>
                                                )}
                                            </Box>
                                            <Box>
                                                <Text fontWeight="bold">Tipo de Producto:</Text>
                                                <Text>{getTipoProductoText(producto.tipo_producto)}</Text>
                                            </Box>
                                            <Box>
                                                <Text fontWeight="bold">Costo:</Text>
                                                <Text>{producto.costo}</Text>
                                            </Box>
                                            <Box>
                                                <Text fontWeight="bold">Inventariable:</Text>
                                                {editMode ? (
                                                    <FormControl mt={2}>
                                                        <Select
                                                            value={productoData.inventareable ? "true" : "false"}
                                                            onChange={(e) => handleInputChange('inventareable', e.target.value === "true")}
                                                        >
                                                            <option value="true">Sí</option>
                                                            <option value="false">No</option>
                                                        </Select>
                                                    </FormControl>
                                                ) : (
                                                    <Badge colorScheme={producto.inventareable ? "green" : "red"}>
                                                        {producto.inventareable ? "Sí" : "No"}
                                                    </Badge>
                                                )}
                                            </Box>
                                        </VStack>
                                    </GridItem>
                                    <GridItem>
                                        <VStack align="start" spacing={3}>
                                            <Box>
                                                <Text fontWeight="bold">Unidad de Medida:</Text>
                                                <Text>{producto.tipoUnidades}</Text>
                                            </Box>
                                            <Box>
                                                <Text fontWeight="bold">Cantidad por Unidad:</Text>
                                                {editMode ? (
                                                    <FormControl mt={2}>
                                                        <Input
                                                            value={productoData.cantidadUnidad}
                                                            onChange={(e) => handleInputChange('cantidadUnidad', e.target.value)}
                                                        />
                                                    </FormControl>
                                                ) : (
                                                    <Text>{producto.cantidadUnidad}</Text>
                                                )}
                                            </Box>
                                            <Box>
                                                <Text fontWeight="bold">IVA (%):</Text>
                                                {editMode ? (
                                                    <FormControl mt={2}>
                                                        <Select
                                                            value={productoData.ivaPercentual}
                                                            onChange={(e) =>
                                                                handleInputChange('ivaPercentual', Number(e.target.value))
                                                            }
                                                        >
                                                            <option value={IVA_VALUES.iva_0}> No Tiene </option>
                                                            <option value={IVA_VALUES.iva_5} > 5 %</option>
                                                            <option value={IVA_VALUES.iva_19} > 19 %</option>
                                                        </Select>
                                                    </FormControl>
                                                ) : (
                                                    <Text>{producto.ivaPercentual || 0}%</Text>
                                                )}
                                            </Box>
                                            {producto.fechaCreacion && (
                                                <Box>
                                                    <Text fontWeight="bold">Fecha de Creación:</Text>
                                                    <Text>{producto.fechaCreacion}</Text>
                                                </Box>
                                            )}
                                        </VStack>
                                    </GridItem>
                                </Grid>
                            </CardBody>
                        </Card>

                        <Card variant="outline" boxShadow="md">
                            <CardHeader bg="blue.50">
                                <Heading size="md">Observaciones</Heading>
                            </CardHeader>
                            <CardBody>
                                {editMode ? (
                                    <FormControl>
                                        <Textarea
                                            value={productoData.observaciones || ''}
                                            onChange={(e) => handleInputChange('observaciones', e.target.value)}
                                            placeholder="Ingrese observaciones sobre el producto"
                                            rows={4}
                                        />
                                    </FormControl>
                                ) : (
                                    <Text>{producto.observaciones || 'Sin observaciones'}</Text>
                                )}
                            </CardBody>
                        </Card>

                        {editMode && (
                            <Flex justifyContent="flex-end" mt={4}>
                                <HStack>
                                    <Button
                                        colorScheme="red"
                                        variant="outline"
                                        onClick={() => {
                                            setEditMode(false);
                                            setProductoData({...producto});
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        colorScheme="green"
                                        onClick={handleSaveChanges}
                                        isDisabled={!isFormValid || !hasChanges}
                                    >
                                        Guardar
                                    </Button>
                                    <Button colorScheme="red" onClick={onDeleteOpen}>
                                        Eliminar
                                    </Button>
                                </HStack>
                            </Flex>
                        )}
                    </TabPanel>

                    {/* Tab 2: Insumos */}
                    <TabPanel>
                        <Card variant="outline" boxShadow="md">
                            <CardHeader bg="blue.50">
                                <Flex justifyContent="space-between" alignItems="center">
                                    <Heading size="md">Insumos del Producto</Heading>
                                    {canEdit && (
                                        <Button leftIcon={<AddIcon />} colorScheme="green" size="sm">
                                            Agregar Insumo
                                        </Button>
                                    )}
                                </Flex>
                            </CardHeader>
                            <CardBody>
                                {insumos.length > 0 ? (
                                    <Table variant="simple" colorScheme="blue">
                                        <Thead>
                                            <Tr>
                                                <Th>ID</Th>
                                                <Th>Nombre</Th>
                                                <Th>Cantidad</Th>
                                                <Th>Subtotal</Th>
                                                <Th>Acciones</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {insumos.map((insumo, index) => (
                                                <Tr key={index}>
                                                    <Td>{insumo.producto.productoId}</Td>
                                                    <Td>{insumo.producto.nombre}</Td>
                                                    <Td>{insumo.cantidadRequerida}</Td>
                                                    <Td>{insumo.subtotal || 'N/A'}</Td>
                                                    <Td>
                                                        <Button size="xs" colorScheme="blue">Ver</Button>
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                ) : (
                                    <Text>No hay insumos registrados para este producto.</Text>
                                )}
                            </CardBody>
                        </Card>
                    </TabPanel>

                    {/* Tab 3: Historial */}
                    <TabPanel>
                        <Card variant="outline" boxShadow="md">
                            <CardHeader bg="blue.50">
                                <Heading size="md">Historial de Cambios</Heading>
                            </CardHeader>
                            <CardBody>
                                <Text>Característica en desarrollo. Aquí se mostrará el historial de cambios del producto.</Text>
                            </CardBody>
                        </Card>
                    </TabPanel>
                </TabPanels>
            </Tabs>

            <DeleteProductoDialog
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                onConfirm={handleDeleteProduct}
            />
        </Box>
    );
}
