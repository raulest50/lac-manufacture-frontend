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

    return (
        <Card variant="outline" borderColor="blue.200" w="full">
            <CardHeader bg="blue.50">
                <HStack>
                    <IconButton
                        aria-label="Buscar terminado o semiterminado"
                        icon={<FaSearch />}
                        onClick={onSearchClick}
                    />
                    <Heading size="sm">
                        {producto ? producto.nombre : 'Selecciona un terminado/semiterminado'}
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
                        </VStack>
                        <Divider />
                        <VStack align="stretch" spacing={2}>
                            <Text fontWeight="medium">Insumos requeridos</Text>
                            {insumos.length === 0 ? (
                                <Text fontSize="sm" color="gray.500">
                                    No se registran insumos para este producto.
                                </Text>
                            ) : (
                                insumos.map((insumo) => {
                                    const tieneStock = insumo.stockActual >= insumo.cantidadRequerida;
                                    return (
                                        <Flex
                                            key={insumo.insumoId}
                                            justify="space-between"
                                            align="center"
                                            p={2}
                                            borderWidth="1px"
                                            borderRadius="md"
                                            borderColor={tieneStock ? 'green.200' : 'red.200'}
                                            bg={tieneStock ? 'green.50' : 'red.50'}
                                        >
                                            <Box>
                                                <Text fontSize="sm" fontWeight="medium">
                                                    {insumo.productoNombre}
                                                </Text>
                                                <Text fontSize="xs" color="gray.600">
                                                    Requerido: {insumo.cantidadRequerida}
                                                </Text>
                                            </Box>
                                            <Tag colorScheme={tieneStock ? 'green' : 'red'}>
                                                Stock: {insumo.stockActual}
                                            </Tag>
                                        </Flex>
                                    );
                                })
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
                            Aún no se ha seleccionado un producto terminado o semiterminado.
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
