import {
    Card,
    CardHeader,
    HStack,
    IconButton,
    Heading,
    Divider,
    CardBody,
    VStack,
    Text,
    Flex,
    Box,
    Tag,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Spinner,
    Collapse,
    Button,
} from '@chakra-ui/react';
import { FaSearch, FaChevronDown, FaChevronUp, FaList } from 'react-icons/fa';
import { ProductoWithInsumos, InsumoWithStock } from '../types';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EndPointsURL from '../../../api/EndPointsURL';

interface TerSemiTerCardProps {
    productoSeleccionado: ProductoWithInsumos | null;
    canProduce: boolean;
    onSearchClick: () => void;
    cantidadAProducir?: number;
}

type InsumoWithStockResponse = Omit<InsumoWithStock, 'tipo_producto'> & {
    tipo_producto?: string;
    tipoProducto?: string;
};

const TerSemiTerCard = ({ productoSeleccionado, canProduce, onSearchClick, cantidadAProducir = 1 }: TerSemiTerCardProps) => {
    const producto = productoSeleccionado?.producto;
    const insumos = productoSeleccionado?.insumos ?? [];
    const endPoints = new EndPointsURL();

    // Estado para almacenar los materiales de los semiterminados
    const [semiterminadosMateriales, setSemiterminadosMateriales] = useState<Record<number, InsumoWithStock[]>>({});
    const [loadingSemiterminados, setLoadingSemiterminados] = useState<Record<number, boolean>>({});

    // Estado para controlar qué semiterminados están expandidos
    const [expandedSemiterminados, setExpandedSemiterminados] = useState<Record<number, boolean>>({});

    // Función para obtener la unidad de medida (UMB)
    // En una implementación real, esto debería venir del backend
    const obtenerUMB = (productoId: number): string => {
        // Por defecto retornamos "KG", pero esto debería ser reemplazado
        // con la lógica real para obtener la unidad de medida
        return "KG";
    };

    // Función para calcular la cantidad ajustada según la cantidad a producir
    const calcularCantidadAjustada = (cantidadBase: number): number => {
        return cantidadBase * cantidadAProducir;
    };

    // Verificar si hay suficiente stock para la cantidad ajustada
    const verificarStockSuficiente = (insumo: InsumoWithStock): boolean => {
        const cantidadAjustada = calcularCantidadAjustada(insumo.cantidadRequerida);
        return insumo.stockActual >= cantidadAjustada;
    };

    // Función para cargar los materiales de un semiterminado
    const cargarMaterialesSemiterminado = async (insumoId: number, productoId: number) => {
        // Marcar como cargando
        setLoadingSemiterminados(prev => ({ ...prev, [insumoId]: true }));

        try {
            const url = endPoints.insumos_with_stock.replace('{id}', encodeURIComponent(String(productoId)));
            const response = await axios.get<
                InsumoWithStockResponse[] | { content?: InsumoWithStockResponse[] }
            >(url);
            const data = response.data;
            const materialesSinNormalizar = Array.isArray(data) ? data : data.content ?? [];
            const materiales = materialesSinNormalizar.map(material => ({
                ...material,
                tipo_producto: material.tipo_producto ?? material.tipoProducto ?? '',
            }));

            // Guardar los materiales en el estado
            setSemiterminadosMateriales(prev => ({ ...prev, [insumoId]: materiales }));
        } catch (error) {
            console.error('Error al cargar los materiales del semiterminado:', error);
            // En caso de error, establecer un array vacío
            setSemiterminadosMateriales(prev => ({ ...prev, [insumoId]: [] }));
        } finally {
            // Marcar como no cargando
            setLoadingSemiterminados(prev => ({ ...prev, [insumoId]: false }));
        }
    };

    // Función para determinar si un insumo es un semiterminado
    const esSemiterminado = (insumo: InsumoWithStock): boolean => {
        if (insumo.tipo_producto === 'S') {
            return true;
        }

        // Respaldo para datos antiguos que aún no tengan la clasificación explícita
        return insumo.productoNombre.toUpperCase().includes('SEMI');
    };

    // Función para manejar el clic en el botón de expandir/colapsar
    const toggleSemiterminado = (insumoId: number, productoId: number) => {
        // Si no se han cargado los materiales, cargarlos
        if (!semiterminadosMateriales[insumoId]) {
            cargarMaterialesSemiterminado(insumoId, productoId);
        }

        // Cambiar el estado de expandido/colapsado
        setExpandedSemiterminados(prev => ({ 
            ...prev, 
            [insumoId]: !prev[insumoId] 
        }));
    };

    return (
        <Card variant="outline" borderColor="blue.200" w="full">
            <CardHeader bg="blue.50">
                <HStack>
                    <IconButton
                        aria-label="Buscar terminado"
                        icon={<FaSearch />}
                        onClick={onSearchClick}
                    />
                    <Heading size="sm">
                        {producto ? producto.nombre : 'Selecciona un terminado'}
                    </Heading>
                </HStack>
            </CardHeader>
            <Divider />
            <CardBody>
                {producto ? (
                    <VStack align="stretch" spacing={4}>
                        <VStack align="start" spacing={1}>
                            <Text fontSize="sm" fontWeight="medium">
                                Nombre: {producto.nombre}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                ID: {producto.productoId}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                Tipo: {producto.tipo_producto}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                Unidad: {producto.tipoUnidades}
                            </Text>
                            {/* Añadir esta línea para mostrar la categoría */}
                            {producto.categoriaNombre && (
                                <Text fontSize="sm" color="gray.600">
                                    Categoría: {producto.categoriaNombre}
                                </Text>
                            )}
                        </VStack>
                        <Divider />
                        <VStack align="stretch" spacing={2}>
                            <Text fontWeight="medium">
                                Insumos requeridos (Cantidad a producir: {cantidadAProducir})
                            </Text>
                            {insumos.length === 0 ? (
                                <Text fontSize="sm" color="gray.500">
                                    No se registran insumos para este producto.
                                </Text>
                            ) : (
                                <TableContainer>
                                    <Table variant="simple" size="sm">
                                        <Thead>
                                            <Tr>
                                                <Th>Código</Th>
                                                <Th>Insumo</Th>
                                                <Th>UMB</Th>
                                                <Th isNumeric>Cantidad Base</Th>
                                                <Th isNumeric>Cantidad Total</Th>
                                                <Th isNumeric>Stock Actual</Th>
                                                <Th>Estado</Th>
                                                <Th></Th> {/* Columna para el botón de expandir */}
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {insumos.map((insumo) => {
                                                const cantidadAjustada = calcularCantidadAjustada(insumo.cantidadRequerida);
                                                const tieneStock = verificarStockSuficiente(insumo);
                                                const esSemi = esSemiterminado(insumo);
                                                const isExpanded = expandedSemiterminados[insumo.insumoId] || false;

                                                return (
                                                    <React.Fragment key={insumo.insumoId}>
                                                        <Tr 
                                                            bg={esSemi ? "purple.50" : undefined}
                                                            borderLeftWidth={esSemi ? "4px" : "0"}
                                                            borderLeftColor="purple.400"
                                                        >
                                                            <Td>{insumo.productoId}</Td>
                                                            <Td fontWeight="medium">
                                                                {insumo.productoNombre}
                                                                {esSemi && (
                                                                    <Tag ml={2} size="sm" colorScheme="purple">
                                                                        Semiterminado
                                                                    </Tag>
                                                                )}
                                                            </Td>
                                                            <Td>{obtenerUMB(insumo.productoId)}</Td>
                                                            <Td isNumeric>{insumo.cantidadRequerida}</Td>
                                                            <Td isNumeric fontWeight="bold">{cantidadAjustada}</Td>
                                                            <Td isNumeric>{insumo.stockActual}</Td>
                                                            <Td>
                                                                <Tag colorScheme={tieneStock ? 'green' : 'red'}>
                                                                    {tieneStock ? 'Suficiente' : 'Insuficiente'}
                                                                </Tag>
                                                            </Td>
                                                            <Td>
                                                                {esSemi && (
                                                                    <IconButton
                                                                        aria-label="Ver materiales"
                                                                        icon={isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                                                        size="sm"
                                                                        colorScheme="purple"
                                                                        variant="outline"
                                                                        onClick={() => toggleSemiterminado(insumo.insumoId, insumo.productoId)}
                                                                        isLoading={loadingSemiterminados[insumo.insumoId]}
                                                                    />
                                                                )}
                                                            </Td>
                                                        </Tr>
                                                        {esSemi && (
                                                            <Tr>
                                                                <Td colSpan={8} p={0}>
                                                                    <Collapse in={isExpanded} animateOpacity>
                                                                        <Box 
                                                                            p={4} 
                                                                            bg="gray.50" 
                                                                            borderWidth="1px" 
                                                                            borderColor="purple.200"
                                                                            borderRadius="md"
                                                                            m={2}
                                                                        >
                                                                            <Flex align="center" mb={2}>
                                                                                <FaList color="purple" />
                                                                                <Text ml={2} fontWeight="bold" color="purple.700">
                                                                                    Materiales del semiterminado
                                                                                </Text>
                                                                            </Flex>

                                                                            {loadingSemiterminados[insumo.insumoId] ? (
                                                                                <Flex justify="center" py={4}>
                                                                                    <Spinner size="sm" color="purple.500" />
                                                                                    <Text ml={2} fontSize="sm">Cargando materiales...</Text>
                                                                                </Flex>
                                                                            ) : semiterminadosMateriales[insumo.insumoId]?.length > 0 ? (
                                                                                <Table variant="simple" size="sm" colorScheme="purple">
                                                                                    <Thead bg="purple.100">
                                                                                        <Tr>
                                                                                            <Th>Código</Th>
                                                                                            <Th>Material</Th>
                                                                                            <Th>UMB</Th>
                                                                                            <Th isNumeric>Cantidad</Th>
                                                                                            <Th isNumeric>Stock</Th>
                                                                                        </Tr>
                                                                                    </Thead>
                                                                                    <Tbody>
                                                                                        {semiterminadosMateriales[insumo.insumoId].map((material, idx) => (
                                                                                            <Tr key={`${insumo.insumoId}-material-${idx}`}>
                                                                                                <Td>{material.productoId}</Td>
                                                                                                <Td>{material.productoNombre}</Td>
                                                                                                <Td>{obtenerUMB(material.productoId)}</Td>
                                                                                                <Td isNumeric>{material.cantidadRequerida}</Td>
                                                                                                <Td isNumeric>{material.stockActual}</Td>
                                                                                            </Tr>
                                                                                        ))}
                                                                                    </Tbody>
                                                                                </Table>
                                                                            ) : (
                                                                                <Text fontSize="sm" color="gray.500" py={2}>
                                                                                    No se encontraron materiales para este semiterminado.
                                                                                </Text>
                                                                            )}
                                                                        </Box>
                                                                    </Collapse>
                                                                </Td>
                                                            </Tr>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            )}
                        </VStack>
                        <Text fontWeight="medium" color={canProduce ? 'green.600' : 'red.600'}>
                            {canProduce
                                ? `Stock suficiente para producir ${cantidadAProducir} unidad(es) de este producto.`
                                : `Stock insuficiente para producir ${cantidadAProducir} unidad(es) de este producto.`}
                        </Text>
                    </VStack>
                ) : (
                    <VStack align="stretch" spacing={3}>
                        <Text fontSize="sm" color="gray.600">
                            Aún no se ha seleccionado un producto terminado.
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                            Usa el botón de búsqueda para elegir un producto y ver sus detalles e insumos requeridos.
                        </Text>
                    </VStack>
                )}
            </CardBody>
        </Card>
    );
};

export default TerSemiTerCard;
