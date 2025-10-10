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
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { ProductoWithInsumos } from '../types';

interface TerSemiTerCardProps {
    productoSeleccionado: ProductoWithInsumos | null;
    canProduce: boolean;
    onSearchClick: () => void;
}

const TerSemiTerCard = ({ productoSeleccionado, canProduce, onSearchClick }: TerSemiTerCardProps) => {
    const producto = productoSeleccionado?.producto;
    const insumos = productoSeleccionado?.insumos ?? [];

    // Función para obtener la unidad de medida (UMB)
    // En una implementación real, esto debería venir del backend
    const obtenerUMB = (productoId: number): string => {
        // Por defecto retornamos "KG", pero esto debería ser reemplazado
        // con la lógica real para obtener la unidad de medida
        return "KG";
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
                            <Text fontWeight="medium">Insumos requeridos</Text>
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
                                                <Th isNumeric>Cantidad Requerida</Th>
                                                <Th isNumeric>Stock Actual</Th>
                                                <Th>Estado</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {insumos.map((insumo) => {
                                                const tieneStock = insumo.stockActual >= insumo.cantidadRequerida;
                                                return (
                                                    <Tr key={insumo.insumoId}>
                                                        <Td>{insumo.productoId}</Td>
                                                        <Td fontWeight="medium">{insumo.productoNombre}</Td>
                                                        <Td>{obtenerUMB(insumo.productoId)}</Td>
                                                        <Td isNumeric>{insumo.cantidadRequerida}</Td>
                                                        <Td isNumeric>{insumo.stockActual}</Td>
                                                        <Td>
                                                            <Tag colorScheme={tieneStock ? 'green' : 'red'}>
                                                                {tieneStock ? 'Suficiente' : 'Insuficiente'}
                                                            </Tag>
                                                        </Td>
                                                    </Tr>
                                                );
                                            })}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            )}
                        </VStack>
                        <Text fontWeight="medium" color={canProduce ? 'green.600' : 'red.600'}>
                            {canProduce
                                ? 'Stock suficiente para producir este producto.'
                                : 'Stock insuficiente en al menos un insumo.'}
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
